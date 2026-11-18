import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/photo_icon.dart';
import '../../data/repositories/favorites_repository.dart';

/// Heart toggle that saves a product or house to the user's favorites.
///
/// It sits on photos, so it is a bare icon with a shadow, no background.
class FavoriteButton extends ConsumerWidget {
  const FavoriteButton({super.key, required this.type, required this.id});

  /// `product` or `house`.
  final String type;
  final String id;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saved = ref
            .watch(favoriteKeysProvider)
            .value
            ?.contains(favoriteKey(type, id)) ??
        false;

    return IconButton(
      visualDensity: VisualDensity.compact,
      onPressed: () => ref
          .read(favoritesRepositoryProvider)
          ?.toggle(type, id, saved: !saved),
      icon: PhotoIcon(
        saved ? Icons.favorite : Icons.favorite_border,
        color: saved ? AppColors.alert : Colors.white,
        size: 24,
      ),
    );
  }
}
