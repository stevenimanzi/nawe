import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

/// A section title with an optional trailing action, e.g. "View all".
class SectionHeader extends StatelessWidget {
  const SectionHeader(this.title, {super.key, this.actionLabel, this.onAction});

  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return Row(
      children: [
        Expanded(
          child: Text(title,
              style: text.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
        ),
        if (actionLabel != null)
          TextButton(onPressed: onAction, child: Text(actionLabel!)),
      ],
    );
  }
}

/// Star rating with the review count, e.g. `4.8 (24)`.
class RatingBadge extends StatelessWidget {
  const RatingBadge({super.key, required this.rating, required this.count});

  final double rating;
  final int count;

  @override
  Widget build(BuildContext context) {
    final muted = Theme.of(context).colorScheme.onSurfaceVariant;
    if (count == 0) {
      return Text('New', style: TextStyle(color: muted, fontSize: 12));
    }
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.star_rounded, size: 16, color: AppColors.gold),
        const SizedBox(width: 3),
        Text(rating.toStringAsFixed(1),
            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
        const SizedBox(width: 3),
        Text('($count)', style: TextStyle(color: muted, fontSize: 12)),
      ],
    );
  }
}

/// A small rounded label such as a condition or availability tag.
class Tag extends StatelessWidget {
  const Tag(this.label, {super.key, this.color, this.icon});

  final String label;
  final Color? color;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final fg = color ?? scheme.onSurface;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color == null
            ? scheme.surfaceContainerHighest
            : color!.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 14, color: fg),
            const SizedBox(width: 4),
          ],
          Text(label,
              style: TextStyle(
                  fontSize: 12, fontWeight: FontWeight.w600, color: fg)),
        ],
      ),
    );
  }
}

/// Shows a snack bar with [message]. Pass [error] for failures.
void showMessage(BuildContext context, String message, {bool error = false}) {
  final messenger = ScaffoldMessenger.of(context);
  messenger
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(
      content: Text(message),
      backgroundColor: error ? AppColors.alert : null,
    ));
}
