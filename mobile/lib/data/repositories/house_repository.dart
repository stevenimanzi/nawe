import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/house.dart';
import 'auth_repository.dart';

final houseRepositoryProvider = Provider<HouseRepository>(
  (ref) => HouseRepository(ref.watch(firestoreProvider)),
);

final housesProvider = StreamProvider<List<House>>(
  (ref) => ref.watch(houseRepositoryProvider).watchAll(),
);

final houseProvider = StreamProvider.family<House?, String>(
  (ref, id) => ref.watch(houseRepositoryProvider).watchOne(id),
);

/// Houses listed by the signed-in landlord.
final myHousesProvider = StreamProvider<List<House>>((ref) {
  final uid = ref.watch(authStateProvider).value?.uid;
  if (uid == null) return Stream.value(const []);
  return ref.watch(houseRepositoryProvider).watchByOwner(uid);
});

class HouseRepository {
  HouseRepository(this._db);

  final FirebaseFirestore _db;

  CollectionReference<Map<String, dynamic>> get _col => _db.collection('houses');

  Stream<List<House>> watchAll() => _col
      .orderBy('createdAt', descending: true)
      .snapshots()
      .map((s) => s.docs.map(House.fromDoc).toList());

  Stream<List<House>> watchByOwner(String ownerId) => _col
      .where('ownerId', isEqualTo: ownerId)
      .snapshots()
      .map((s) => s.docs.map(House.fromDoc).toList());

  Stream<House?> watchOne(String id) =>
      _col.doc(id).snapshots().map((d) => d.exists ? House.fromDoc(d) : null);

  Future<void> create(House house) => _col.add(house.toMap());

  Future<void> setAvailable(String id, {required bool available}) =>
      _col.doc(id).update({'available': available});

  Future<void> delete(String id) => _col.doc(id).delete();
}
