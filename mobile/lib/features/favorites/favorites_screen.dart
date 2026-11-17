import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/widgets/state_views.dart';
import '../../data/repositories/favorites_repository.dart';
import '../../data/repositories/house_repository.dart';
import '../../data/repositories/product_repository.dart';
import '../houses/widgets/house_card.dart';
import '../products/widgets/product_card.dart';

/// Everything the user saved, split into products and houses.
class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final keys = ref.watch(favoriteKeysProvider).value ?? const <String>{};
    final products = (ref.watch(productsProvider).value ?? const [])
        .where((p) => keys.contains(favoriteKey('product', p.id)))
        .toList();
    final houses = (ref.watch(housesProvider).value ?? const [])
        .where((h) => keys.contains(favoriteKey('house', h.id)))
        .toList();

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Saved items'),
          bottom: TabBar(
            tabs: [
              Tab(text: 'Products (${products.length})'),
              Tab(text: 'Houses (${houses.length})'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            products.isEmpty
                ? const EmptyView(
                    icon: Icons.favorite_border,
                    title: 'No saved products',
                    message: 'Tap the heart on a product to save it here.',
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(20),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 14,
                      crossAxisSpacing: 14,
                      childAspectRatio: 0.66,
                    ),
                    itemCount: products.length,
                    itemBuilder: (_, i) => ProductCard(products[i]),
                  ),
            houses.isEmpty
                ? const EmptyView(
                    icon: Icons.favorite_border,
                    title: 'No saved houses',
                    message: 'Tap the heart on a house to save it here.',
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(20),
                    itemCount: houses.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 16),
                    itemBuilder: (_, i) => HouseCard(houses[i]),
                  ),
          ],
        ),
      ),
    );
  }
}
