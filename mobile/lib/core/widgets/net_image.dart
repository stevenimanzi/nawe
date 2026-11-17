import 'dart:convert';
import 'dart:typed_data';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

/// Shows a listing photo from either an `https` URL or an inline `data:` URI,
/// with a quiet placeholder and a graceful error state.
class NetImage extends StatelessWidget {
  const NetImage(
    this.source, {
    super.key,
    this.fit = BoxFit.cover,
    this.radius = 0,
  });

  final String source;
  final BoxFit fit;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final fallback = ColoredBox(
      color: scheme.surfaceContainerHighest,
      child: Center(
        child: Icon(Icons.image_outlined, color: scheme.onSurfaceVariant),
      ),
    );

    final Widget image;
    if (source.isEmpty) {
      image = fallback;
    } else if (source.startsWith('data:')) {
      image = _DataImage(source, fit: fit, fallback: fallback);
    } else {
      image = CachedNetworkImage(
        imageUrl: source,
        fit: fit,
        fadeInDuration: const Duration(milliseconds: 180),
        placeholder: (_, _) =>
            ColoredBox(color: scheme.surfaceContainerHighest),
        errorWidget: (_, _, _) => fallback,
      );
    }

    return radius == 0
        ? image
        : ClipRRect(borderRadius: BorderRadius.circular(radius), child: image);
  }
}

/// Decodes a base64 data URI once, so rebuilds do not decode it again.
class _DataImage extends StatefulWidget {
  const _DataImage(this.uri, {required this.fit, required this.fallback});

  final String uri;
  final BoxFit fit;
  final Widget fallback;

  @override
  State<_DataImage> createState() => _DataImageState();
}

class _DataImageState extends State<_DataImage> {
  Uint8List? _bytes;

  @override
  void initState() {
    super.initState();
    _decode();
  }

  @override
  void didUpdateWidget(_DataImage old) {
    super.didUpdateWidget(old);
    if (old.uri != widget.uri) _decode();
  }

  void _decode() {
    try {
      _bytes = base64Decode(widget.uri.substring(widget.uri.indexOf(',') + 1));
    } on FormatException {
      _bytes = null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final bytes = _bytes;
    if (bytes == null) return widget.fallback;
    return Image.memory(
      bytes,
      fit: widget.fit,
      gaplessPlayback: true,
      errorBuilder: (_, _, _) => widget.fallback,
    );
  }
}
