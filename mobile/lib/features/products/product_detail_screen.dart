import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/photo_icon.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/net_image.dart';
import '../../core/widgets/state_views.dart';
import '../../data/models/product.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/cart_repository.dart';
import '../../data/repositories/product_repository.dart';
import '../favorites/favorite_button.dart';
import 'widgets/spec_table.dart';

class ProductDetailScreen extends ConsumerWidget {
  const ProductDetailScreen({super.key, required this.productId});

  final String productId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final product = ref.watch(productProvider(productId));
    return product.when(
      loading: () => Scaffold(appBar: AppBar(), body: const LoadingView()),
      error: (e, _) => Scaffold(appBar: AppBar(), body: const ErrorView()),
      data: (p) => p == null
          ? Scaffold(
              appBar: AppBar(),
              body: const EmptyView(
                icon: Icons.search_off,
                title: 'Listing not found',
                message: 'This item may have been removed by the seller.',
              ),
            )
          : _ProductBody(product: p),
    );
  }
}

class _ProductBody extends ConsumerStatefulWidget {
  const _ProductBody({required this.product});

  final Product product;

  @override
  ConsumerState<_ProductBody> createState() => _ProductBodyState();
}

class _ProductBodyState extends ConsumerState<_ProductBody> {
  final _pages = PageController();
  int _page = 0;
  int _quantity = 1;
  bool _expanded = false;
  bool _busy = false;

  @override
  void dispose() {
    _pages.dispose();
    super.dispose();
  }

