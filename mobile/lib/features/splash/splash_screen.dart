import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_colors.dart';
import '../../core/widgets/app_logo.dart';
import '../../data/repositories/auth_repository.dart';
import '../onboarding/onboarding_controller.dart';

/// Animated brand splash. Waits for Firebase to report the sign-in state,
/// then routes to onboarding, sign-in or the home screen.
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
  )..forward();

  bool _minimumTimeElapsed = false;

  @override
  void initState() {
    super.initState();
    Future<void>.delayed(const Duration(milliseconds: 1900), () {
      if (!mounted) return;
      setState(() => _minimumTimeElapsed = true);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _route() {
    final auth = ref.read(authStateProvider);
    if (!_minimumTimeElapsed || auth.isLoading) return;
    final signedIn = auth.value != null;
    final onboarded = ref.read(onboardingDoneProvider);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.go(signedIn ? '/home' : (onboarded ? '/login' : '/onboarding'));
    });
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(authStateProvider, (_, _) => _route());
    _route();

    final fade = CurvedAnimation(parent: _controller, curve: Curves.easeOut);
    final scale = Tween<double>(begin: 0.8, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    return Scaffold(
      backgroundColor: AppColors.canvas,
      body: Center(
        child: FadeTransition(
          opacity: fade,
          child: ScaleTransition(
            scale: scale,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const AppLogo(size: 112),
                const SizedBox(height: 22),
                Text(
                  'NAWE',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        color: AppColors.ink,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 6,
                      ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Buy, rent and find a home near you',
                  style: TextStyle(color: AppColors.mutedDark),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
