import 'package:flutter/material.dart';

/// A tidy two-column table of label / value rows with alternating shading.
class SpecTable extends StatelessWidget {
  const SpecTable({super.key, required this.rows});

  final Map<String, String> rows;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final entries = rows.entries.toList();
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: Column(
        children: [
          for (var i = 0; i < entries.length; i++)
            Container(
              color: i.isEven ? scheme.surfaceContainerHighest : scheme.surface,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 4,
                    child: Text(entries[i].key,
                        style: TextStyle(color: scheme.onSurfaceVariant)),
                  ),
                  Expanded(
                    flex: 6,
                    child: Text(entries[i].value,
                        textAlign: TextAlign.right,
                        style: const TextStyle(fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
