import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/models/app_user.dart';
import '../../data/repositories/auth_repository.dart';

/// Lets a seller flip between the Seller dashboard and the shopping view.
/// `null` means "follow the account role".
final modeOverrideProvider =
    NotifierProvider<ModeOverride, UserRole?>(ModeOverride.new);

class ModeOverride extends Notifier<UserRole?> {
  @override
  UserRole? build() => null;

  void set(UserRole? mode) => state = mode;
}

/// The mode the app is currently showing.
final activeModeProvider = Provider<UserRole>((ref) {
  final override = ref.watch(modeOverrideProvider);
  final role = ref.watch(currentUserProvider).value?.role ?? UserRole.client;
  // Only sellers can open the seller view.
  if (override == UserRole.seller && role != UserRole.seller) {
    return UserRole.client;
  }
  return override ?? role;
});
