import "package:flutter/services.dart";

abstract final class NativeBridge {
  static const MethodChannel _channel = MethodChannel("dcm/native");

  static Future<bool> saveFile({
    required String name,
    required String mime,
    required String base64,
  }) async {
    try {
      final result = await _channel.invokeMethod<bool>("saveFile", {
        "name": name,
        "mime": mime,
        "base64": base64,
      });
      return result ?? false;
    } on PlatformException {
      return false;
    } on MissingPluginException {
      return false;
    }
  }

  static Future<bool> printHtml({
    required String html,
    required String jobName,
  }) async {
    try {
      final result = await _channel.invokeMethod<bool>("printHtml", {
        "html": html,
        "jobName": jobName,
      });
      return result ?? false;
    } on PlatformException {
      return false;
    } on MissingPluginException {
      return false;
    }
  }

  static Future<bool> openUrl(String url) async {
    try {
      final result = await _channel.invokeMethod<bool>("openUrl", {
        "url": url,
      });
      return result ?? false;
    } on PlatformException {
      return false;
    } on MissingPluginException {
      return false;
    }
  }
}
