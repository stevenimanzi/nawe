import 'package:cloud_firestore/cloud_firestore.dart';

/// A second-hand or new item listed in the marketplace.
class Product {
  const Product({
    required this.id,
    required this.sellerId,
    required this.sellerName,
    required this.title,
    required this.description,
    required this.price,
    required this.category,
    required this.condition,
    required this.images,
    required this.specs,
    required this.stock,
    this.location = '',
    this.rating = 0,
    this.ratingCount = 0,
    this.createdAt,
  });

  final String id;
  final String sellerId;
  final String sellerName;
  final String title;
  final String description;
  final int price; // RWF, whole francs
  final String category;
  final String condition;
  final List<String> images;
  final Map<String, String> specs;
  final int stock;
  final String location;
  final double rating;
  final int ratingCount;
  final DateTime? createdAt;

  String get cover => images.isEmpty ? '' : images.first;
  bool get inStock => stock > 0;

  factory Product.fromDoc(DocumentSnapshot<Map<String, dynamic>> doc) {
    final d = doc.data() ?? {};
    return Product(
      id: doc.id,
      sellerId: d['sellerId'] as String? ?? '',
      sellerName: d['sellerName'] as String? ?? '',
      title: d['title'] as String? ?? '',
      description: d['description'] as String? ?? '',
      price: (d['price'] as num?)?.toInt() ?? 0,
      category: d['category'] as String? ?? 'Other',
      condition: d['condition'] as String? ?? 'Good',
      images: List<String>.from(d['images'] as List? ?? const []),
      specs: Map<String, String>.from(
        (d['specs'] as Map? ?? const {}).map((k, v) => MapEntry('$k', '$v')),
      ),
      stock: (d['stock'] as num?)?.toInt() ?? 0,
      location: d['location'] as String? ?? '',
      rating: (d['rating'] as num?)?.toDouble() ?? 0,
      ratingCount: (d['ratingCount'] as num?)?.toInt() ?? 0,
      createdAt: (d['createdAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toMap() => {
        'sellerId': sellerId,
        'sellerName': sellerName,
        'title': title,
        'description': description,
        'price': price,
        'category': category,
        'condition': condition,
        'images': images,
        'specs': specs,
        'stock': stock,
        'location': location,
        'rating': rating,
        'ratingCount': ratingCount,
        'createdAt': FieldValue.serverTimestamp(),
      };
}
