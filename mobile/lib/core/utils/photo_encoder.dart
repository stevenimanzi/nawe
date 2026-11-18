import 'dart:convert';
import 'dart:io';

import 'package:flutter_image_compress/flutter_image_compress.dart';

/// A listing's photos, shrunk to fit inside Firestore documents.
class EncodedPhotos {
  const EncodedPhotos({required this.thumb, required this.full});

  /// Small cover image stored on the listing itself so feeds load fast.
  final String thumb;

  /// Full-size gallery images, stored one per document in a `photos`
  /// sub-collection and loaded only on the detail screen.
  final List<String> full;
}

/// Turns picked image files into compressed `data:` URIs.
///
/// Firebase Storage needs a paid plan, so NAWE keeps photos in Firestore. A
/// 900 px JPEG at quality 70 is roughly 60-120 KB, comfortably under the
/// 1 MiB document limit.
abstract final class PhotoEncoder {
  static Future<EncodedPhotos> encode(List<File> files) async {
    final full = <String>[];
    String thumb = '';
    for (var i = 0; i < files.length; i++) {
      final big = await _compress(files[i], size: 900, quality: 70);
      full.add(big);
      if (i == 0) thumb = await _compress(files[i], size: 360, quality: 62);
    }
    return EncodedPhotos(thumb: thumb, full: full);
  }

  static Future<String> _compress(
    File file, {
    required int size,
    required int quality,
  }) async {
    final bytes = await FlutterImageCompress.compressWithFile(
      file.absolute.path,
      minWidth: size,
      minHeight: size,
      quality: quality,
      format: CompressFormat.jpeg,
    );
    if (bytes == null) throw const FormatException('Could not read the photo');
    return 'data:image/jpeg;base64,${base64Encode(bytes)}';
  }
}
