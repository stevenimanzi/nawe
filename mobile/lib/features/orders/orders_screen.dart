import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/utils/formatters.dart';
import '../../core/widgets/net_image.dart';
import '../../core/widgets/state_views.dart';
import '../../data/models/order.dart';
import '../../data/repositories/order_repository.dart';
import 'widgets/order_status_chip.dart';

/// The buyer's order history. With [asSeller] it lists orders to fulfil.
class OrdersScreen extends ConsumerWidget {
  const OrdersScreen({super.key, this.asSeller = false});

  final bool asSeller;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders =
        ref.watch(asSeller ? sellerOrdersProvider : myOrdersProvider);
    final canPop = context.canPop();

    return Scaffold(
      appBar: AppBar(
        title: Text(asSeller ? 'Customer orders' : 'My orders'),
        automaticallyImplyLeading: canPop,
      ),
      body: orders.when(
        loading: () => const LoadingView(),
        error: (e, _) => ErrorView(
          onRetry: () => ref
              .invalidate(asSeller ? sellerOrdersProvider : myOrdersProvider),
        ),
        data: (list) {
          if (list.isEmpty) {
            return EmptyView(
              icon: Icons.receipt_long_outlined,
              title: asSeller ? 'No orders yet' : 'No orders yet',
              message: asSeller
                  ? 'When customers buy your products, their orders show up here.'
                  : 'Your orders will appear here after you check out.',
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(20),
            itemCount: list.length,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (_, i) => OrderTile(list[i], asSeller: asSeller),
          );
        },
      ),
    );
  }
}

class OrderTile extends StatelessWidget {
  const OrderTile(this.order, {super.key, this.asSeller = false});

  final ShopOrder order;
  final bool asSeller;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final first = order.lines.isEmpty ? null : order.lines.first;
    final itemCount = order.lines.fold<int>(0, (n, l) => n + l.quantity);
    return GestureDetector(
      onTap: () => context.push('/order/${order.id}'),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              SizedBox(
                width: 64,
                height: 64,
                child: NetImage(first?.image ?? '', radius: 14),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            asSeller
                                ? order.buyerName
                                : 'Order #${order.id.substring(0, 6).toUpperCase()}',
                            style: const TextStyle(fontWeight: FontWeight.w800),
                          ),
                        ),
                        OrderStatusChip(order.status),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '$itemCount item${itemCount == 1 ? '' : 's'}  ·  ${formatDateTime(order.createdAt)}',
                      style: TextStyle(
                          color: scheme.onSurfaceVariant, fontSize: 12),
                    ),
                    const SizedBox(height: 6),
                    Text(formatRwf(order.total),
                        style: const TextStyle(fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
