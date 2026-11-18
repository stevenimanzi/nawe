import 'package:intl/intl.dart';

/// Formats whole Rwandan francs, e.g. `12,500 RWF`.
String formatRwf(num amount) =>
    '${NumberFormat.decimalPattern().format(amount)} RWF';

/// `12 Nov 2026, 14:05`
String formatDateTime(DateTime? date) =>
    date == null ? '' : DateFormat('d MMM y, HH:mm').format(date);

/// Short relative time such as `5 min ago` or `3 d ago`.
String timeAgo(DateTime? date) {
  if (date == null) return '';
  final diff = DateTime.now().difference(date);
  if (diff.inMinutes < 1) return 'Just now';
  if (diff.inHours < 1) return '${diff.inMinutes} min ago';
  if (diff.inDays < 1) return '${diff.inHours} h ago';
  if (diff.inDays < 7) return '${diff.inDays} d ago';
  return DateFormat('d MMM y').format(date);
}

/// Capitalises the first letter: `shipped` -> `Shipped`.
String capitalize(String value) =>
    value.isEmpty ? value : value[0].toUpperCase() + value.substring(1);
