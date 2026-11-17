import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/widgets/common_widgets.dart';
import '../../../core/widgets/net_image.dart';
import '../../../data/models/house.dart';
import '../../favorites/favorite_button.dart';

/// Wide card for a house: large photo, rent per month and key facts.
class HouseCard extends StatelessWidget {
  const HouseCard(this.house, {super.key});

  final House house;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    return GestureDetector(
      onTap: () => context.push('/house/${house.id}'),
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 1.7,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  NetImage(house.cover),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: FavoriteButton(type: 'house', id: house.id),
                  ),
                  Positioned(
                    top: 10,
                    left: 10,
                    child: house.available
                        ? Tag(house.type)
                        : const Tag('Taken', color: AppColors.alert),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(house.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: text.titleSmall
                          ?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(Icons.place_outlined,
                          size: 15, color: scheme.onSurfaceVariant),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          '${house.district}${house.address.isEmpty ? '' : ', ${house.address}'}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: text.bodySmall
                              ?.copyWith(color: scheme.onSurfaceVariant),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Text(formatRwf(house.pricePerMonth),
                          style: text.titleSmall?.copyWith(
                              fontWeight: FontWeight.w800,
                              color: scheme.brightness == Brightness.dark
                                  ? AppColors.actionHover
                                  : AppColors.action)),
                      Text(' / month',
                          style: text.bodySmall
                              ?.copyWith(color: scheme.onSurfaceVariant)),
                      const Spacer(),
                      _Fact(Icons.bed_outlined, '${house.bedrooms}'),
                      const SizedBox(width: 12),
                      _Fact(Icons.bathtub_outlined, '${house.bathrooms}'),
                      const SizedBox(width: 12),
                      _Fact(Icons.square_foot, '${house.areaSqm} m²'),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Fact extends StatelessWidget {
  const _Fact(this.icon, this.value);

  final IconData icon;
  final String value;

  @override
  Widget build(BuildContext context) {
    final muted = Theme.of(context).colorScheme.onSurfaceVariant;
    return Row(
      children: [
        Icon(icon, size: 16, color: muted),
        const SizedBox(width: 3),
        Text(value, style: TextStyle(fontSize: 12, color: muted)),
      ],
    );
  }
}
