import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/catalog.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/net_image.dart';
import '../../core/widgets/state_views.dart';
import '../../data/models/order.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/order_repository.dart';
import 'widgets/order_status_chip.dart';

/// Full order details: progress, items, delivery info and seller actions.
class OrderDetailScreen extends ConsumerWidget {
  const OrderDetailScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final order = ref.watch(orderProvider(orderId));
    final uid = ref.watch(authStateProvider).value?.uid;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Order details'),
        leading: BackButton(
          onPressed: () => context.canPop() ? context.pop() : context.go('/home'),
        ),
      ),
      body: order.when(
        loading: () => const LoadingView(),
        error: (e, _) => const ErrorView(),
        data: (o) => o == null
            ? const EmptyView(
                icon: Icons.receipt_long_outlined, title: 'Order not found')
            : _Body(order: o, isSeller: o.sellerIds.contains(uid)),
      ),
    );
  }
}

class _Body extends ConsumerWidget {
  const _Body({required this.order, required this.isSeller});

  final ShopOrder order;
  final bool isSeller;

  static const _steps = [
    OrderStatus.pending,
    OrderStatus.confirmed,
    OrderStatus.shipped,
    OrderStatus.delivered,
  ];

  Future<void> _set(BuildContext context, WidgetRef ref, OrderStatus s) async {
    try {
      await ref.read(orderRepositoryProvider).updateStatus(order, s);
    } catch (_) {
      if (context.mounted) {
        showMessage(context, 'Could not update the order.', error: true);
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    final canCancelAsBuyer =
        !isSeller && order.status == OrderStatus.pending;
    final next = switch (order.status) {
      OrderStatus.pending => OrderStatus.confirmed,
      OrderStatus.confirmed => OrderStatus.shipped,
      OrderStatus.shipped => OrderStatus.delivered,
      _ => null,
    };

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Row(
          children: [
            Expanded(
              child: Text('Order #${order.id.substring(0, 6).toUpperCase()}',
                  style: text.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
            ),
            OrderStatusChip(order.status),
          ],
        ),
        const SizedBox(height: 4),
        Text(formatDateTime(order.createdAt),
            style: TextStyle(color: scheme.onSurfaceVariant)),
        const SizedBox(height: 22),
        if (order.status == OrderStatus.cancelled)
          const Tag('This order was cancelled',
              color: AppColors.alert, icon: Icons.cancel_outlined)
        else
          _Timeline(current: _steps.indexOf(order.status), steps: _steps),
        const SizedBox(height: 26),
        Text('Items',
            style: text.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 10),
        for (final l in order.lines)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Row(
              children: [
                SizedBox(
                    width: 56, height: 56, child: NetImage(l.image, radius: 12)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(l.title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                      Text('${l.quantity} × ${formatRwf(l.price)}',
                          style: TextStyle(
                              color: scheme.onSurfaceVariant, fontSize: 12)),
                    ],
                  ),
                ),
                Text(formatRwf(l.total),
                    style: const TextStyle(fontWeight: FontWeight.w700)),
              ],
            ),
          ),
        const Divider(height: 28),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Total', style: TextStyle(fontWeight: FontWeight.w700)),
            Text(formatRwf(order.total),
                style: text.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
          ],
        ),
        const SizedBox(height: 22),
        Text('Delivery',
            style: text.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: scheme.surfaceContainerHighest,
            borderRadius: BorderRadius.circular(18),
          ),
          child: Column(
            children: [
              _InfoRow(Icons.person_outline, order.buyerName),
              _InfoRow(Icons.place_outlined, order.address),
              _InfoRow(Icons.phone_outlined, order.phone),
              _InfoRow(Icons.payments_outlined,
                  Catalog.paymentMethods[order.paymentMethod] ?? order.paymentMethod),
            ],
          ),
        ),
        const SizedBox(height: 24),
        if (isSeller && next != null)
          FilledButton(
            onPressed: () => _set(context, ref, next),
            child: Text('Mark as ${next.name}'),
          ),
        if ((isSeller &&
                order.status != OrderStatus.delivered &&
                order.status != OrderStatus.cancelled) ||
            canCancelAsBuyer) ...[
          const SizedBox(height: 10),
          OutlinedButton(
            onPressed: () => _set(context, ref, OrderStatus.cancelled),
            child: const Text('Cancel order'),
          ),
        ],
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow(this.icon, this.value);

  final IconData icon;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Theme.of(context).colorScheme.onSurfaceVariant),
          const SizedBox(width: 12),
          Expanded(child: Text(value.isEmpty ? '-' : value)),
        ],
      ),
    );
  }
}

class _Timeline extends StatelessWidget {
  const _Timeline({required this.current, required this.steps});

  final int current;
  final List<OrderStatus> steps;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Row(
      children: [
        for (var i = 0; i < steps.length; i++) ...[
          Expanded(
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 3,
                        color: i == 0
                            ? Colors.transparent
                            : (i <= current ? AppColors.action : scheme.outline),
                      ),
                    ),
                    CircleAvatar(
                      radius: 11,
                      backgroundColor:
                          i <= current ? AppColors.action : scheme.outline,
                      child: i <= current
                          ? const Icon(Icons.check, size: 14, color: Colors.white)
                          : null,
                    ),
                    Expanded(
                      child: Container(
                        height: 3,
                        color: i == steps.length - 1
                            ? Colors.transparent
                            : (i < current ? AppColors.action : scheme.outline),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(capitalize(steps[i].name),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight:
                          i == current ? FontWeight.w800 : FontWeight.w500,
                      color: i <= current
                          ? scheme.onSurface
                          : scheme.onSurfaceVariant,
                    )),
              ],
            ),
          ),
        ],
      ],
    );
  }
}
