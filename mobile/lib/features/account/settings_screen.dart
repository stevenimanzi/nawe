import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/theme_controller.dart';

/// Appearance settings: light, dark or follow the phone.
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mode = ref.watch(themeModeProvider);
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Appearance')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Theme',
              style: Theme.of(context)
                  .textTheme
                  .titleMedium
                  ?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 14),
          Row(
            children: [
              for (final option in const [
                (ThemeMode.light, Icons.light_mode_outlined, 'Light'),
                (ThemeMode.dark, Icons.dark_mode_outlined, 'Dark'),
                (ThemeMode.system, Icons.phone_android_outlined, 'System'),
              ])
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(18),
                      onTap: () =>
                          ref.read(themeModeProvider.notifier).set(option.$1),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        decoration: BoxDecoration(
                          color: scheme.surface,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(
                            color: mode == option.$1
                                ? scheme.onSurface
                                : scheme.outline,
                            width: mode == option.$1 ? 2 : 1,
                          ),
                        ),
                        child: Column(
                          children: [
                            Icon(option.$2, size: 28),
                            const SizedBox(height: 8),
                            Text(option.$3,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 28),
          Text('NAWE for Android',
              style: TextStyle(color: scheme.onSurfaceVariant)),
        ],
      ),
    );
  }
}
