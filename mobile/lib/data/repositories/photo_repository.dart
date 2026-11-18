import 'package:cloud_firestore/cloud_firestore.dart';

/// Stores a listing's full-size photos as documents in a `photos`
/// sub-collection, so listing feeds stay small and fast.
abstract final class ListingPhotos {
  static CollectionReference<Map<String, dynamic>> _photos(
          DocumentReference<Map<String, dynamic>> listing) =>
      listing.collection('photos');

  /// Queues writes for [photos] on [batch].
  static void write(
    WriteBatch batch,
    DocumentReference<Map<String, dynamic>> listing,
    List<String> photos,
  ) {
    for (var i = 0; i < photos.length; i++) {
      batch.set(_photos(listing).doc(i.toString().padLeft(2, '0')), {
        'data': photos[i],
        'order': i,
      });
    }
  }

  static Future<List<String>> load(
      DocumentReference<Map<String, dynamic>> listing) async {
    final snap = await _photos(listing).orderBy('order').get();
    return snap.docs.map((d) => d.data()['data'] as String).toList();
  }

  /// Queues deletion of every photo of [listing] on [batch].
  static Future<void> deleteAll(
    WriteBatch batch,
    DocumentReference<Map<String, dynamic>> listing,
  ) async {
    for (final doc in (await _photos(listing).get()).docs) {
      batch.delete(doc.reference);
    }
  }
}
