package com.menarapertiwi.dcm

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.print.PrintAttributes
import android.print.PrintManager
import android.util.Base64
import android.view.ViewGroup
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.File

class MainActivity : FlutterActivity() {

    companion object {
        private const val CHANNEL = "dcm/native"
        private const val REQ_SAVE = 9021
        private const val PRINT_KEEP_MS = 300000L
    }

    private data class PrintJob(val view: WebView, val holder: FrameLayout, val file: File)

    private var pendingBytes: ByteArray? = null
    private var pendingResult: MethodChannel.Result? = null
    private val printJobs = mutableListOf<PrintJob>()

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "saveFile" -> {
                        val name = call.argument<String>("name") ?: "dcm-berkas"
                        val mime = call.argument<String>("mime") ?: "application/octet-stream"
                        val data = call.argument<String>("base64") ?: ""
                        queueSave(name, mime, data, result)
                    }
                    "printHtml" -> {
                        val html = call.argument<String>("html") ?: ""
                        val jobName = call.argument<String>("jobName") ?: "DCM Menara Pertiwi"
                        result.success(printHtml(html, jobName))
                    }
                    "openUrl" -> {
                        result.success(openExternal(call.argument<String>("url") ?: ""))
                    }
                    else -> result.notImplemented()
                }
            }
    }

    private fun queueSave(
        name: String,
        mime: String,
        base64: String,
        result: MethodChannel.Result
    ) {
        if (pendingResult != null) {
            result.error("busy", "Penyimpanan sebelumnya belum selesai", null)
            return
        }
        val bytes = try {
            Base64.decode(base64, Base64.DEFAULT)
        } catch (e: IllegalArgumentException) {
            result.error("decode", "Isi berkas tidak valid", null)
            return
        }
        if (bytes.isEmpty()) {
            result.error("empty", "Berkas kosong", null)
            return
        }
        pendingBytes = bytes
        pendingResult = result
        try {
            val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = mime
                putExtra(Intent.EXTRA_TITLE, name)
            }
            startActivityForResult(intent, REQ_SAVE)
        } catch (e: ActivityNotFoundException) {
            pendingBytes = null
            pendingResult = null
            result.success(false)
        } catch (e: Exception) {
            pendingBytes = null
            pendingResult = null
            result.success(false)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQ_SAVE) {
            val result = pendingResult
            val bytes = pendingBytes
            pendingResult = null
            pendingBytes = null
            if (result == null) return
            val uri = data?.data
            if (resultCode == RESULT_OK && uri != null && bytes != null) {
                try {
                    val stream = contentResolver.openOutputStream(uri)
                    if (stream == null) {
                        result.error("save_failed", "Lokasi tidak dapat ditulis", null)
                    } else {
                        stream.use { it.write(bytes) }
                        result.success(true)
                    }
                } catch (e: Exception) {
                    result.error("save_failed", e.message, null)
                }
            } else {
                result.success(false)
            }
            return
        }
        super.onActivityResult(requestCode, resultCode, data)
    }

    private fun printHtml(html: String, jobName: String): Boolean {
        val manager = getSystemService(Context.PRINT_SERVICE) as? PrintManager ?: return false
        val content = findViewById<ViewGroup>(android.R.id.content) ?: return false
        while (printJobs.size >= 2) {
            val oldest = printJobs.firstOrNull() ?: break
            clearPrintJob(oldest)
        }

        val metrics = resources.displayMetrics
        val width = metrics.widthPixels
        val height = metrics.heightPixels
        var job: PrintJob? = null

        return try {
            val file = File(cacheDir, "dcm-print-${System.currentTimeMillis()}.html")
            file.writeText(html, Charsets.UTF_8)

            val web = WebView(this)
            web.setBackgroundColor(Color.WHITE)
            web.settings.javaScriptEnabled = false
            web.settings.allowFileAccess = true
            web.settings.loadsImagesAutomatically = true
            web.isClickable = false
            web.isFocusable = false

            val holder = FrameLayout(this)
            holder.isClickable = false
            holder.isFocusable = false
            holder.addView(web, FrameLayout.LayoutParams(width, height))

            val created = PrintJob(web, holder, file)
            job = created
            printJobs.add(created)

            content.addView(holder, 0, FrameLayout.LayoutParams(width, height))

            web.webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView, url: String) {
                    view.postDelayed({
                        if (!printJobs.contains(created)) return@postDelayed
                        try {
                            val adapter = view.createPrintDocumentAdapter(jobName)
                            manager.print(jobName, adapter, PrintAttributes.Builder().build())
                        } catch (e: Exception) {
                            clearPrintJob(created)
                        }
                    }, 400)
                }

                override fun onReceivedError(
                    view: WebView,
                    request: WebResourceRequest,
                    error: WebResourceError
                ) {
                    if (request.isForMainFrame) clearPrintJob(created)
                }
            }

            web.loadUrl("file://${file.absolutePath}")
            web.postDelayed({ clearPrintJob(created) }, PRINT_KEEP_MS)
            true
        } catch (e: Exception) {
            job?.let { clearPrintJob(it) }
            false
        }
    }

    private fun clearPrintJob(job: PrintJob) {
        printJobs.remove(job)
        (job.holder.parent as? ViewGroup)?.removeView(job.holder)
        job.holder.removeAllViews()
        job.view.destroy()
        job.file.delete()
    }

    private fun openExternal(url: String): Boolean {
        if (url.isBlank()) return false
        return try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(intent)
            true
        } catch (e: ActivityNotFoundException) {
            false
        } catch (e: Exception) {
            false
        }
    }

    override fun onDestroy() {
        printJobs.toList().forEach { clearPrintJob(it) }
        super.onDestroy()
    }
}
