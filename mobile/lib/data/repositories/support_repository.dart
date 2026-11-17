import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/app_user.dart';
import 'auth_repository.dart';

final supportRepositoryProvider = Provider<SupportRepository>(
  (ref) => SupportRepository(ref.watch(firestoreProvider)),
);

/// Support requests, stored in `tickets` for the NAWE team to answer.
class SupportRepository {
  SupportRepository(this._db);

  final FirebaseFirestore _db;

  Future<void> submit({
    required AppUser user,
    required String subject,
    required String message,
  }) {
    return _db.collection('tickets').add({
      'userId': user.uid,
      'userName': user.name,
      'email': user.email,
      'subject': subject.trim(),
      'message': message.trim(),
      'status': 'open',
      'createdAt': FieldValue.serverTimestamp(),
    });
  }
}
