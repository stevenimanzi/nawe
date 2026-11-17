import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/theme_controller.dart';

final onboardingDoneProvider =
    NotifierProvider<OnboardingController, bool>(OnboardingController.new);

/// Remembers whether the user already saw the onboarding slides.
class OnboardingController extends Notifier<bool> {
  static const _key = 'onboarding_done';

  @override
  bool build() => ref.read(sharedPreferencesProvider).getBool(_key) ?? false;

  Future<void> complete() async {
    state = true;
    await ref.read(sharedPreferencesProvider).setBool(_key, true);
  }
}
