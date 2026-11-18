import 'package:cloud_firestore/cloud_firestore.dart';

enum OrderStatus { pending, confirmed, shipped, delivered, cancelled }

class OrderLine {
  const OrderLine({
    required this.productId,
    required this.title,
    required this.image,
    required this.price,
    required this.quantity,
    required this.sellerId,
  });

  final String productId;
  final String title;
  final String image;
  final int price;
  final int quantity;
  final String sellerId;

  int get total => price * quantity;

  factory OrderLine.fromMap(Map<String, dynamic> m) => OrderLine(
        productId: m['productId'] as String? ?? '',
        title: m['title'] as String? ?? '',
        image: m['image'] as String? ?? '',
        price: (m['price'] as num?)?.toInt() ?? 0,
        quantity: (m['quantity'] as num?)?.toInt() ?? 1,
        sellerId: m['sellerId'] as String? ?? '',
      );

  Map<String, dynamic> toMap() => {
        'productId': productId,
        'title': title,
        'image': image,
        'price': price,
        'quantity': quantity,
        'sellerId': sellerId,
      };
}

class ShopOrder {
  const ShopOrder({
    required this.id,
    required this.buyerId,
    required this.buyerName,
    required this.lines,
    required this.total,
    required this.status,
    required this.address,
    required this.phone,
    required this.paymentMethod,
    this.createdAt,
  });

  final String id;
  final String buyerId;
  final String buyerName;
  final List<OrderLine> lines;
  final int total;
  final OrderStatus status;
  final String address;
  final String phone;
  final String paymentMethod;
  final DateTime? createdAt;

  /// Sellers that have items in this order (used by rules and queries).
  Set<String> get sellerIds => lines.map((l) => l.sellerId).toSet();

  factory ShopOrder.fromDoc(DocumentSnapshot<Map<String, dynamic>> doc) {
    final d = doc.data() ?? {};
    return ShopOrder(
      id: doc.id,
      buyerId: d['buyerId'] as String? ?? '',
      buyerName: d['buyerName'] as String? ?? '',
      lines: (d['lines'] as List? ?? const [])
          .map((e) => OrderLine.fromMap(Map<String, dynamic>.from(e as Map)))
          .toList(),
      total: (d['total'] as num?)?.toInt() ?? 0,
      status: OrderStatus.values.firstWhere(
        (s) => s.name == d['status'],
        orElse: () => OrderStatus.pending,
      ),
      address: d['address'] as String? ?? '',
      phone: d['phone'] as String? ?? '',
      paymentMethod: d['paymentMethod'] as String? ?? 'cash',
      createdAt: (d['createdAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toMap() => {
        'buyerId': buyerId,
        'buyerName': buyerName,
        'lines': lines.map((l) => l.toMap()).toList(),
        'sellerIds': sellerIds.toList(),
        'total': total,
        'status': status.name,
        'address': address,
        'phone': phone,
        'paymentMethod': paymentMethod,
        'createdAt': FieldValue.serverTimestamp(),
      };
}
