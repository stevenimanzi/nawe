import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole { client, seller }

/// A NAWE account. Clients buy and rent; sellers also list products and houses.
class AppUser {
  const AppUser({
    required this.uid,
    required this.name,
    required this.email,
    required this.role,
    this.phone = '',
    this.address = '',
    this.photoUrl = '',
    this.createdAt,
  });

  final String uid;
  final String name;
  final String email;
  final UserRole role;
  final String phone;
  final String address;
  final String photoUrl;
  final DateTime? createdAt;

  bool get isSeller => role == UserRole.seller;

  factory AppUser.fromDoc(DocumentSnapshot<Map<String, dynamic>> doc) {
    final d = doc.data() ?? {};
    return AppUser(
      uid: doc.id,
      name: d['name'] as String? ?? '',
      email: d['email'] as String? ?? '',
      role: d['role'] == 'seller' ? UserRole.seller : UserRole.client,
      phone: d['phone'] as String? ?? '',
      address: d['address'] as String? ?? '',
      photoUrl: d['photoUrl'] as String? ?? '',
      createdAt: (d['createdAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toMap() => {
        'name': name,
        'email': email,
        'role': role.name,
        'phone': phone,
        'address': address,
        'photoUrl': photoUrl,
        'createdAt': FieldValue.serverTimestamp(),
      };
}