  Future<bool> _addToCart() async {
    final repo = ref.read(cartRepositoryProvider);
    if (repo == null) return false;
    setState(() => _busy = true);
    try {
      await repo.add(widget.product, quantity: _quantity);
      return true;
    } catch (_) {
      if (mounted) {
        showMessage(context, 'Could not update your cart. Try again.',
            error: true);
      }
      return false;
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.product;
    final uid = ref.watch(authStateProvider).value?.uid;
    final isMine = uid == p.sellerId;
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;
    // Uploaded listings keep full-size photos in a sub-collection; show the
    // small cover while they load.
    final photos = ref.watch(productPhotosProvider(p.id)).value ?? const [];
    final gallery = [...p.images, ...photos];
    final images = gallery.isEmpty ? [p.cover] : gallery;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            expandedHeight: 380,
            leading: IconButton(
              icon: const PhotoIcon(Icons.arrow_back),
              onPressed: () => context.pop(),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 12),
                child: FavoriteButton(type: 'product', id: p.id),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  PageView.builder(
                    controller: _pages,
                    itemCount: images.length,
                    onPageChanged: (i) => setState(() => _page = i),
                    itemBuilder: (_, i) => NetImage(images[i]),
                  ),
                  if (images.length > 1)
                    Positioned(
                      bottom: 14,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          for (var i = 0; i < images.length; i++)
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              margin: const EdgeInsets.symmetric(horizontal: 3),
                              height: 7,
                              width: i == _page ? 22 : 7,
                              decoration: BoxDecoration(
                                color: i == _page
                                    ? Colors.white
                                    : Colors.white54,
                                borderRadius: BorderRadius.circular(7),
                              ),
                            ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
          if (images.length > 1)
            SliverToBoxAdapter(
              child: SizedBox(
                height: 78,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
                  itemCount: images.length,
                  separatorBuilder: (_, _) => const SizedBox(width: 10),
                  itemBuilder: (_, i) => GestureDetector(
                    onTap: () => _pages.animateToPage(i,
                        duration: const Duration(milliseconds: 250),
                        curve: Curves.easeOut),
                    child: Container(
                      width: 64,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: i == _page
                              ? scheme.onSurface
                              : Colors.transparent,
                          width: 2,
                        ),
                      ),
                      child: NetImage(images[i], radius: 12),
                    ),
                  ),
                ),
              ),
            ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Tag(p.condition),
                      const SizedBox(width: 8),
                      Tag(p.category),
                      const Spacer(),
                      RatingBadge(rating: p.rating, count: p.ratingCount),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(p.title,
                      style: text.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w800, height: 1.2)),
                  const SizedBox(height: 8),
                  Text(formatRwf(p.price),
                      style: text.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: scheme.brightness == Brightness.dark
                              ? AppColors.actionHover
                              : AppColors.action)),
                  const SizedBox(height: 6),
                  Text(
                    p.inStock ? '${p.stock} in stock' : 'Out of stock',
                    style: TextStyle(
                      color: p.inStock ? scheme.onSurfaceVariant : AppColors.alert,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 22),
                  _SellerCard(name: p.sellerName, location: p.location),
                  const SizedBox(height: 24),
                  Text('Description',
                      style: text.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  Text(
                    p.description,
                    maxLines: _expanded ? null : 4,
                    overflow: _expanded ? null : TextOverflow.ellipsis,
                    style: text.bodyMedium?.copyWith(height: 1.55),
                  ),
                  if (p.description.length > 160)
                    TextButton(
                      onPressed: () => setState(() => _expanded = !_expanded),
                      child: Text(_expanded ? 'Show less' : 'Read more'),
                    ),
                  const SizedBox(height: 18),
                  Text('Product details',
                      style: text.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 10),
                  SpecTable(rows: {
                    'Condition': p.condition,
                    'Category': p.category,
                    if (p.location.isNotEmpty) 'Location': p.location,
                    'Available': '${p.stock}',
                    ...p.specs,
                    if (p.createdAt != null)
                      'Listed': timeAgo(p.createdAt),
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Container(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
          decoration: BoxDecoration(
            color: scheme.surface,
            border: Border(top: BorderSide(color: scheme.outline)),
          ),
          child: isMine
              ? const Padding(
                  padding: EdgeInsets.symmetric(vertical: 14),
                  child: Center(child: Text('This is your listing')),
                )
              : Row(
                  children: [
                    _QuantityStepper(
                      value: _quantity,
                      max: p.stock,
                      onChanged: (v) => setState(() => _quantity = v),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: !p.inStock || _busy
                            ? null
                            : () async {
                                if (await _addToCart() && context.mounted) {
                                  showMessage(context, 'Added to your cart');
                                }
                              },
                        child: const Text('Add to cart'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: FilledButton(
                        onPressed: !p.inStock || _busy
                            ? null
                            : () async {
                                if (await _addToCart() && context.mounted) {
                                  context.push('/checkout');
                                }
                              },
                        child: const Text('Buy now'),
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}

class _SellerCard extends StatelessWidget {
  const _SellerCard({required this.name, required this.location});

  final String name;
  final String location;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: scheme.onSurface,
            child: Text(
              name.isEmpty ? '?' : name[0].toUpperCase(),
              style: TextStyle(
                  color: scheme.surface, fontWeight: FontWeight.w800),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name.isEmpty ? 'NAWE seller' : name,
                    style: const TextStyle(fontWeight: FontWeight.w700)),
                if (location.isNotEmpty)
                  Text(location,
                      style: TextStyle(
                          color: scheme.onSurfaceVariant, fontSize: 12)),
              ],
            ),
          ),
          Text('Seller',
              style: TextStyle(color: scheme.onSurfaceVariant, fontSize: 12)),
        ],
      ),
    );
  }
}

class _QuantityStepper extends StatelessWidget {
  const _QuantityStepper({
    required this.value,
    required this.max,
    required this.onChanged,
  });

  final int value;
  final int max;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: scheme.outline),
        borderRadius: BorderRadius.circular(40),
      ),
      child: Row(
        children: [
          IconButton(
            visualDensity: VisualDensity.compact,
            onPressed: value > 1 ? () => onChanged(value - 1) : null,
            icon: const Icon(Icons.remove),
          ),
          Text('$value', style: const TextStyle(fontWeight: FontWeight.w800)),
          IconButton(
            visualDensity: VisualDensity.compact,
            onPressed: value < max ? () => onChanged(value + 1) : null,
            icon: const Icon(Icons.add),
          ),
        ],
      ),
    );
  }
}
