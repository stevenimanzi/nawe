import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/cart_item.dart';
import '../models/product.dart';
import 'auth_repository.dart';

final cartRepositoryProvider = Provider<CartRepository?>((ref) {
  final uid = ref.watch(authStateProvider).value?.uid;
  if (uid == null) return null;
  return CartRepository(ref.watch(firestoreProvider), uid);
});

final cartProvider = StreamProvider<List<CartItem>>((ref) {
  final repo = ref.watch(cartRepositoryProvider);
  return repo?.watch() ?? Stream.value(const []);
});

final cartCountProvider = Provider<int>((ref) {
  final items = ref.watch(cartProvider).value ?? const [];
  return items.fold(0, (total, i) => total + i.quantity);
});

final cartTotalProvider = Provider<int>((ref) {
  final items = ref.watch(cartProvider).value ?? const [];
  return items.fold(0, (total, i) => total + i.lineTotal);
});

/// The signed-in user's cart, stored in `users/{uid}/cart`.
class CartRepository {
  CartRepository(this._db, this._uid);

  final FirebaseFirestore _db;
  final String _uid;

  CollectionReference<Map<String, dynamic>> get _col =>
      _db.collection('users').doc(_uid).collection('cart');

  Stream<List<CartItem>> watch() =>
      _col.snapshots().map((s) => s.docs.map(CartItem.fromDoc).toList());

  /// Adds [quantity] of [product], capped at the available stock.
  Future<void> add(Product product, {int quantity = 1}) async {
    final ref = _col.doc(product.id);
    final existing = await ref.get();
    final current = (existing.data()?['quantity'] as num?)?.toInt() ?? 0;
    final next = (current + quantity).clamp(1, product.stock);
    await ref.set(CartItem.fromProduct(product, quantity: next).toMap());
  }

  Future<void> setQuantity(String productId, int quantity) {
    if (quantity <= 0) return remove(productId);
    return _col.doc(productId).update({'quantity': quantity});
  }

  Future<void> remove(String productId) => _col.doc(productId).delete();

  Future<void> clear() async {
    final batch = _db.batch();
    for (final doc in (await _col.get()).docs) {
      batch.delete(doc.reference);
    }
    await batch.commit();
  }
}
