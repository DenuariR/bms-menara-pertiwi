# BMS Menara Pertiwi — Laravel + Bootstrap

Versi Laravel dari aplikasi **Building Management Systems Menara Pertiwi**
(paralel dari versi Cloudflare Worker yang tetap berjalan di workers.dev).

## Struktur
- `config/checklist.php` — 21 grup sub-checklist (identik dengan versi Worker)
- `app/Models` — User, Shift, Checklist, ChecklistHistory
- `app/Http/Controllers` — Auth, Checklist, Dashboard (shift-status), User, Password
- `resources/views` — Blade + Bootstrap 5 (CDN)
- `database/migrations` + seeders — users, shifts, checklists, checklist_histories

## Menjalankan (butuh PHP 8.2+ & Composer — di hosting/VPS, bukan di HP)

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # jika memakai sqlite
php artisan migrate --seed       # membuat admin + 3 shift + 3 teknisi
php artisan serve                # http://localhost:8000
```

Login admin: `Admin` / `GantiPasswordSaya2026` (ganti lewat panel Ganti Password).
Teknisi: `rudi` / `andi` / `dewi` — password `teknisi123`.

## Fitur yang sudah ada
- Login session + rate limit (`throttle:10,1`), role admin/user (middleware `role`)
- Input checklist 3 jenis × 21 grup sub-checklist, 3 sesi sebagai label record
- Validasi shift: bebas mengisi kapan pun SELAMA rentang shift berjalan (WIB)
- Riwayat Checklist Saya
- Pemberitahuan admin "Yang Belum Mengisi" (rincian sesi × jenis)
- Riwayat perubahan checklist, kelola user, ganti password
- Bootstrap 5 untuk seluruh UI

## Belum termasuk (lanjutkan di hosting)
- **Ekspor Excel**: tambahkan `composer require maatwebsite/excel`, lalu buat export
  class dari model `Checklist` — struktur kolom sudah tersedia di `config/checklist.php`
- **Foto**: Google Drive API (variabel di `.env.example`) atau Laravel Filesystem
  dengan disk S3/Google via `league/flysystem`
- **PWA** manifest/service worker
