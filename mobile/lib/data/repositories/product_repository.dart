import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/product.dart';
import 'auth_repository.dart';
import 'photo_repository.dart';

final productRepositoryProvider = Provider<ProductRepository>(
  (ref) => ProductRepository(ref.watch(firestoreProvider)),
);

/// All products, newest first.
final productsProvider = StreamProvider<List<Product>>(
  (ref) => ref.watch(productRepositoryProvider).watchAll(),
);

final productProvider = StreamProvider.family<Product?, String>(
  (ref, id) => ref.watch(productRepositoryProvider).watchOne(id),
);

/// Products listed by the signed-in seller.
final myProductsProvider = StreamProvider<List<Product>>((ref) {
  final uid = ref.watch(authStateProvider).value?.uid;
  if (uid == null) return Stream.value(const []);
  return ref.watch(productRepositoryProvider).watchBySeller(uid);
});

class ProductRepository {
  ProductRepository(this._db);

  final FirebaseFirestore _db;

  CollectionReference<Map<String, dynamic>> get _col =>
      _db.collection('products');

  Stream<List<Product>> watchAll() => _col
      .orderBy('createdAt', descending: true)
      .snapshots()
      .map((s) => s.docs.map(Product.fromDoc).toList());

  Stream<List<Product>> watchBySeller(String sellerId) => _col
      .where('sellerId', isEqualTo: sellerId)
      .snapshots()
      .map((s) => s.docs.map(Product.fromDoc).toList());

  Stream<Product?> watchOne(String id) => _col
      .doc(id)
      .snapshots()
      .map((d) => d.exists ? Product.fromDoc(d) : null);

  /// Publishes [product]; [photos] are stored beside it as full-size images.
  Future<void> create(Product product, {List<String> photos = const []}) {
    final ref = _col.doc();
    final batch = _db.batch()..set(ref, product.toMap());
    ListingPhotos.write(batch, ref, photos);
    return batch.commit();
  }

  Future<List<String>> photos(String id) => ListingPhotos.load(_col.doc(id));

  Future<void> update(String id, Map<String, dynamic> data) =>
      _col.doc(id).update(data);

  Future<void> delete(String id) async {
    final batch = _db.batch();
    await ListingPhotos.deleteAll(batch, _col.doc(id));
    batch.delete(_col.doc(id));
    await batch.commit();
  }
}

/// Full-size photos of one product, loaded on the detail screen.
final productPhotosProvider = FutureProvider.family<List<String>, String>(
  (ref, id) => ref.watch(productRepositoryProvider).photos(id),
);
