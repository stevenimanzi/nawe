import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/app_user.dart';

final firebaseAuthProvider = Provider<FirebaseAuth>((_) => FirebaseAuth.instance);
final firestoreProvider =
    Provider<FirebaseFirestore>((_) => FirebaseFirestore.instance);

/// Emits the signed-in Firebase user, or null when signed out.
final authStateProvider = StreamProvider<User?>(
  (ref) => ref.watch(firebaseAuthProvider).authStateChanges(),
);

/// Emits the signed-in user's profile document (role, phone, address...).
final currentUserProvider = StreamProvider<AppUser?>((ref) {
  final user = ref.watch(authStateProvider).value;
  if (user == null) return Stream.value(null);
  return ref
      .watch(firestoreProvider)
      .collection('users')
      .doc(user.uid)
      .snapshots()
      .map((doc) => doc.exists ? AppUser.fromDoc(doc) : null);
});

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepository(
    ref.watch(firebaseAuthProvider),
    ref.watch(firestoreProvider),
  ),
);

/// Sign-up, sign-in and profile writes backed by Firebase Auth + Firestore.
class AuthRepository {
  AuthRepository(this._auth, this._db);

  final FirebaseAuth _auth;
  final FirebaseFirestore _db;

  Future<void> signIn(String email, String password) async {
    await _auth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
    required UserRole role,
    String phone = '',
  }) async {
    final cred = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
    await cred.user!.updateDisplayName(name.trim());
    final profile = AppUser(
      uid: cred.user!.uid,
      name: name.trim(),
      email: email.trim(),
      role: role,
      phone: phone.trim(),
    );
    await _db.collection('users').doc(profile.uid).set(profile.toMap());
  }

  Future<void> sendPasswordReset(String email) =>
      _auth.sendPasswordResetEmail(email: email.trim());

  Future<void> signOut() => _auth.signOut();

  Future<void> updateProfile(
    String uid, {
    String? name,
    String? phone,
    String? address,
    UserRole? role,
  }) {
    return _db.collection('users').doc(uid).update({
      'name': ?name?.trim(),
      'phone': ?phone?.trim(),
      'address': ?address?.trim(),
      if (role != null) 'role': role.name,
    });
  }

  /// Turns Firebase Auth error codes into messages a person can act on.
  static String message(Object error) {
    if (error is FirebaseAuthException) {
      return switch (error.code) {
        'invalid-email' => 'That email address is not valid.',
        'user-disabled' => 'This account has been disabled.',
        'user-not-found' ||
        'wrong-password' ||
        'invalid-credential' =>
          'Wrong email or password.',
        'email-already-in-use' => 'An account with this email already exists.',
        'weak-password' => 'Choose a stronger password (6+ characters).',
        'network-request-failed' =>
          'No internet connection. Check your network and try again.',
        'too-many-requests' => 'Too many attempts. Try again in a few minutes.',
        'operation-not-allowed' =>
          'Email sign-in is not enabled for this project yet.',
        _ => error.message ?? 'Something went wrong. Please try again.',
      };
    }
    return 'Something went wrong. Please try again.';
  }
}
