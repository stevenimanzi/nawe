import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// The NAWE mark (roof and N) from the brand assets, drawn with no
/// background so it sits directly on the page in light and dark mode.
class AppLogo extends StatelessWidget {
  const AppLogo({super.key, this.size = 72, this.color});

  final double size;

  /// Defaults to the current text color.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      'assets/brand/logo-glyph.svg',
      width: size,
      height: size,
      colorFilter: ColorFilter.mode(
        color ?? Theme.of(context).colorScheme.onSurface,
        BlendMode.srcIn,
      ),
      semanticsLabel: 'NAWE',
    );
  }
}
