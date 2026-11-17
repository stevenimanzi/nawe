import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'auth_repository.dart';

final favoritesRepositoryProvider = Provider<FavoritesRepository?>((ref) {
  final uid = ref.watch(authStateProvider).value?.uid;
  if (uid == null) return null;
  return FavoritesRepository(ref.watch(firestoreProvider), uid);
});

/// Ids of everything the user saved, as `product:<id>` or `house:<id>`.
final favoriteKeysProvider = StreamProvider<Set<String>>((ref) {
  final repo = ref.watch(favoritesRepositoryProvider);
  return repo?.watchKeys() ?? Stream.value(const <String>{});
});

String favoriteKey(String type, String id) => '$type:$id';

class FavoritesRepository {
  FavoritesRepository(this._db, this._uid);

  final FirebaseFirestore _db;
  final String _uid;

  CollectionReference<Map<String, dynamic>> get _col =>
      _db.collection('users').doc(_uid).collection('favorites');

  Stream<Set<String>> watchKeys() =>
      _col.snapshots().map((s) => s.docs.map((d) => d.id).toSet());

  Future<void> toggle(String type, String id, {required bool saved}) {
    final ref = _col.doc(favoriteKey(type, id));
    return saved
        ? ref.set({'type': type, 'refId': id, 'savedAt': FieldValue.serverTimestamp()})
        : ref.delete();
  }
}
