import 'package:flutter/material.dart';

/// A titled section of a legal document.
class LegalSection {
  const LegalSection(this.heading, this.body);

  final String heading;
  final String body;
}

/// Scrollable document screen used for Terms and the Privacy policy.
class LegalScreen extends StatelessWidget {
  const LegalScreen({
    super.key,
    required this.title,
    required this.sections,
  });

  final String title;
  final List<LegalSection> sections;

  /// Terms & Conditions.
  factory LegalScreen.terms() => const LegalScreen(
        title: 'Terms & conditions',
        sections: [
          LegalSection('1. About NAWE',
              'NAWE is a marketplace that connects people who want to buy, sell or rent goods and houses. NAWE does not own the items or properties listed and is not a party to the agreement between buyers and sellers.'),
          LegalSection('2. Your account',
              'You must give accurate information when you register and keep your password private. You are responsible for everything that happens under your account. One person may keep one account.'),
          LegalSection('3. Listings',
              'Sellers and landlords must describe items and properties honestly, with real photos and correct prices. Illegal, stolen, counterfeit or dangerous goods are not allowed. NAWE may remove any listing that breaks these rules.'),
          LegalSection('4. Orders and payment',
              'Orders are requests sent to the seller. Payment is made directly to the seller on delivery unless the seller agrees otherwise. NAWE does not hold your money. Check items before you pay.'),
          LegalSection('5. Renting houses',
              'Rent, deposits and conditions are agreed directly between tenant and landlord. We recommend visiting the property and signing a written agreement before paying anything.'),
          LegalSection('6. Cancellations',
              'A buyer can cancel an order while it is still pending. After the seller confirms it, contact the seller to agree a cancellation.'),
          LegalSection('7. Acceptable use',
              'Do not harass others, post false information, try to break the app or use it for fraud. We may suspend accounts that do.'),
          LegalSection('8. Liability',
              'NAWE provides the app as is. To the extent allowed by law, NAWE is not responsible for losses arising from deals between users.'),
          LegalSection('9. Changes',
              'We may update these terms. When we make important changes we will tell you in the app. Continuing to use NAWE means you accept the updated terms.'),
        ],
      );

  /// Privacy policy.
  factory LegalScreen.privacy() => const LegalScreen(
        title: 'Privacy policy',
        sections: [
          LegalSection('What we collect',
              'Your name, email, phone number and delivery address; the listings you post; your orders, saved items and messages to support.'),
          LegalSection('How we use it',
              'To run your account, show your listings, process orders, let sellers contact you about an order, and answer support requests.'),
          LegalSection('Who can see it',
              'A seller sees your name, address and phone number only for orders you place with them. Landlords and sellers show their name and phone on their listings. We do not sell your data.'),
          LegalSection('Where it is stored',
              'Your data is stored with Google Firebase (Authentication, Cloud Firestore and Cloud Storage) under security rules that limit access to you and the people involved in your orders.'),
          LegalSection('Your choices',
              'You can edit your details in Profile at any time. To delete your account and data, contact support from the Help & support screen.'),
          LegalSection('Children',
              'NAWE is not meant for people under 18.'),
        ],
      );

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final muted = Theme.of(context).colorScheme.onSurfaceVariant;
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Last updated: November 2026',
              style: text.bodySmall?.copyWith(color: muted)),
          const SizedBox(height: 16),
          for (final s in sections) ...[
            Text(s.heading,
                style: text.titleSmall?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            Text(s.body, style: text.bodyMedium?.copyWith(height: 1.55)),
            const SizedBox(height: 18),
          ],
        ],
      ),
    );
  }
}
