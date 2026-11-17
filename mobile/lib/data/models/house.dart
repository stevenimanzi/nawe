import 'package:cloud_firestore/cloud_firestore.dart';

/// A room, studio or house offered for rent (gueto / shelter).
class House {
  const House({
    required this.id,
    required this.ownerId,
    required this.ownerName,
    required this.title,
    required this.description,
    required this.pricePerMonth,
    required this.type,
    required this.bedrooms,
    required this.bathrooms,
    required this.areaSqm,
    required this.district,
    required this.address,
    required this.amenities,
    required this.images,
    this.available = true,
    this.createdAt,
  });

  final String id;
  final String ownerId;
  final String ownerName;
  final String title;
  final String description;
  final int pricePerMonth; // RWF
  final String type;
  final int bedrooms;
  final int bathrooms;
  final int areaSqm;
  final String district;
  final String address;
  final List<String> amenities;
  final List<String> images;
  final bool available;
  final DateTime? createdAt;

  String get cover => images.isEmpty ? '' : images.first;

  factory House.fromDoc(DocumentSnapshot<Map<String, dynamic>> doc) {
    final d = doc.data() ?? {};
    return House(
      id: doc.id,
      ownerId: d['ownerId'] as String? ?? '',
      ownerName: d['ownerName'] as String? ?? '',
      title: d['title'] as String? ?? '',
      description: d['description'] as String? ?? '',
      pricePerMonth: (d['pricePerMonth'] as num?)?.toInt() ?? 0,
      type: d['type'] as String? ?? 'House',
      bedrooms: (d['bedrooms'] as num?)?.toInt() ?? 0,
      bathrooms: (d['bathrooms'] as num?)?.toInt() ?? 0,
      areaSqm: (d['areaSqm'] as num?)?.toInt() ?? 0,
      district: d['district'] as String? ?? '',
      address: d['address'] as String? ?? '',
      amenities: List<String>.from(d['amenities'] as List? ?? const []),
      images: List<String>.from(d['images'] as List? ?? const []),
      available: d['available'] as bool? ?? true,
      createdAt: (d['createdAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toMap() => {
        'ownerId': ownerId,
        'ownerName': ownerName,
        'title': title,
        'description': description,
        'pricePerMonth': pricePerMonth,
        'type': type,
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'areaSqm': areaSqm,
        'district': district,
        'address': address,
        'amenities': amenities,
        'images': images,
        'available': available,
        'createdAt': FieldValue.serverTimestamp(),
      };
}
