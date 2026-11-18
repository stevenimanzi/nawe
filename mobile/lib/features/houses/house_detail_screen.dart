import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/photo_icon.dart';
import '../../core/utils/formatters.dart';
import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/net_image.dart';
import '../../core/widgets/state_views.dart';
import '../../data/models/house.dart';
import '../../data/repositories/house_repository.dart';
import '../favorites/favorite_button.dart';
import '../products/widgets/spec_table.dart';

class HouseDetailScreen extends ConsumerWidget {
  const HouseDetailScreen({super.key, required this.houseId});

  final String houseId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final house = ref.watch(houseProvider(houseId));
    return house.when(
      loading: () => Scaffold(appBar: AppBar(), body: const LoadingView()),
      error: (e, _) => Scaffold(appBar: AppBar(), body: const ErrorView()),
      data: (h) => h == null
          ? Scaffold(
              appBar: AppBar(),
              body: const EmptyView(
                icon: Icons.home_work_outlined,
                title: 'Listing not found',
                message: 'This house may have been removed by the owner.',
              ),
            )
          : _HouseBody(house: h),
    );
  }
}

class _HouseBody extends ConsumerStatefulWidget {
  const _HouseBody({required this.house});

  final House house;

  @override
  ConsumerState<_HouseBody> createState() => _HouseBodyState();
}

class _HouseBodyState extends ConsumerState<_HouseBody> {
  final _pages = PageController();
  int _page = 0;

  @override
  void dispose() {
    _pages.dispose();
    super.dispose();
  }

  Future<void> _call() async {
    final uri = Uri(scheme: 'tel', path: widget.house.ownerPhone);
    if (!await launchUrl(uri) && mounted) {
      showMessage(context, 'Could not open the phone app.', error: true);
    }
  }

  Future<void> _whatsapp() async {
    final digits = widget.house.ownerPhone.replaceAll(RegExp(r'[^0-9]'), '');
    final number = digits.startsWith('0') ? '250${digits.substring(1)}' : digits;
    final uri = Uri.parse(
      'https://wa.me/$number?text=${Uri.encodeComponent('Hello, I saw "${widget.house.title}" on NAWE. Is it still available?')}',
    );
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication) &&
        mounted) {
      showMessage(context, 'Could not open WhatsApp.', error: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final h = widget.house;
    final scheme = Theme.of(context).colorScheme;
    final text = Theme.of(context).textTheme;
    final photos = ref.watch(housePhotosProvider(h.id)).value ?? const [];
    final gallery = [...h.images, ...photos];
    final images = gallery.isEmpty ? [h.cover] : gallery;
    final hasPhone = h.ownerPhone.isNotEmpty;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            expandedHeight: 340,
            leading: IconButton(
              icon: const PhotoIcon(Icons.arrow_back),
              onPressed: () => context.pop(),
            ),
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 12),
                child: FavoriteButton(type: 'house', id: h.id),
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
                  Positioned(
                    right: 16,
                    bottom: 14,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text('${_page + 1}/${images.length}',
                          style: const TextStyle(
                              color: Colors.white, fontSize: 12)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Tag(h.type),
                      const SizedBox(width: 8),
                      h.available
                          ? const Tag('Available',
                              color: AppColors.actionHover,
                              icon: Icons.check_circle_outline)
                          : const Tag('Taken', color: AppColors.alert),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(h.title,
                      style: text.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w800, height: 1.2)),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(Icons.place_outlined,
                          size: 18, color: scheme.onSurfaceVariant),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          '${h.district}${h.address.isEmpty ? '' : ', ${h.address}'}',
                          style: TextStyle(color: scheme.onSurfaceVariant),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text.rich(TextSpan(children: [
                    TextSpan(
                      text: formatRwf(h.pricePerMonth),
                      style: text.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                          color: scheme.brightness == Brightness.dark
                              ? AppColors.actionHover
                              : AppColors.action),
                    ),
                    TextSpan(
                      text: '  per month',
                      style: TextStyle(color: scheme.onSurfaceVariant),
                    ),
                  ])),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                          child: _FactBox(Icons.bed_outlined,
                              '${h.bedrooms}', 'Bedrooms')),
                      const SizedBox(width: 10),
                      Expanded(
                          child: _FactBox(Icons.bathtub_outlined,
                              '${h.bathrooms}', 'Bathrooms')),
                      const SizedBox(width: 10),
                      Expanded(
                          child: _FactBox(
                              Icons.square_foot, '${h.areaSqm}', 'm²')),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text('About this place',
                      style: text.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  Text(h.description,
                      style: text.bodyMedium?.copyWith(height: 1.55)),
                  if (h.amenities.isNotEmpty) ...[
                    const SizedBox(height: 22),
                    Text('Amenities',
                        style: text.titleMedium
                            ?.copyWith(fontWeight: FontWeight.w800)),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final a in h.amenities)
                          Tag(a, icon: Icons.check, color: null),
                      ],
                    ),
                  ],
                  const SizedBox(height: 22),
                  Text('Property details',
                      style: text.titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 10),
                  SpecTable(rows: {
                    'Type': h.type,
                    'District': h.district,
                    if (h.address.isNotEmpty) 'Address': h.address,
                    'Rent': '${formatRwf(h.pricePerMonth)} / month',
                    'Bedrooms': '${h.bedrooms}',
                    'Bathrooms': '${h.bathrooms}',
                    'Size': '${h.areaSqm} m²',
                    'Status': h.available ? 'Available' : 'Taken',
                    'Listed': timeAgo(h.createdAt),
                  }),
                  const SizedBox(height: 22),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: scheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: scheme.onSurface,
                          child: Text(
                            h.ownerName.isEmpty
                                ? '?'
                                : h.ownerName[0].toUpperCase(),
                            style: TextStyle(
                                color: scheme.surface,
                                fontWeight: FontWeight.w800),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                  h.ownerName.isEmpty
                                      ? 'Landlord'
                                      : h.ownerName,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w700)),
                              Text('Landlord',
                                  style: TextStyle(
                                      color: scheme.onSurfaceVariant,
                                      fontSize: 12)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: hasPhone
          ? SafeArea(
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
                decoration: BoxDecoration(
                  color: scheme.surface,
                  border: Border(top: BorderSide(color: scheme.outline)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: _whatsapp,
                        icon: const Icon(Icons.chat_bubble_outline),
                        label: const Text('WhatsApp'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: h.available ? _call : null,
                        icon: const Icon(Icons.call_outlined),
                        label: const Text('Call owner'),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : null,
    );
  }
}

class _FactBox extends StatelessWidget {
  const _FactBox(this.icon, this.value, this.label);

  final IconData icon;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          Icon(icon, color: scheme.onSurfaceVariant),
          const SizedBox(height: 6),
          Text(value,
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          Text(label,
              style:
                  TextStyle(color: scheme.onSurfaceVariant, fontSize: 12)),
        ],
      ),
    );
  }
}
