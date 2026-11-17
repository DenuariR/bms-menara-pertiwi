import "package:flutter/material.dart";

abstract final class AppColors {
  static const Color ink = Color(0xFF0F3556);
  static const Color text = Color(0xFF10263C);
  static const Color muted = Color(0xFF41617B);
  static const Color paper = Color(0xFFEAF4FC);
  static const Color chrome = Color(0xFFD9EBF9);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color line = Color(0xFFC8DCEE);
  static const Color accent = Color(0xFF0B5C8A);
  static const Color crit = Color(0xFFA02A20);
}

ThemeData buildTheme() {
  const radius = BorderRadius.all(Radius.circular(4));
  final scheme = ColorScheme.fromSeed(
    seedColor: AppColors.accent,
    brightness: Brightness.light,
  ).copyWith(
    primary: AppColors.accent,
    surface: AppColors.surface,
    error: AppColors.crit,
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: AppColors.chrome,
    visualDensity: VisualDensity.standard,
    textTheme: const TextTheme(
      bodyMedium: TextStyle(color: AppColors.text, fontSize: 14, height: 1.45),
      bodySmall: TextStyle(color: AppColors.muted, fontSize: 12.5, height: 1.45),
      titleMedium: TextStyle(
        color: AppColors.ink,
        fontSize: 16,
        fontWeight: FontWeight.w600,
        height: 1.3,
      ),
      titleLarge: TextStyle(
        color: AppColors.ink,
        fontSize: 20,
        fontWeight: FontWeight.w700,
        height: 1.25,
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: AppColors.accent,
        foregroundColor: Colors.white,
        minimumSize: const Size(0, 42),
        shape: const RoundedRectangleBorder(borderRadius: radius),
        textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.accent,
        side: const BorderSide(color: AppColors.line),
        minimumSize: const Size(0, 42),
        shape: const RoundedRectangleBorder(borderRadius: radius),
        textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
      ),
    ),
    snackBarTheme: const SnackBarThemeData(
      backgroundColor: AppColors.ink,
      contentTextStyle: TextStyle(color: Colors.white, fontSize: 13.5),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: radius),
    ),
    progressIndicatorTheme: const ProgressIndicatorThemeData(
      color: AppColors.accent,
      linearTrackColor: AppColors.line,
    ),
  );
}
