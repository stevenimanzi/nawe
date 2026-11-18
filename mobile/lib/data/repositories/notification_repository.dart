import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/app_notification.dart';
import 'auth_repository.dart';

final notificationRepositoryProvider = Provider<NotificationRepository?>((ref) {
  final uid = ref.watch(authStateProvider).value?.uid;
  if (uid == null) return null;
  return NotificationRepository(ref.watch(firestoreProvider), uid);
});

final notificationsProvider = StreamProvider<List<AppNotification>>((ref) {
  final repo = ref.watch(notificationRepositoryProvider);
  return repo?.watch() ?? Stream.value(const []);
});

final unreadNotificationsProvider = Provider<int>((ref) {
  final list = ref.watch(notificationsProvider).value ?? const [];
  return list.where((n) => !n.read).length;
});

class NotificationRepository {
  NotificationRepository(this._db, this._uid);

  final FirebaseFirestore _db;
  final String _uid;

  CollectionReference<Map<String, dynamic>> get _col =>
      _db.collection('users').doc(_uid).collection('notifications');

  Stream<List<AppNotification>> watch() => _col
      .orderBy('createdAt', descending: true)
      .limit(50)
      .snapshots()
      .map((s) => s.docs.map(AppNotification.fromDoc).toList());

  Future<void> markAllRead() async {
    final unread = await _col.where('read', isEqualTo: false).get();
    final batch = _db.batch();
    for (final doc in unread.docs) {
      batch.update(doc.reference, {'read': true});
    }
    await batch.commit();
  }
}
