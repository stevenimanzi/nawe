import '../../core/utils/formatters.dart';
import '../../data/models/house.dart';
import '../../data/models/product.dart';

/// What the assistant answers with: a message plus matching listings.
class AssistantReply {
  const AssistantReply(this.text,
      {this.products = const [], this.houses = const []});

  final String text;
  final List<Product> products;
  final List<House> houses;
}

/// Understands short shopping requests such as "a phone under 150k" or
/// "2 bedroom house in Kicukiro" and searches the live NAWE listings.
///
/// This is a keyword and budget matcher over the data in Firestore. It does
/// not call an external AI service.
class AssistantEngine {
  const AssistantEngine();

  static const _houseWords = {
    'house', 'houses', 'room', 'rooms', 'rent', 'rental', 'studio',
    'apartment', 'apartments', 'gueto', 'shelter', 'bedroom', 'bedrooms',
    'lodging', 'accommodation', 'home',
  };

  static const _stopWords = {
    'a', 'an', 'the', 'i', 'me', 'my', 'need', 'want', 'looking', 'for',
    'find', 'show', 'get', 'buy', 'with', 'under', 'below', 'less', 'than',
    'in', 'near', 'around', 'to', 'of', 'and', 'or', 'please', 'any',
    'cheap', 'good', 'best', 'budget', 'max', 'up', 'is', 'are', 'there',
    'do', 'you', 'have', 'some', 'can', 'rwf', 'frw', 'per', 'month',
  };

  static const _greetings = {'hi', 'hello', 'hey', 'help', 'start', 'hola'};

  AssistantReply reply(
    String message, {
    required List<Product> products,
    required List<House> houses,
  }) {
    final text = message.toLowerCase().trim();
    final words = RegExp(r"[a-z0-9']+")
        .allMatches(text)
        .map((m) => m.group(0)!)
        .toList();

    if (words.isEmpty || (words.length <= 2 && words.any(_greetings.contains))) {
      return const AssistantReply(
        'Hi! Tell me what you are looking for and your budget. '
        'For example: "a phone under 150k" or "2 bedroom house in Kicukiro".',
      );
    }

    final budget = _parseBudget(text);
    final wantsHouse = words.any(_houseWords.contains);
    final terms = words
        .where((w) =>
            !_stopWords.contains(w) &&
            !_houseWords.contains(w) &&
            double.tryParse(w.replaceAll("'", '')) == null &&
            !RegExp(r'^\d+k$').hasMatch(w) &&
            w.length > 1)
        .toList();

    return wantsHouse
        ? _findHouses(terms, budget, text, houses)
        : _findProducts(terms, budget, products);
  }

  /// Reads "under 150k", "below 2,000,000", "budget 80000" and so on.
  int? _parseBudget(String text) {
    final m = RegExp(
      r'(\d[\d,\.]*)\s*(k|m|million|thousand)?\b',
    ).allMatches(text).toList();
    int? best;
    for (final match in m) {
      final raw = match.group(1)!.replaceAll(',', '');
      var value = double.tryParse(raw);
      if (value == null) continue;
      final unit = match.group(2);
      if (unit == 'k' || unit == 'thousand') value *= 1000;
      if (unit == 'm' || unit == 'million') value *= 1000000;
      // Small bare numbers are probably bedroom counts, not prices.
      if (value < 1000) continue;
      best = value.round();
    }
    return best;
  }

  int? _parseBedrooms(String text) {
    final m = RegExp(r'(\d)\s*(?:-?\s*)(?:bed|bedroom)').firstMatch(text);
    return m == null ? null : int.tryParse(m.group(1)!);
  }

  AssistantReply _findProducts(
      List<String> terms, int? budget, List<Product> all) {
    final scored = <(Product, int)>[];
    for (final p in all) {
      if (!p.inStock) continue;
      if (budget != null && p.price > budget) continue;
      final haystack = '${p.title} ${p.category} ${p.description} '
              '${p.specs.values.join(' ')} ${p.condition}'
          .toLowerCase();
      var score = 0;
      for (final t in terms) {
        if (haystack.contains(t)) score += p.title.toLowerCase().contains(t) ? 3 : 1;
      }
      if (terms.isEmpty || score > 0) scored.add((p, score));
    }
    scored.sort((a, b) {
      final byScore = b.$2.compareTo(a.$2);
      return byScore != 0 ? byScore : a.$1.price.compareTo(b.$1.price);
    });
    final top = scored.take(6).map((e) => e.$1).toList();

    if (top.isEmpty) {
      return AssistantReply(
        budget == null
            ? 'I could not find a match for that. Try another word, like a category (phones, furniture, fashion).'
            : 'Nothing matches within ${formatRwf(budget)}. Try a higher budget or a different item.',
      );
    }
    final budgetNote = budget == null ? '' : ' under ${formatRwf(budget)}';
    return AssistantReply(
      'I found ${top.length} item${top.length == 1 ? '' : 's'}$budgetNote. '
      'Tap one to see photos, details and the seller.',
      products: top,
    );
  }

  AssistantReply _findHouses(
      List<String> terms, int? budget, String text, List<House> all) {
    final bedrooms = _parseBedrooms(text);
    final scored = <(House, int)>[];
    for (final h in all) {
      if (!h.available) continue;
      if (budget != null && h.pricePerMonth > budget) continue;
      if (bedrooms != null && h.bedrooms < bedrooms) continue;
      final haystack = '${h.title} ${h.district} ${h.address} ${h.type} '
              '${h.description} ${h.amenities.join(' ')}'
          .toLowerCase();
      var score = 0;
      for (final t in terms) {
        if (haystack.contains(t)) score += h.district.toLowerCase() == t ? 3 : 1;
      }
      if (terms.isEmpty || score > 0) scored.add((h, score));
    }
    scored.sort((a, b) {
      final byScore = b.$2.compareTo(a.$2);
      return byScore != 0
          ? byScore
          : a.$1.pricePerMonth.compareTo(b.$1.pricePerMonth);
    });
    final top = scored.take(5).map((e) => e.$1).toList();

    if (top.isEmpty) {
      return const AssistantReply(
        'No available houses match that yet. Try a different district, fewer bedrooms or a higher budget.',
      );
    }
    final budgetNote =
        budget == null ? '' : ' within ${formatRwf(budget)} per month';
    return AssistantReply(
      'Here ${top.length == 1 ? 'is 1 place' : 'are ${top.length} places'}$budgetNote. '
      'Open one to see photos and contact the owner.',
      houses: top,
    );
  }
}
