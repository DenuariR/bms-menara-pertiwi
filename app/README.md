# Aplikasi Android DCM Menara Pertiwi

Aplikasi ini adalah pembungkus Flutter yang memuat Worker DCM Menara Pertiwi di WebView. Seluruh fitur (login, pengisian checklist, riwayat, rekap bulanan, panel admin) tetap berasal dari Worker. Aplikasi hanya menambah penanganan unduhan, cetak PDF, tombol kembali, dan layar saat koneksi gagal.

Sesi login disimpan di `localStorage` WebView. Selama token masih berlaku, membuka kembali aplikasi langsung masuk ke halaman utama tanpa mengisi username dan password. Tombol Keluar dan token yang kedaluwarsa menghapus sesi tersebut.

## Isi folder

- `lib/app_config.dart`: nama aplikasi, URL Worker, dan host yang dianggap internal.
- `lib/web_screen.dart`: WebView, layar muat, layar gangguan koneksi, serta alur tombol kembali.
- `lib/bridge_script.dart`: skrip yang disuntikkan ke halaman untuk menangkap unduhan Excel dan jendela cetak PDF.
- `lib/native_bridge.dart`: pembungkus MethodChannel `dcm/native`.
- `android/app/src/main/kotlin/com/menarapertiwi/dcm/MainActivity.kt`: simpan berkas lewat pemilih berkas Android dan cetak PDF lewat `PrintManager`.
- `android/app/src/main/res`: ikon peluncur adaptif, splash, warna, dan tema.

## Build lewat GitHub Actions

1. Commit dan push seluruh perubahan ke branch `main`.
2. Buka tab **Actions** repositori, pilih **Build APK**, lalu tunggu sampai selesai.
3. Unduh artifact `dcm-menara-pertiwi-apk`, di dalamnya ada `app-release.apk`.

Workflow berjalan otomatis setiap ada perubahan di `app/` atau pada berkas workflow itu sendiri. Tombol **Run workflow** bisa dipakai untuk membangun ulang tanpa mengubah kode.

## Build lokal

Prasyarat: Flutter 3.41.9 (Dart 3.11), JDK 17, dan Android SDK dengan platform 36.

```
cd app
flutter pub get
flutter build apk --release
```

Hasil build ada di `app/build/app/outputs/flutter-apk/app-release.apk`.

## Tanda tangan APK

APK dari workflow memakai debug keystore agar bisa langsung dipasang untuk uji coba. Untuk distribusi resmi, buat keystore rilis, tambahkan `signingConfigs` di `android/app/build.gradle.kts`, lalu simpan berkas keystore dan kata sandinya sebagai GitHub Secrets.

## Cara kerja ekspor

- **Excel**: halaman membuat blob lalu memicu unduhan tautan. Skrip jembatan menangkap blob tersebut, mengirimnya ke Android, dan aplikasi membuka pemilih berkas (`ACTION_CREATE_DOCUMENT`). Berkas tersimpan di lokasi yang dipilih pengguna.
- **PDF**: halaman membuka jendela cetak kosong lalu menulis HTML laporan ke jendela itu. Skrip jembatan menangkap HTML sebelum dicetak, lalu Android menampilkan dialog cetak sistem. Pilih **Save as PDF** untuk menyimpan berkas.
- **Tautan luar**: alamat di luar host Worker dibuka di peramban bawaan perangkat.

## Mengubah alamat server

Ubah `AppConfig.appUrl` dan `AppConfig.host` di `lib/app_config.dart`. Keduanya harus menunjuk host yang sama supaya navigasi internal tetap berada di dalam WebView.

## Catatan

- Aplikasi memerlukan koneksi internet. Saat gagal terhubung, muncul tombol **Coba lagi**.
- Tombol kembali menutup dialog yang sedang terbuka, lalu kembali ke halaman sebelumnya, lalu meminta konfirmasi keluar.
- Ikon aplikasi berasal dari `/icon-512.png` milik Worker.
