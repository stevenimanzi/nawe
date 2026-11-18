import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/constants/catalog.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/state_views.dart';
import '../../data/models/house.dart';
import '../../data/repositories/house_repository.dart';
import 'widgets/house_card.dart';

/// Houses and rooms to rent, with type, district and budget filters.
class HousesScreen extends ConsumerStatefulWidget {
  const HousesScreen({super.key});

  @override
  ConsumerState<HousesScreen> createState() => _HousesScreenState();
}

class _HousesScreenState extends ConsumerState<HousesScreen> {
  String? _type;
  String? _district;
  double _maxPrice = _priceCeiling;

  static const double _priceCeiling = 1000000;

  List<House> _apply(List<House> all) => all.where((h) {
        if (_type != null && h.type != _type) return false;
        if (_district != null && h.district != _district) return false;
        if (_maxPrice < _priceCeiling && h.pricePerMonth > _maxPrice) {
          return false;
        }
        return true;
      }).toList();

  @override
  Widget build(BuildContext context) {
    final houses = ref.watch(housesProvider);
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Houses & rooms')),
      body: Column(
        children: [
          SizedBox(
            height: 56,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
              children: [
                for (final t in [null, ...Catalog.houseTypes])
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(t ?? 'All'),
                      selected: _type == t,
                      labelStyle: TextStyle(
                        color: _type == t ? scheme.surface : scheme.onSurface,
                        fontWeight: FontWeight.w600,
                      ),
                      onSelected: (_) => setState(() => _type = t),
                    ),
                  ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String?>(
                    initialValue: _district,
                    isExpanded: true,
                    decoration: const InputDecoration(
                      hintText: 'District',
                      prefixIcon: Icon(Icons.place_outlined),
                    ),
                    items: [
                      const DropdownMenuItem(
                          value: null, child: Text('All districts')),
                      for (final d in Catalog.districts)
                        DropdownMenuItem(value: d, child: Text(d)),
                    ],
                    onChanged: (v) => setState(() => _district = v),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 0),
            child: Row(
              children: [
                const Text('Budget'),
                Expanded(
                  child: Slider(
                    value: _maxPrice,
                    min: 20000,
                    max: _priceCeiling,
                    divisions: 49,
                    onChanged: (v) => setState(() => _maxPrice = v),
                  ),
                ),
                Text(
                  _maxPrice >= _priceCeiling
                      ? 'Any'
                      : formatRwf(_maxPrice.round()),
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ],
            ),
          ),
          Expanded(
            child: houses.when(
              loading: () => const LoadingView(),
              error: (e, _) =>
                  ErrorView(onRetry: () => ref.invalidate(housesProvider)),
              data: (all) {
                final list = _apply(all);
                if (list.isEmpty) {
                  return const EmptyView(
                    icon: Icons.home_work_outlined,
                    title: 'No houses found',
                    message: 'Try a different district or a higher budget.',
                  );
                }
                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                  itemCount: list.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 16),
                  itemBuilder: (_, i) => HouseCard(list[i]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
