import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/catalog.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/state_views.dart';
import '../../data/models/product.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/notification_repository.dart';
import '../../data/repositories/product_repository.dart';
import '../products/widgets/product_card.dart';

/// Client home: greeting, search, category chips, promo banner and products.
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String? _category;

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider).value;
    final products = ref.watch(productsProvider);
    final unread = ref.watch(unreadNotificationsProvider);
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    final firstName = (user?.name ?? '').split(' ').first;

    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/assistant'),
        backgroundColor: scheme.onSurface,
        foregroundColor: scheme.surface,
        icon: const Icon(Icons.auto_awesome),
        label: const Text('Ask NAWE'),
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async => ref.invalidate(productsProvider),
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Hello${firstName.isEmpty ? '' : ', $firstName'}',
                                style: text.bodyMedium?.copyWith(
                                    color: scheme.onSurfaceVariant)),
                            Text('Find what you need',
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
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                  child: GestureDetector(
                    onTap: () => context.push('/search'),
                    child: AbsorbPointer(
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Search products...',
                          prefixIcon: const Icon(Icons.search),
                          suffixIcon: const Icon(Icons.tune),
                          fillColor: scheme.surface,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: SizedBox(
                  height: 62,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.fromLTRB(20, 14, 20, 8),
                    children: [
                      for (final c in [null, ...Catalog.productCategories])
                        Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text(c ?? 'All'),
                            selected: _category == c,
                            labelStyle: TextStyle(
                              color: _category == c
                                  ? scheme.surface
                                  : scheme.onSurface,
                              fontWeight: FontWeight.w600,
                            ),
                            onSelected: (_) => setState(() => _category = c),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: _PromoBanner()),
              const SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.fromLTRB(20, 20, 20, 4),
                  child: SectionHeader('Fresh listings'),
                ),
              ),
              products.when(
                loading: () => const SliverFillRemaining(child: LoadingView()),
                error: (e, _) => SliverFillRemaining(
                  child: ErrorView(
                    onRetry: () => ref.invalidate(productsProvider),
                  ),
                ),
                data: (all) {
                  final list = _category == null
                      ? all
                      : all.where((p) => p.category == _category).toList();
                  if (list.isEmpty) {
                    return const SliverFillRemaining(
                      hasScrollBody: false,
                      child: EmptyView(
                        icon: Icons.inventory_2_outlined,
                        title: 'Nothing here yet',
                        message:
                            'No products match this category. Try another one.',
                      ),
                    );
                  }
                  return _ProductGrid(list);
                },
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 96)),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProductGrid extends StatelessWidget {
  const _ProductGrid(this.products);

  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
      sliver: SliverGrid.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 14,
          crossAxisSpacing: 14,
          childAspectRatio: 0.66,
        ),
        itemCount: products.length,
        itemBuilder: (_, i) => ProductCard(products[i]),
      ),
    );
  }
}

class _PromoBanner extends StatelessWidget {
  const _PromoBanner();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.panel,
          borderRadius: BorderRadius.circular(24),
          gradient: const LinearGradient(
            colors: [Color(0xFF242933), AppColors.panel],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Tag('Near you',
                      color: AppColors.gold, icon: Icons.place_outlined),
                  const SizedBox(height: 12),
                  Text('Great finds\nclose to home',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: AppColors.ink,
                          fontWeight: FontWeight.w800,
                          height: 1.2)),
                  const SizedBox(height: 6),
                  const Text('Items from sellers in your area.',
                      style: TextStyle(color: AppColors.mutedDark)),
                ],
              ),
            ),
            const Icon(Icons.local_mall_outlined,
                size: 64, color: AppColors.action),
          ],
        ),
      ),
    );
  }
}
