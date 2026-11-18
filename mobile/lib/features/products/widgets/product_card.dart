import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/widgets/common_widgets.dart';
import '../../../core/widgets/net_image.dart';
import '../../../data/models/product.dart';
import '../../favorites/favorite_button.dart';

/// Grid card for a product: photo, title, price, rating and a save button.
class ProductCard extends StatelessWidget {
  const ProductCard(this.product, {super.key});

  final Product product;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    return GestureDetector(
      onTap: () => context.push('/product/${product.id}'),
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 1.08,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  NetImage(product.cover),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: FavoriteButton(type: 'product', id: product.id),
                  ),
                  if (!product.inStock)
                    Positioned(
                      left: 8,
                      top: 8,
                      child: const Tag('Sold out', color: AppColors.alert),
                    ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(product.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: text.titleSmall
                          ?.copyWith(fontWeight: FontWeight.w700, height: 1.25)),
                  const SizedBox(height: 4),
                  Text(
                    '${product.condition}  ·  ${product.location.isEmpty ? product.category : product.location}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: text.bodySmall
                        ?.copyWith(color: scheme.onSurfaceVariant),
                  ),
                  const SizedBox(height: 8),
                  Text(formatRwf(product.price),
                      style: text.titleSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: scheme.brightness == Brightness.dark
                              ? AppColors.actionHover
                              : AppColors.action)),
                  const SizedBox(height: 4),
                  RatingBadge(
                      rating: product.rating, count: product.ratingCount),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
