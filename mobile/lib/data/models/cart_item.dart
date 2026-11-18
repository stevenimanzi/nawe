import 'package:cloud_firestore/cloud_firestore.dart';

import 'product.dart';

/// A product snapshot in the user's cart with the chosen quantity.
///
/// The cart keeps its own copy of the title, price and image so the cart
/// renders instantly and survives a seller editing the listing.
class CartItem {
  const CartItem({
    required this.productId,
    required this.title,
    required this.image,
    required this.price,
    required this.sellerId,
    required this.sellerName,
    required this.stock,
    required this.quantity,
  });

  final String productId;
  final String title;
  final String image;
  final int price;
  final String sellerId;
  final String sellerName;
  final int stock;
  final int quantity;

  int get lineTotal => price * quantity;

  factory CartItem.fromProduct(Product p, {int quantity = 1}) => CartItem(
        productId: p.id,
        title: p.title,
        image: p.cover,
        price: p.price,
        sellerId: p.sellerId,
        sellerName: p.sellerName,
        stock: p.stock,
        quantity: quantity,
      );

  factory CartItem.fromDoc(DocumentSnapshot<Map<String, dynamic>> doc) {
    final d = doc.data() ?? {};
    return CartItem(
      productId: doc.id,
      title: d['title'] as String? ?? '',
      image: d['image'] as String? ?? '',
      price: (d['price'] as num?)?.toInt() ?? 0,
      sellerId: d['sellerId'] as String? ?? '',
      sellerName: d['sellerName'] as String? ?? '',
      stock: (d['stock'] as num?)?.toInt() ?? 0,
      quantity: (d['quantity'] as num?)?.toInt() ?? 1,
    );
  }

  Map<String, dynamic> toMap() => {
        'title': title,
        'image': image,
        'price': price,
        'sellerId': sellerId,
        'sellerName': sellerName,
        'stock': stock,
        'quantity': quantity,
      };
}
