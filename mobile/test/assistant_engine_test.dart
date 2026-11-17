import 'package:flutter_test/flutter_test.dart';
import 'package:nawe_mobile/data/models/house.dart';
import 'package:nawe_mobile/data/models/product.dart';
import 'package:nawe_mobile/features/assistant/assistant_engine.dart';

Product _product(String title, int price,
        {String category = 'Phones', int stock = 1}) =>
    Product(
      id: title,
      sellerId: 's',
      sellerName: 'Seller',
      title: title,
      description: '$title in good shape',
      price: price,
      category: category,
      condition: 'Good',
      images: const [],
      specs: const {},
      stock: stock,
    );

House _house(String title, int rent,
        {int bedrooms = 2, String district = 'Kicukiro', bool available = true}) =>
    House(
      id: title,
      ownerId: 'o',
      ownerName: 'Owner',
      ownerPhone: '0788123456',
      title: title,
      description: 'Nice place',
      pricePerMonth: rent,
      type: 'House',
      bedrooms: bedrooms,
      bathrooms: 1,
      areaSqm: 60,
      district: district,
      address: 'Gikondo',
      amenities: const ['Water'],
      images: const [],
      available: available,
    );

void main() {
  const engine = AssistantEngine();
  final products = [
    _product('Samsung phone', 120000),
    _product('iPhone 11', 450000),
    _product('Grey sofa', 90000, category: 'Furniture'),
    _product('Old phone', 20000, stock: 0),
  ];
  final houses = [
    _house('Cosy house Kicukiro', 300000),
    _house('Big house Gasabo', 700000, district: 'Gasabo', bedrooms: 3),
    _house('Taken house', 200000, available: false),
  ];

  test('greets and explains how to ask', () {
    final reply = engine.reply('hello', products: products, houses: houses);
    expect(reply.products, isEmpty);
    expect(reply.text, contains('budget'));
  });

  test('respects a budget written with k', () {
    final reply =
        engine.reply('phone under 150k', products: products, houses: houses);
    expect(reply.products.map((p) => p.title), ['Samsung phone']);
  });

  test('never suggests sold-out items', () {
    final reply = engine.reply('old phone', products: products, houses: houses);
    expect(reply.products.map((p) => p.title), isNot(contains('Old phone')));
  });

  test('searches houses when the request mentions renting', () {
    final reply = engine.reply('house in Kicukiro',
        products: products, houses: houses);
    expect(reply.houses.map((h) => h.title), ['Cosy house Kicukiro']);
    expect(reply.products, isEmpty);
  });

  test('filters houses by bedrooms and skips taken ones', () {
    final reply = engine.reply('3 bedroom house',
        products: products, houses: houses);
    expect(reply.houses.map((h) => h.title), ['Big house Gasabo']);
  });

  test('says so when nothing matches', () {
    final reply =
        engine.reply('phone under 5k', products: products, houses: houses);
    expect(reply.products, isEmpty);
    expect(reply.text, contains('Nothing matches'));
  });
}
