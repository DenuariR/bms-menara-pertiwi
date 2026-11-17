import "package:flutter/material.dart";
import "package:flutter/services.dart";

import "app_config.dart";
import "theme.dart";
import "web_screen.dart";

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: AppColors.chrome,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.chrome,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const DcmApp());
}

class DcmApp extends StatelessWidget {
  const DcmApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      theme: buildTheme(),
      home: const WebScreen(),
    );
  }
}
