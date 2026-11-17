import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import '../../data/repositories/favorites_repository.dart';

/// Heart toggle that saves a product or house to the user's favorites.
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
    final scheme = Theme.of(context).colorScheme;

    return Material(
      color: scheme.surface.withValues(alpha: 0.92),
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: () => ref
            .read(favoritesRepositoryProvider)
            ?.toggle(type, id, saved: !saved),
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Icon(
            saved ? Icons.favorite : Icons.favorite_border,
            size: 20,
            color: saved ? AppColors.alert : scheme.onSurface,
          ),
        ),
      ),
    );
  }
}
