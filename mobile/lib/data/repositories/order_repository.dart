import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/app_user.dart';
import '../models/cart_item.dart';
import '../models/order.dart';
import 'auth_repository.dart';

final orderRepositoryProvider = Provider<OrderRepository>(
  (ref) => OrderRepository(ref.watch(firestoreProvider)),
);

/// Orders the signed-in user has placed.
final myOrdersProvider = StreamProvider<List<ShopOrder>>((ref) {
  final uid = ref.watch(authStateProvider).value?.uid;
  if (uid == null) return Stream.value(const []);
  return ref.watch(orderRepositoryProvider).watchForBuyer(uid);
});

/// Orders that contain items sold by the signed-in seller.
final sellerOrdersProvider = StreamProvider<List<ShopOrder>>((ref) {
  final uid = ref.watch(authStateProvider).value?.uid;
  if (uid == null) return Stream.value(const []);
  return ref.watch(orderRepositoryProvider).watchForSeller(uid);
});

final orderProvider = StreamProvider.family<ShopOrder?, String>(
  (ref, id) => ref.watch(orderRepositoryProvider).watchOne(id),
);

class OrderRepository {
  OrderRepository(this._db);

  final FirebaseFirestore _db;

  CollectionReference<Map<String, dynamic>> get _col => _db.collection('orders');

  Stream<List<ShopOrder>> watchForBuyer(String uid) => _col
      .where('buyerId', isEqualTo: uid)
      .snapshots()
      .map((s) => _newestFirst(s.docs.map(ShopOrder.fromDoc)));

  Stream<List<ShopOrder>> watchForSeller(String uid) => _col
      .where('sellerIds', arrayContains: uid)
      .snapshots()
      .map((s) => _newestFirst(s.docs.map(ShopOrder.fromDoc)));

  Stream<ShopOrder?> watchOne(String id) =>
      _col.doc(id).snapshots().map((d) => d.exists ? ShopOrder.fromDoc(d) : null);

  List<ShopOrder> _newestFirst(Iterable<ShopOrder> orders) {
    final list = orders.toList()
      ..sort((a, b) => (b.createdAt ?? DateTime.now())
          .compareTo(a.createdAt ?? DateTime.now()));
    return list;
  }

  /// Places an order for the cart, reduces stock, empties the cart and
  /// notifies the sellers, all in one atomic Firestore transaction.
  Future<String> place({
    required AppUser buyer,
    required List<CartItem> items,
    required String address,
    required String phone,
    required String paymentMethod,
  }) async {
    final orderRef = _col.doc();
    final cartCol =
        _db.collection('users').doc(buyer.uid).collection('cart');

    await _db.runTransaction((tx) async {
      final lines = <OrderLine>[];
      // Reads first: Firestore requires every read before any write.
      final stocks = <String, int>{};
      for (final item in items) {
        final snap = await tx.get(_db.collection('products').doc(item.productId));
        if (!snap.exists) {
          throw StateError('"${item.title}" is no longer available.');
        }
        final stock = (snap.data()?['stock'] as num?)?.toInt() ?? 0;
        if (stock < item.quantity) {
          throw StateError('Only $stock left of "${item.title}".');
        }
        stocks[item.productId] = stock;
      }

      for (final item in items) {
        lines.add(OrderLine(
          productId: item.productId,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          sellerId: item.sellerId,
        ));
        tx.update(_db.collection('products').doc(item.productId),
            {'stock': stocks[item.productId]! - item.quantity});
        tx.delete(cartCol.doc(item.productId));
      }

      final order = ShopOrder(
        id: orderRef.id,
        buyerId: buyer.uid,
        buyerName: buyer.name,
        lines: lines,
        total: lines.fold(0, (total, l) => total + l.total),
        status: OrderStatus.pending,
        address: address,
        phone: phone,
        paymentMethod: paymentMethod,
      );
      tx.set(orderRef, order.toMap());

      for (final sellerId in order.sellerIds) {
        tx.set(
          _db.collection('users').doc(sellerId).collection('notifications').doc(),
          {
            'title': 'New order',
            'body': '${buyer.name} placed an order. Open Orders to confirm it.',
            'read': false,
            'createdAt': FieldValue.serverTimestamp(),
          },
        );
      }
      tx.set(
        _db.collection('users').doc(buyer.uid).collection('notifications').doc(),
        {
          'title': 'ShopOrder placed',
          'body': 'We sent your order to the seller. You can track it in Orders.',
          'read': false,
          'createdAt': FieldValue.serverTimestamp(),
        },
      );
    });
    return orderRef.id;
  }

  /// Moves an order along its lifecycle and tells the buyer.
  Future<void> updateStatus(ShopOrder order, OrderStatus status) async {
    final batch = _db.batch();
    batch.update(_col.doc(order.id), {'status': status.name});
    batch.set(
      _db.collection('users').doc(order.buyerId).collection('notifications').doc(),
      {
        'title': 'ShopOrder ${status.name}',
        'body': 'Your order is now ${status.name}.',
        'read': false,
        'createdAt': FieldValue.serverTimestamp(),
      },
    );
    await batch.commit();
  }
}
