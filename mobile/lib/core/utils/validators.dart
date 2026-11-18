/// Form field validators shared by the auth, checkout and listing forms.
abstract final class Validators {
  static String? required(String? value, [String label = 'This field']) =>
      (value == null || value.trim().isEmpty) ? '$label is required' : null;

  static String? email(String? value) {
    final v = value?.trim() ?? '';
    if (v.isEmpty) return 'Email is required';
    final ok = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(v);
    return ok ? null : 'Enter a valid email address';
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) return 'Password is required';
    return value.length < 6 ? 'Use at least 6 characters' : null;
  }

  /// Rwandan numbers: 07XXXXXXXX or +2507XXXXXXXX.
  static String? phone(String? value) {
    final v = (value ?? '').replaceAll(' ', '');
    if (v.isEmpty) return 'Phone number is required';
    final ok = RegExp(r'^(\+?250|0)7[2389]\d{7}$').hasMatch(v);
    return ok ? null : 'Enter a valid phone number, e.g. 0788 123 456';
  }

  static String? positiveInt(String? value, [String label = 'Value']) {
    final n = int.tryParse((value ?? '').replaceAll(',', '').trim());
    return (n == null || n <= 0) ? '$label must be a number above 0' : null;
  }
}
