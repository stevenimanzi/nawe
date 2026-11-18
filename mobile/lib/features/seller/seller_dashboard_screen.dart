import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/common_widgets.dart';
import '../../data/models/order.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/house_repository.dart';
import '../../data/repositories/notification_repository.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/repositories/product_repository.dart';
import '../orders/orders_screen.dart';

/// Seller home: key numbers, quick actions and the latest customer orders.
class SellerDashboardScreen extends ConsumerWidget {
  const SellerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider).value;
    final products = ref.watch(myProductsProvider).value ?? const [];
    final houses = ref.watch(myHousesProvider).value ?? const [];
    final orders = ref.watch(sellerOrdersProvider).value ?? const [];
    final unread = ref.watch(unreadNotificationsProvider);
    final uid = user?.uid;

    final pending =
        orders.where((o) => o.status == OrderStatus.pending).length;
    // Revenue counts only this seller's lines from delivered orders.
    final revenue = orders
        .where((o) => o.status == OrderStatus.delivered)
        .expand((o) => o.lines)
        .where((l) => l.sellerId == uid)
        .fold<int>(0, (sum, l) => sum + l.total);
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Seller dashboard',
                          style: text.bodyMedium
                              ?.copyWith(color: scheme.onSurfaceVariant)),
                      Text(user?.name ?? '',
                          style: text.titleLarge
                              ?.copyWith(fontWeight: FontWeight.w800)),
                    ],
                  ),
                ),
                Badge(
                  isLabelVisible: unread > 0,
                  label: Text('$unread'),
                  child: IconButton(
                    onPressed: () => context.push('/notifications'),
                    icon: const Icon(Icons.notifications_none),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.45,
              children: [
                _Stat(Icons.inventory_2_outlined, 'Products', '${products.length}'),
                _Stat(Icons.home_work_outlined, 'Houses', '${houses.length}'),
                _Stat(Icons.hourglass_bottom, 'Pending orders', '$pending',
                    accent: pending > 0 ? AppColors.gold : null),
                _Stat(Icons.payments_outlined, 'Delivered sales',
                    formatRwf(revenue)),
              ],
            ),
            const SizedBox(height: 22),
            Row(
              children: [
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () => context.push('/seller/new-product'),
                    icon: const Icon(Icons.add),
                    label: const Text('Add product'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => context.push('/seller/new-house'),
                    icon: const Icon(Icons.add_home_outlined),
                    label: const Text('Add house'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 26),
            SectionHeader(
              'Latest orders',
              actionLabel: 'View all',
              onAction: () => context.go('/seller/orders'),
            ),
            const SizedBox(height: 8),
            if (orders.isEmpty)
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: scheme.surface,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'No orders yet. When a customer buys one of your products, it appears here.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: scheme.onSurfaceVariant),
                ),
              )
            else
              for (final o in orders.take(3))
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: OrderTile(o, asSeller: true),
                ),
          ],
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat(this.icon, this.label, this.value, {this.accent});

  final IconData icon;
  final String label;
  final String value;
  final Color? accent;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: accent ?? scheme.outline.withValues(alpha: 0.6)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: accent ?? scheme.onSurfaceVariant),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(value,
                    style: Theme.of(context)
                        .textTheme
                        .titleLarge
                        ?.copyWith(fontWeight: FontWeight.w800)),
              ),
              Text(label,
                  style: TextStyle(
                      color: scheme.onSurfaceVariant, fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }
}
