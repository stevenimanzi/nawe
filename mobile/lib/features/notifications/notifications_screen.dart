import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/utils/formatters.dart';
import '../../core/widgets/state_views.dart';
import '../../data/repositories/notification_repository.dart';

/// Order updates and other messages for the signed-in user.
class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    // Opening the screen counts as reading everything on it.
    Future<void>.delayed(const Duration(seconds: 2), () {
      if (mounted) ref.read(notificationRepositoryProvider)?.markAllRead();
    });
  }

  @override
  Widget build(BuildContext context) {
    final notifications = ref.watch(notificationsProvider);
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: notifications.when(
        loading: () => const LoadingView(),
        error: (e, _) => ErrorView(
            onRetry: () => ref.invalidate(notificationsProvider)),
        data: (list) {
          if (list.isEmpty) {
            return const EmptyView(
              icon: Icons.notifications_none,
              title: 'You are all caught up',
              message: 'Order updates and news will show up here.',
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(20),
            itemCount: list.length,
            separatorBuilder: (_, _) => const SizedBox(height: 10),
            itemBuilder: (_, i) {
              final n = list[i];
              return Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: scheme.surface,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: n.read
                        ? scheme.outline.withValues(alpha: 0.6)
                        : scheme.primary,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      backgroundColor: scheme.surfaceContainerHighest,
                      child: const Icon(Icons.notifications_none),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(n.title,
                              style:
                                  const TextStyle(fontWeight: FontWeight.w800)),
                          const SizedBox(height: 2),
                          Text(n.body),
                          const SizedBox(height: 6),
                          Text(timeAgo(n.createdAt),
                              style: TextStyle(
                                  color: scheme.onSurfaceVariant,
                                  fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
