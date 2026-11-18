import 'package:flutter_test/flutter_test.dart';
import 'package:nawe_mobile/core/utils/formatters.dart';
import 'package:nawe_mobile/core/utils/validators.dart';

void main() {
  group('Validators', () {
    test('email', () {
      expect(Validators.email('a@b.co'), isNull);
      expect(Validators.email('not-an-email'), isNotNull);
      expect(Validators.email(''), isNotNull);
    });

    test('password needs 6 characters', () {
      expect(Validators.password('12345'), isNotNull);
      expect(Validators.password('123456'), isNull);
    });

    test('Rwandan phone numbers', () {
      expect(Validators.phone('0788123456'), isNull);
      expect(Validators.phone('+250 788 123 456'), isNull);
      expect(Validators.phone('0612345678'), isNotNull);
      expect(Validators.phone(''), isNotNull);
    });

    test('positive integers', () {
      expect(Validators.positiveInt('12,000'), isNull);
      expect(Validators.positiveInt('0'), isNotNull);
      expect(Validators.positiveInt('abc'), isNotNull);
    });
  });

  group('Formatters', () {
    test('formatRwf groups thousands', () {
      expect(formatRwf(1250000), '1,250,000 RWF');
    });

    test('capitalize', () {
      expect(capitalize('shipped'), 'Shipped');
      expect(capitalize(''), '');
    });

    test('timeAgo', () {
      expect(timeAgo(null), '');
      expect(timeAgo(DateTime.now()), 'Just now');
      expect(
        timeAgo(DateTime.now().subtract(const Duration(hours: 3))),
        '3 h ago',
      );
    });
  });
}
