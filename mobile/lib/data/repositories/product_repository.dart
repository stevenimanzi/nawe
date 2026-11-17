import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/product.dart';
import 'auth_repository.dart';

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

  Future<void> create(Product product) => _col.add(product.toMap());

  Future<void> update(String id, Map<String, dynamic> data) =>
      _col.doc(id).update(data);

  Future<void> delete(String id) => _col.doc(id).delete();
}

/// Uploads listing photos to Firebase Storage and returns their URLs.
class ImageUploader {
  ImageUploader(this._storage);

  final FirebaseStorage _storage;

  Future<List<String>> upload(String folder, List<File> files) async {
    final urls = <String>[];
    for (final file in files) {
      final name = '${DateTime.now().microsecondsSinceEpoch}.jpg';
      final ref = _storage.ref('$folder/$name');
      await ref.putFile(file);
      urls.add(await ref.getDownloadURL());
    }
    return urls;
  }
}

final imageUploaderProvider =
    Provider<ImageUploader>((_) => ImageUploader(FirebaseStorage.instance));
