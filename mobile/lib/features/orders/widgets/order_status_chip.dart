import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/widgets/common_widgets.dart';
import '../../../data/models/order.dart';

/// Colored label for an order's current status.
class OrderStatusChip extends StatelessWidget {
  const OrderStatusChip(this.status, {super.key});

  final OrderStatus status;

  static Color colorOf(OrderStatus s) => switch (s) {
        OrderStatus.pending => AppColors.gold,
        OrderStatus.confirmed => const Color(0xFF4DA3FF),
        OrderStatus.shipped => const Color(0xFF9B6BFF),
        OrderStatus.delivered => AppColors.actionHover,
        OrderStatus.cancelled => AppColors.alert,
      };

  @override
  Widget build(BuildContext context) =>
      Tag(capitalize(status.name), color: colorOf(status));
}
