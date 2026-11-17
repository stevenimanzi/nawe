import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_colors.dart';

/// Builds the light and dark [ThemeData] used across the app.
abstract final class AppTheme {
  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final canvas = isDark ? AppColors.canvas : AppColors.lightCanvas;
    final panel = isDark ? AppColors.panel : AppColors.lightPanel;
    final panel2 = isDark ? AppColors.panel2 : AppColors.lightPanel2;
    final ink = isDark ? AppColors.ink : AppColors.lightInk;
    final muted = isDark ? AppColors.mutedDark : AppColors.mutedLight;

    final scheme = ColorScheme(
      brightness: brightness,
      primary: AppColors.action,
      onPrimary: Colors.white,
      secondary: AppColors.gold,
      onSecondary: AppColors.lightInk,
      error: AppColors.alert,
      onError: Colors.white,
      surface: panel,
      onSurface: ink,
      surfaceContainerHighest: panel2,
      onSurfaceVariant: muted,
      outline: isDark ? const Color(0xFF2C3038) : const Color(0xFFD9DBD6),
      inverseSurface: ink,
      onInverseSurface: panel,
    );

    final base = ThemeData(brightness: brightness, useMaterial3: true);
    final text = GoogleFonts.plusJakartaSansTextTheme(base.textTheme).apply(
      bodyColor: ink,
      displayColor: ink,
    );

    final pill = const StadiumBorder();
    return base.copyWith(
      colorScheme: scheme,
      scaffoldBackgroundColor: canvas,
      textTheme: text,
      appBarTheme: AppBarTheme(
        backgroundColor: canvas,
        foregroundColor: ink,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: text.titleMedium?.copyWith(fontWeight: FontWeight.w700),
      ),
      cardTheme: CardThemeData(
        color: panel,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: scheme.outline.withValues(alpha: 0.6)),
        ),
      ),
      dividerTheme: DividerThemeData(color: scheme.outline, space: 1),
      // Primary buttons follow the references: high-contrast pills.
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: ink,
          foregroundColor: panel,
          minimumSize: const Size.fromHeight(54),
          shape: pill,
          textStyle: text.labelLarge?.copyWith(fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: ink,
          minimumSize: const Size.fromHeight(54),
          shape: pill,
          side: BorderSide(color: scheme.outline),
          textStyle: text.labelLarge?.copyWith(fontWeight: FontWeight.w700),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: AppColors.action),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: panel2,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        hintStyle: TextStyle(color: muted),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.action, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.alert),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: panel2,
        selectedColor: ink,
        labelStyle: text.labelMedium,
        secondaryLabelStyle: text.labelMedium?.copyWith(color: panel),
        side: BorderSide.none,
        shape: pill,
        showCheckmark: false,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: panel,
        indicatorColor: ink.withValues(alpha: 0.1),
        height: 68,
        labelTextStyle: WidgetStatePropertyAll(
          text.labelSmall?.copyWith(fontWeight: FontWeight.w600),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: ink,
        contentTextStyle: TextStyle(color: panel),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: panel,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
      ),
    );
  }
}
