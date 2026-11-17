import "dart:collection";

import "package:flutter/material.dart";
import "package:flutter/services.dart";
import "package:flutter_inappwebview/flutter_inappwebview.dart";

import "app_config.dart";
import "bridge_script.dart";
import "native_bridge.dart";
import "theme.dart";

class WebScreen extends StatefulWidget {
  const WebScreen({super.key});

  @override
  State<WebScreen> createState() => _WebScreenState();
}

class _WebScreenState extends State<WebScreen> {
  InAppWebViewController? _web;
  bool _loading = true;
  bool _failed = false;
  bool _exitArmed = false;

  Future<void> _snack(String message) async {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), duration: const Duration(seconds: 2)),
    );
  }

  String _safeName(String raw) {
    final cleaned = raw
        .replaceAll(RegExp(r'[\\/:*?"<>|]'), "-")
        .replaceAll(RegExp(r"\s+"), " ")
        .trim();
    return cleaned.isEmpty ? "dcm-berkas" : cleaned;
  }

  Future<dynamic> _onBridge(List<dynamic> args) async {
    final tag = args.isEmpty ? "" : "${args[0]}";
    final map = (args.length > 1 && args[1] is Map)
        ? Map<String, dynamic>.from(args[1] as Map)
        : const <String, dynamic>{};

    if (tag == "save") {
      final name = (map["name"] as String?) ?? "";
      final mime = (map["mime"] as String?) ?? "application/octet-stream";
      final base64 = (map["base64"] as String?) ?? "";
      if (name.trim().isEmpty || base64.isEmpty) {
        await _snack("Berkas gagal disiapkan.");
        return null;
      }
      final ok = await NativeBridge.saveFile(
        name: _safeName(name),
        mime: mime,
        base64: base64,
      );
      await _snack(ok ? "Berkas tersimpan." : "Penyimpanan dibatalkan.");
      return null;
    }

    if (tag == "print") {
      final html = (map["html"] as String?) ?? "";
      if (html.isEmpty) {
        await _snack("Halaman cetak kosong.");
        return null;
      }
      final ok = await NativeBridge.printHtml(
        html: html,
        jobName: AppConfig.appName,
      );
      if (!ok) await _snack("Dialog cetak tidak dapat dibuka.");
      return null;
    }

    if (tag == "open") {
      final url = (map["url"] as String?) ?? "";
      if (url.isNotEmpty) await NativeBridge.openUrl(url);
      return null;
    }

    return null;
  }

  Future<void> _handleBack() async {
    final web = _web;
    if (web != null) {
      final closed = await web.evaluateJavascript(
        source:
            "(function(){var d=document.querySelector('dialog[open]');"
            "if(d){d.close();return true}return false})()",
      );
      if (closed == true) return;
      if (await web.canGoBack()) {
        await web.goBack();
        return;
      }
    }
    if (_exitArmed) {
      await SystemNavigator.pop();
      return;
    }
    setState(() => _exitArmed = true);
    await _snack("Tekan kembali sekali lagi untuk keluar.");
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) setState(() => _exitArmed = false);
  }

  Future<void> _retry() async {
    setState(() {
      _failed = false;
      _loading = true;
    });
    final web = _web;
    if (web == null) return;
    try {
      await web.loadUrl(
        urlRequest: URLRequest(url: WebUri(AppConfig.appUrl)),
      );
    } catch (_) {
      if (mounted) setState(() => _failed = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) _handleBack();
      },
      child: Scaffold(
        backgroundColor: AppColors.chrome,
        body: SafeArea(
          child: Stack(
            children: [
              _buildWebView(),
              if (_loading && !_failed) _buildLoading(),
              if (_failed) _buildError(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildWebView() {
    return InAppWebView(
      initialUrlRequest: URLRequest(url: WebUri(AppConfig.appUrl)),
      initialSettings: InAppWebViewSettings(
        javaScriptEnabled: true,
        domStorageEnabled: true,
        databaseEnabled: true,
        useHybridComposition: true,
        mediaPlaybackRequiresUserGesture: true,
        supportZoom: false,
        builtInZoomControls: false,
        displayZoomControls: false,
        disableContextMenu: true,
        allowFileAccess: false,
        allowContentAccess: false,
        cacheEnabled: true,
        thirdPartyCookiesEnabled: false,
        verticalScrollBarEnabled: false,
        horizontalScrollBarEnabled: false,
        useShouldOverrideUrlLoading: true,
        textZoom: 100,
        transparentBackground: false,
      ),
      initialUserScripts: UnmodifiableListView<UserScript>([
        UserScript(
          source: bridgeScript,
          injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START,
          forMainFrameOnly: true,
        ),
      ]),
      onWebViewCreated: (controller) {
        _web = controller;
        controller.addJavaScriptHandler(
          handlerName: "dcm",
          callback: _onBridge,
        );
      },
      onLoadStart: (controller, url) {
        if (!mounted || !_loading) return;
        setState(() => _failed = false);
      },
      onLoadStop: (controller, url) {
        if (!mounted) return;
        setState(() {
          _loading = false;
          _failed = false;
        });
      },
      onProgressChanged: (controller, progress) {
        if (!mounted) return;
        if (progress >= 100 && _loading) {
          setState(() => _loading = false);
        }
      },
      onReceivedError: (controller, request, error) {
        if (!mounted) return;
        if (request.isForMainFrame == true) {
          setState(() {
            _loading = false;
            _failed = true;
          });
        }
      },
      onReceivedHttpError: (controller, request, response) {
        if (!mounted) return;
        final code = response.statusCode ?? 0;
        if (request.isForMainFrame == true && code >= 500) {
          setState(() {
            _loading = false;
            _failed = true;
          });
        }
      },
      shouldOverrideUrlLoading: (controller, action) async {
        final uri = action.request.url;
        if (uri == null) return NavigationActionPolicy.ALLOW;
        if (uri.host == AppConfig.host) return NavigationActionPolicy.ALLOW;
        if (uri.scheme == "http" || uri.scheme == "https") {
          await NativeBridge.openUrl(uri.toString());
          return NavigationActionPolicy.CANCEL;
        }
        if (uri.scheme == "mailto" || uri.scheme == "tel") {
          await NativeBridge.openUrl(uri.toString());
          return NavigationActionPolicy.CANCEL;
        }
        return NavigationActionPolicy.ALLOW;
      },
    );
  }

  Widget _buildLoading() {
    return ColoredBox(
      color: AppColors.paper,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset("assets/logo.png", width: 88, height: 88),
            const SizedBox(height: 18),
            const Text(
              "DCM MENARA PERTIWI",
              style: TextStyle(
                color: AppColors.ink,
                fontSize: 14,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              "Menyiapkan aplikasi",
              style: TextStyle(color: AppColors.muted, fontSize: 13),
            ),
            const SizedBox(height: 20),
            const SizedBox(
              width: 160,
              child: LinearProgressIndicator(minHeight: 2),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildError() {
    return ColoredBox(
      color: AppColors.paper,
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset("assets/logo.png", width: 72, height: 72),
              const SizedBox(height: 18),
              const Text(
                "Tidak dapat terhubung",
                style: TextStyle(
                  color: AppColors.ink,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                "Aplikasi memerlukan koneksi internet. Periksa jaringan, lalu muat ulang halaman.",
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.muted, fontSize: 13.5, height: 1.5),
              ),
              const SizedBox(height: 20),
              FilledButton(onPressed: _retry, child: const Text("Coba lagi")),
            ],
          ),
        ),
      ),
    );
  }
}
