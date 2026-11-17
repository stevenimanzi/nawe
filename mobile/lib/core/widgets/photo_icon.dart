import 'package:flutter/material.dart';

/// Soft shadow that keeps a bare icon readable on top of a photo, so icons
/// never need a colored circle or box behind them.
const photoIconShadows = [Shadow(blurRadius: 8, color: Colors.black87)];

/// A white icon with a shadow, for use over photos.
class PhotoIcon extends StatelessWidget {
  const PhotoIcon(this.icon,
      {super.key, this.color = Colors.white, this.size = 26});

  final IconData icon;
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) =>
      Icon(icon, color: color, size: size, shadows: photoIconShadows);
}
