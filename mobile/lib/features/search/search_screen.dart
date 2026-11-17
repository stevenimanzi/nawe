import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/constants/catalog.dart';
import '../../core/widgets/state_views.dart';
import '../../data/models/product.dart';
import '../../data/repositories/product_repository.dart';
import '../products/widgets/product_card.dart';

enum _Sort { newest, priceLow, priceHigh }

/// Full-text-ish search over products with category, condition and sort filters.
class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({super.key});

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  String _query = '';
  String? _category;
  String? _condition;
  _Sort _sort = _Sort.newest;

  List<Product> _apply(List<Product> all) {
    final q = _query.trim().toLowerCase();
    final list = all.where((p) {
      if (_category != null && p.category != _category) return false;
      if (_condition != null && p.condition != _condition) return false;
      if (q.isEmpty) return true;
      return p.title.toLowerCase().contains(q) ||
          p.description.toLowerCase().contains(q) ||
          p.category.toLowerCase().contains(q);
    }).toList();
    switch (_sort) {
      case _Sort.newest:
        break;
      case _Sort.priceLow:
        list.sort((a, b) => a.price.compareTo(b.price));
      case _Sort.priceHigh:
        list.sort((a, b) => b.price.compareTo(a.price));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final products = ref.watch(productsProvider);
    return Scaffold(
      appBar: AppBar(
        leading: BackButton(onPressed: () => context.pop()),
        title: TextField(
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Search products',
            prefixIcon: Icon(Icons.search),
            contentPadding: EdgeInsets.symmetric(vertical: 10),
          ),
          onChanged: (v) => setState(() => _query = v),
        ),
      ),
      body: Column(
        children: [
          SizedBox(
            height: 56,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              children: [
                _FilterChipMenu<String>(
                  label: _category ?? 'Category',
                  active: _category != null,
                  options: {for (final c in Catalog.productCategories) c: c},
                  onSelected: (v) => setState(() => _category = v),
                ),
                _FilterChipMenu<String>(
                  label: _condition ?? 'Condition',
                  active: _condition != null,
                  options: {for (final c in Catalog.conditions) c: c},
                  onSelected: (v) => setState(() => _condition = v),
                ),
                _FilterChipMenu<_Sort>(
                  label: switch (_sort) {
                    _Sort.newest => 'Newest',
                    _Sort.priceLow => 'Price: low to high',
                    _Sort.priceHigh => 'Price: high to low',
                  },
                  active: _sort != _Sort.newest,
                  options: const {
                    'Newest': _Sort.newest,
                    'Price: low to high': _Sort.priceLow,
                    'Price: high to low': _Sort.priceHigh,
                  },
                  clearable: false,
                  onSelected: (v) => setState(() => _sort = v ?? _Sort.newest),
                ),
              ],
            ),
          ),
          Expanded(
            child: products.when(
              loading: () => const LoadingView(),
              error: (e, _) => ErrorView(
                onRetry: () => ref.invalidate(productsProvider),
              ),
              data: (all) {
                final list = _apply(all);
                if (list.isEmpty) {
                  return const EmptyView(
                    icon: Icons.search_off,
                    title: 'No results',
                    message: 'Try a different word or remove a filter.',
                  );
                }
                return GridView.builder(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 14,
                    crossAxisSpacing: 14,
                    childAspectRatio: 0.66,
                  ),
                  itemCount: list.length,
                  itemBuilder: (_, i) => ProductCard(list[i]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

/// A chip that opens a menu of options and shows the current choice.
class _FilterChipMenu<T> extends StatelessWidget {
  const _FilterChipMenu({
    required this.label,
    required this.active,
    required this.options,
    required this.onSelected,
    this.clearable = true,
  });

  final String label;
  final bool active;
  final Map<String, T> options;
  final ValueChanged<T?> onSelected;
  final bool clearable;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      // A record wraps the value so "clear" (null) is a real selection;
      // PopupMenuButton treats a bare null as a dismissed menu.
      child: PopupMenuButton<({T? value})>(
        onSelected: (choice) => onSelected(choice.value),
        itemBuilder: (_) => [
          if (clearable && active)
            const PopupMenuItem(
              value: (value: null),
              child: Text('Clear filter'),
            ),
          for (final e in options.entries)
            PopupMenuItem(value: (value: e.value), child: Text(e.key)),
        ],
        child: Chip(
          backgroundColor: active ? scheme.onSurface : null,
          label: Text(label),
          labelStyle: TextStyle(
            color: active ? scheme.surface : scheme.onSurface,
            fontWeight: FontWeight.w600,
          ),
          avatar: Icon(Icons.expand_more,
              size: 18, color: active ? scheme.surface : scheme.onSurface),
        ),
      ),
    );
  }
}
