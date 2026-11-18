import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/widgets/common_widgets.dart';
import '../../core/widgets/state_views.dart';
import '../../data/models/app_user.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/notification_repository.dart';
import 'app_mode.dart';

/// Profile hub for both clients and sellers.
class AccountScreen extends ConsumerWidget {
  const AccountScreen({super.key, this.sellerView = false});

  /// True when shown inside the seller navigation.
  final bool sellerView;

  Future<void> _becomeSeller(BuildContext context, WidgetRef ref, AppUser u) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Become a seller?'),
        content: const Text(
          'You will be able to list products and houses and manage customer orders. You can still shop as before.',
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Not now')),
          TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Yes, continue')),
        ],
      ),
    );
    if (ok != true) return;
    await ref
        .read(authRepositoryProvider)
        .updateProfile(u.uid, role: UserRole.seller);
    ref.read(modeOverrideProvider.notifier).set(UserRole.seller);
    if (context.mounted) context.go('/seller');
  }

  Future<void> _signOut(BuildContext context, WidgetRef ref) async {
    ref.read(modeOverrideProvider.notifier).set(null);
    await ref.read(authRepositoryProvider).signOut();
    if (context.mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final unread = ref.watch(unreadNotificationsProvider);
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: user.when(
        loading: () => const LoadingView(),
        error: (e, _) => const ErrorView(),
        data: (u) {
          if (u == null) return const LoadingView();
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 34,
                    backgroundColor: scheme.onSurface,
                    child: Text(
                      u.name.isEmpty ? '?' : u.name[0].toUpperCase(),
                      style: TextStyle(
                          color: scheme.surface,
                          fontSize: 26,
                          fontWeight: FontWeight.w800),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(u.name,
                            style: Theme.of(context)
                                .textTheme
                                .titleLarge
                                ?.copyWith(fontWeight: FontWeight.w800)),
                        Text(u.email,
                            style: TextStyle(color: scheme.onSurfaceVariant)),
                        const SizedBox(height: 6),
                        Tag(u.isSeller ? 'Seller' : 'Customer'),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              if (u.isSeller)
                _Tile(
                  icon: sellerView
                      ? Icons.shopping_bag_outlined
                      : Icons.storefront_outlined,
                  title: sellerView ? 'Switch to shopping' : 'Open seller dashboard',
                  highlight: true,
                  onTap: () {
                    ref.read(modeOverrideProvider.notifier).set(
                        sellerView ? UserRole.client : UserRole.seller);
                    context.go(sellerView ? '/home' : '/seller');
                  },
                )
              else
                _Tile(
                  icon: Icons.storefront_outlined,
                  title: 'Become a seller',
                  subtitle: 'List products and houses on NAWE',
                  highlight: true,
                  onTap: () => _becomeSeller(context, ref, u),
                ),
              const SizedBox(height: 8),
              const _Group('Activity'),
              _Tile(
                icon: Icons.receipt_long_outlined,
                title: 'My orders',
                onTap: () => context.push('/orders'),
              ),
              _Tile(
                icon: Icons.favorite_border,
                title: 'Saved items',
                onTap: () => context.push('/favorites'),
              ),
              _Tile(
                icon: Icons.notifications_none,
                title: 'Notifications',
                trailing: unread > 0 ? Badge(label: Text('$unread')) : null,
                onTap: () => context.push('/notifications'),
              ),
              const _Group('Account'),
              _Tile(
                icon: Icons.person_outline,
                title: 'Edit profile',
                onTap: () => context.push('/edit-profile'),
              ),
              _Tile(
                icon: Icons.palette_outlined,
                title: 'Appearance',
                subtitle: 'Light, dark or system',
                onTap: () => context.push('/settings'),
              ),
              const _Group('Help'),
              _Tile(
                icon: Icons.support_agent_outlined,
                title: 'Help & support',
                onTap: () => context.push('/support'),
              ),
              _Tile(
                icon: Icons.description_outlined,
                title: 'Terms & conditions',
                onTap: () => context.push('/terms'),
              ),
              _Tile(
                icon: Icons.privacy_tip_outlined,
                title: 'Privacy policy',
                onTap: () => context.push('/privacy'),
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () => _signOut(context, ref),
                icon: const Icon(Icons.logout),
                label: const Text('Sign out'),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _Group extends StatelessWidget {
  const _Group(this.label);

  final String label;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(4, 18, 4, 8),
        child: Text(
          label.toUpperCase(),
          style: TextStyle(
            fontSize: 12,
            letterSpacing: 1,
            fontWeight: FontWeight.w700,
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      );
}

class _Tile extends StatelessWidget {
  const _Tile({
    required this.icon,
    required this.title,
    required this.onTap,
    this.subtitle,
    this.trailing,
    this.highlight = false,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final Widget? trailing;
  final VoidCallback onTap;
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: highlight ? scheme.onSurface : scheme.surface,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Row(
              children: [
                Icon(icon, color: highlight ? scheme.surface : null),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title,
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: highlight ? scheme.surface : null,
                          )),
                      if (subtitle != null)
                        Text(subtitle!,
                            style: TextStyle(
                              fontSize: 12,
                              color: highlight
                                  ? scheme.surface.withValues(alpha: 0.7)
                                  : scheme.onSurfaceVariant,
                            )),
                    ],
                  ),
                ),
                trailing ??
                    Icon(Icons.chevron_right,
                        color: highlight
                            ? scheme.surface
                            : scheme.onSurfaceVariant),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
