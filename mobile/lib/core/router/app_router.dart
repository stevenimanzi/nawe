import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/models/app_user.dart';
import '../../data/repositories/auth_repository.dart';
import '../../features/account/account_screen.dart';
import '../../features/account/app_mode.dart';
import '../../features/account/edit_profile_screen.dart';
import '../../features/account/settings_screen.dart';
import '../../features/assistant/assistant_screen.dart';
import '../../features/auth/forgot_password_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/register_screen.dart';
import '../../features/cart/cart_screen.dart';
import '../../features/checkout/checkout_screen.dart';
import '../../features/favorites/favorites_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/houses/house_detail_screen.dart';
import '../../features/houses/houses_screen.dart';
import '../../features/legal/legal_screen.dart';
import '../../features/notifications/notifications_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/orders/order_detail_screen.dart';
import '../../features/orders/orders_screen.dart';
import '../../features/products/product_detail_screen.dart';
import '../../features/search/search_screen.dart';
import '../../features/seller/add_house_screen.dart';
import '../../features/seller/add_product_screen.dart';
import '../../features/seller/seller_dashboard_screen.dart';
import '../../features/seller/seller_listings_screen.dart';
import '../../features/shell/client_shell.dart';
import '../../features/shell/seller_shell.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/support/support_screen.dart';

/// Paths a signed-out visitor may open.
const _publicPaths = {
  '/splash',
  '/onboarding',
  '/login',
  '/register',
  '/forgot',
  '/terms',
  '/privacy',
};

/// Paths that only make sense before signing in.
const _authPaths = {'/onboarding', '/login', '/register', '/forgot'};

const _clientTabs = {'/home', '/houses', '/cart', '/account'};

final appRouterProvider = Provider<GoRouter>((ref) {
  // Re-run the redirect whenever sign-in state or the active mode changes.
  final refresh = ValueNotifier<int>(0);
  ref.listen(authStateProvider, (_, _) => refresh.value++);
  ref.listen(activeModeProvider, (_, _) => refresh.value++);
  ref.onDispose(refresh.dispose);

  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: refresh,
    redirect: (context, state) {
      final auth = ref.read(authStateProvider);
      final loc = state.matchedLocation;
      if (loc == '/splash') return null;
      if (auth.isLoading) return '/splash';

      if (auth.value == null) {
        return _publicPaths.contains(loc) ? null : '/login';
      }
      if (_authPaths.contains(loc)) return '/home';

      final mode = ref.read(activeModeProvider);
      if (mode == UserRole.seller && _clientTabs.contains(loc)) {
        return '/seller';
      }
      if (mode == UserRole.client && loc.startsWith('/seller')) return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/splash', builder: (_, _) => const SplashScreen()),
      GoRoute(path: '/onboarding', builder: (_, _) => const OnboardingScreen()),
      GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, _) => const RegisterScreen()),
      GoRoute(path: '/forgot', builder: (_, _) => const ForgotPasswordScreen()),

      // Shopper navigation.
      StatefulShellRoute.indexedStack(
        builder: (_, _, shell) => ClientShell(shell: shell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(path: '/home', builder: (_, _) => const HomeScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/houses', builder: (_, _) => const HousesScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/cart', builder: (_, _) => const CartScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/account', builder: (_, _) => const AccountScreen()),
          ]),
        ],
      ),

      // Seller navigation.
      StatefulShellRoute.indexedStack(
        builder: (_, _, shell) => SellerShell(shell: shell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(
                path: '/seller',
                builder: (_, _) => const SellerDashboardScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
                path: '/seller/listings',
                builder: (_, _) => const SellerListingsScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
                path: '/seller/orders',
                builder: (_, _) => const OrdersScreen(asSeller: true)),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
                path: '/seller/account',
                builder: (_, _) => const AccountScreen(sellerView: true)),
          ]),
        ],
      ),

      // Full-screen pages that open above the tabs.
      GoRoute(
        path: '/product/:id',
        builder: (_, s) =>
            ProductDetailScreen(productId: s.pathParameters['id']!),
      ),
      GoRoute(
        path: '/house/:id',
        builder: (_, s) => HouseDetailScreen(houseId: s.pathParameters['id']!),
      ),
      GoRoute(path: '/search', builder: (_, _) => const SearchScreen()),
      GoRoute(path: '/checkout', builder: (_, _) => const CheckoutScreen()),
      GoRoute(path: '/orders', builder: (_, _) => const OrdersScreen()),
      GoRoute(
        path: '/order/:id',
        builder: (_, s) => OrderDetailScreen(orderId: s.pathParameters['id']!),
      ),
      GoRoute(path: '/favorites', builder: (_, _) => const FavoritesScreen()),
      GoRoute(
        path: '/notifications',
        builder: (_, _) => const NotificationsScreen(),
      ),
      GoRoute(path: '/assistant', builder: (_, _) => const AssistantScreen()),
      GoRoute(path: '/support', builder: (_, _) => const SupportScreen()),
      GoRoute(path: '/settings', builder: (_, _) => const SettingsScreen()),
      GoRoute(
        path: '/edit-profile',
        builder: (_, _) => const EditProfileScreen(),
      ),
      GoRoute(path: '/terms', builder: (_, _) => LegalScreen.terms()),
      GoRoute(path: '/privacy', builder: (_, _) => LegalScreen.privacy()),
      GoRoute(
        path: '/seller/new-product',
        builder: (_, _) => const AddProductScreen(),
      ),
      GoRoute(
        path: '/seller/new-house',
        builder: (_, _) => const AddHouseScreen(),
      ),
    ],
    errorBuilder: (_, state) => Scaffold(
      body: Center(child: Text('Page not found: ${state.uri}')),
    ),
  );
}, name: 'appRouter');
