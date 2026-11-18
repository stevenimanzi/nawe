import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/net_image.dart';
import '../../core/widgets/state_views.dart';
import '../../data/demo_data.dart';
import '../../data/models/house.dart';
import '../../data/models/product.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/house_repository.dart';
import '../../data/repositories/product_repository.dart';

/// The seller's own products and houses, with stock and availability controls.
class SellerListingsScreen extends ConsumerWidget {
  const SellerListingsScreen({super.key});

  Future<void> _confirmDelete(
    BuildContext context,
    String what,
    Future<void> Function() delete,
  ) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text('Delete $what?'),
        content: const Text('This removes the listing for everyone.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Keep')),
          TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Delete')),
        ],
      ),
    );
    if (ok == true) await delete();
  }

  Future<void> _loadDemo(BuildContext context, WidgetRef ref) async {
    final user = ref.read(currentUserProvider).value;
    if (user == null) return;
    final products = ref.read(productRepositoryProvider);
    final houses = ref.read(houseRepositoryProvider);
    try {
      for (final p in DemoData.products(user)) {
        await products.create(p);
      }
      for (final h in DemoData.houses(user)) {
        await houses.create(h);
      }
      if (context.mounted) showMessage(context, 'Sample listings added.');
    } catch (_) {
      if (context.mounted) {
        showMessage(context, 'Could not add sample listings.', error: true);
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final products = ref.watch(myProductsProvider);
    final houses = ref.watch(myHousesProvider);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My listings'),
          bottom: const TabBar(
              tabs: [Tab(text: 'Products'), Tab(text: 'Houses')]),
          actions: [
            PopupMenuButton<String>(
              onSelected: (_) => _loadDemo(context, ref),
              itemBuilder: (_) => const [
                PopupMenuItem(
                    value: 'demo', child: Text('Add sample listings')),
              ],
            ),
          ],
        ),
        floatingActionButton: Builder(
          builder: (context) => FloatingActionButton.extended(
            onPressed: () {
              final tab = DefaultTabController.of(context).index;
              context.push(tab == 0 ? '/seller/new-product' : '/seller/new-house');
            },
            icon: const Icon(Icons.add),
            label: const Text('Add'),
          ),
        ),
        body: TabBarView(
          children: [
            products.when(
              loading: () => const LoadingView(),
              error: (e, _) => const ErrorView(),
              data: (list) => list.isEmpty
                  ? const EmptyView(
                      icon: Icons.inventory_2_outlined,
                      title: 'No products yet',
                      message: 'Tap Add to publish your first product.',
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 96),
                      itemCount: list.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (_, i) => _ProductRow(
                        list[i],
                        onDelete: () => _confirmDelete(
                          context,
                          'this product',
                          () => ref
                              .read(productRepositoryProvider)
                              .delete(list[i].id),
                        ),
                      ),
                    ),
            ),
            houses.when(
              loading: () => const LoadingView(),
              error: (e, _) => const ErrorView(),
              data: (list) => list.isEmpty
                  ? const EmptyView(
                      icon: Icons.home_work_outlined,
                      title: 'No houses yet',
                      message: 'Tap Add to publish a room or house for rent.',
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 96),
                      itemCount: list.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (_, i) => _HouseRow(
                        list[i],
                        onToggle: (v) => ref
                            .read(houseRepositoryProvider)
                            .setAvailable(list[i].id, available: v),
                        onDelete: () => _confirmDelete(
                          context,
                          'this house',
                          () => ref
                              .read(houseRepositoryProvider)
                              .delete(list[i].id),
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProductRow extends ConsumerWidget {
  const _ProductRow(this.product, {required this.onDelete});

  final Product product;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scheme = Theme.of(context).colorScheme;
    return GestureDetector(
      onTap: () => context.push('/product/${product.id}'),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Row(
            children: [
              SizedBox(
                  width: 76,
                  height: 76,
                  child: NetImage(product.cover, radius: 14)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 4),
                    Text(formatRwf(product.price),
                        style: const TextStyle(fontWeight: FontWeight.w800)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        product.inStock
                            ? Tag('${product.stock} in stock')
                            : const Tag('Sold out', color: AppColors.alert),
                        const Spacer(),
                        IconButton(
                          visualDensity: VisualDensity.compact,
                          onPressed: onDelete,
                          icon: Icon(Icons.delete_outline,
                              color: scheme.onSurfaceVariant),
                        ),
                      ],
                    ),
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

class _HouseRow extends StatelessWidget {
  const _HouseRow(this.house, {required this.onToggle, required this.onDelete});

  final House house;
  final ValueChanged<bool> onToggle;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return GestureDetector(
      onTap: () => context.push('/house/${house.id}'),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Row(
            children: [
              SizedBox(
                  width: 76,
                  height: 76,
                  child: NetImage(house.cover, radius: 14)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(house.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 4),
                    Text('${formatRwf(house.pricePerMonth)} / month',
                        style: const TextStyle(fontWeight: FontWeight.w800)),
                    Row(
                      children: [
                        Text(house.available ? 'Available' : 'Taken',
                            style: TextStyle(
                                color: scheme.onSurfaceVariant, fontSize: 12)),
                        Switch(value: house.available, onChanged: onToggle),
                        const Spacer(),
                        IconButton(
                          visualDensity: VisualDensity.compact,
                          onPressed: onDelete,
                          icon: Icon(Icons.delete_outline,
                              color: scheme.onSurfaceVariant),
                        ),
                      ],
                    ),
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
