const String bridgeScript = r'''
(function () {
  if (window.__dcmBridgeReady) return;
  window.__dcmBridgeReady = true;

  var blobs = {};

  function send(tag, payload) {
    try {
      if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
        window.flutter_inappwebview.callHandler("dcm", tag, payload);
      }
    } catch (e) {}
  }

  var createUrl = URL.createObjectURL;
  URL.createObjectURL = function (blob) {
    var url = createUrl.call(URL, blob);
    try { blobs[url] = blob; } catch (e) {}
    return url;
  };

  var revokeUrl = URL.revokeObjectURL;
  URL.revokeObjectURL = function (url) {
    try { delete blobs[url]; } catch (e) {}
    return revokeUrl.call(URL, url);
  };

  function toBase64(blob, done) {
    var reader = new FileReader();
    reader.onloadend = function () {
      var text = String(reader.result || "");
      var comma = text.indexOf(",");
      done(comma >= 0 ? text.slice(comma + 1) : "");
    };
    reader.onerror = function () { done(""); };
    reader.readAsDataURL(blob);
  }

  var anchorClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    var href = this.getAttribute("href") || "";
    var name = this.getAttribute("download") || "";
    if (name) {
      var blob = blobs[href];
      if (blob) {
        toBase64(blob, function (base64) {
          send("save", {
            name: name,
            mime: blob.type || "application/octet-stream",
            base64: base64
          });
        });
        return;
      }
      if (/^https?:/i.test(href)) {
        send("open", { url: href });
        return;
      }
    }
    return anchorClick.call(this);
  };

  var openWindow = window.open;
  window.open = function (url, target, features) {
    if (url && url !== "" && url !== "about:blank") {
      var opened = null;
      if (typeof openWindow === "function") {
        try { opened = openWindow.call(window, url, target, features); } catch (e) { opened = null; }
      }
      if (!opened) send("open", { url: url });
      return opened;
    }

    var buffer = [];
    var sent = false;
    var timer = null;

    var fake = {
      document: {
        write: function (text) { buffer.push(String(text)); },
        writeln: function (text) { buffer.push(String(text)); },
        open: function () {},
        close: function () {
          if (sent) return;
          timer = setTimeout(function () { fake.print(); }, 350);
        }
      },
      focus: function () {},
      blur: function () {},
      close: function () {}
    };

    fake.print = function () {
      if (sent) return;
      sent = true;
      if (timer) { clearTimeout(timer); timer = null; }
      send("print", { html: buffer.join("") });
    };

    return fake;
  };
})();
''';
