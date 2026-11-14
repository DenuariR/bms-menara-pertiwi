# BUILDING MANAGEMENT SYSTEMS MENARA PERTIWI

Aplikasi monitoring operasional gedung berbasis Cloudflare Workers + D1 untuk:
- Chiller York Centrifugal
- Panel Utama Listrik
- Monitoring Ruang Pompa

## Fitur
- Login berbasis role Admin dan Teknisi.
- Ganti password mandiri (Admin maupun Teknisi) langsung dari aplikasi.
- Dashboard operasional: total checklist, status pengisian, tindak lanjut, dan progres per jenis monitoring.
- Input checklist dengan pilihan shift dan **3 sesi pengisian** sebagai label record (Sesi 1/2/3 data terpisah). Referensi jadwal: Shift Pagi 08–10, 11–13, 14–15 (otomatis menyesuaikan Shift Sore & Malam), namun **bebas mengisi kapan saja selama rentang shift berjalan (WIB)**.
- Checklist terbagi menjadi **sub-checklist**: Panel Utama Listrik (KWH Listrik, PDTR Trafo 1 & 2, Trafo, Incoming PLN B1), Monitoring Ruang Pompa (Pompa Transfer, Status pompa, Filter, Supply air, Calfa Bac, Booster Pump B3/P8/25/Rooftop, Stand Meter PAM), dan Chiller York Centrifugal (Evap, Condenser, Compresor, Oil Sump, Motor, Setpoint).
- Status checklist: **Sudah Diisi** dan **Perlu Tindak Lanjut**; status **Belum Diisi** dihitung otomatis untuk kewajiban pengisian yang belum tercatat.
- Pengaturan shift (nama, jam mulai, jam selesai) oleh Admin. Default: Pagi 07:00–15:00, Sore 15:00–23:00, Malam 23:00–07:00.
- Riwayat perubahan checklist, termasuk waktu, teknisi, parameter yang berubah, status, serta snapshot nilai sebelum dan sesudah perubahan.
- Panel **Riwayat Checklist Saya** untuk user: melihat seluruh checklist pribadi yang sudah diisi beserta detail nilai, dan mengunduhnya sebagai Excel berformat formulir.
- Dashboard admin: pemberitahuan teknisi yang belum mengisi per tanggal & shift, lengkap dengan rincian **sesi dan jenis monitoring** yang belum terisi (3 jenis × 3 sesi = 9). Jika ada **jadwal (roster)** untuk tanggal & shift tersebut, hanya teknisi yang bertugas yang dicek. (Panel kelola roster di dashboard sudah dihapus; API roster tetap tersedia.)
- **Jadwal Pengisian (Roster 30 Hari)**: Admin memilih shift + teknisi, sistem membuat roster bergantian harian 30 hari (tabel matriks tanggal × shift, hari ini disorot). Teknisi melihat tugasnya di panel **"Jadwal tugas saya"**. *Panel adminnya kini disembunyikan dari dashboard — manajemen jadwal lewat API.*
- **Batasan shift per akun**: user dapat dibatasi hanya boleh mengisi satu shift tertentu (mis. akun `shift1` hanya Shift Pagi). Penegakan di server (403 bila mencoba shift lain), dropdown form otomatis hanya menampilkan shift yang diizinkan, dan panel "Yang Belum Mengisi" hanya mengecek user yang memang bertugas di shift tersebut. Akun bawaan: `shift1` (Shift Pagi), `shift2` (Shift Sore), `shift3` (Shift Malam) — password `teknisi123`.
- (Panel kelola roster tidak lagi tampil di dashboard; pembuatan jadwal kini lewat API `POST /api/admin/schedule` atau dapat diaktifkan kembali bila diperlukan.)
- Rekap bulanan dengan filter jenis monitoring; ekspor Excel `.xlsx` dan PDF melalui dialog cetak browser (pilih **Save as PDF**).
- Monitoring harian, pengelolaan user, serta pengaturan item checklist.
- **PWA (Progressive Web App)**: bisa dipasang ke layar utama Android via Chrome (**Tambahkan ke layar utama**), tampil fullscreen seperti aplikasi native tanpa Play Store. Sertakan manifest, ikon 192/512, dan service worker.
- UI menggunakan **Bootstrap 5** (CDN): tombol, tabel, dan form otomatis memakai kelas Bootstrap.
- **Dashboard Eksekutif interaktif** (admin):
  - Pemilih **tanggal** sendiri, **muat ulang manual**, dan **segarkan otomatis** (tiap 30/60 detik) dengan cap waktu "terakhir dimuat".
  - Empat **kartu KPI yang bisa diklik** — progres pengisian (dengan progress bar), checklist terisi, perlu tindak lanjut, belum mengisi — klik kartu → tabel "Monitoring harian" otomatis terfilter.
  - **Grafik Chart.js interaktif**: doughnut status (klik potongan → filter), bar record per jenis monitoring (klik batang → filter), dan **line tren pengisian 7/14/30 hari** (checklist vs perlu tindak lanjut).
  - **Matriks progres teknisi** per sesi (0/3, 1/3, 2/3, 3/3 berwarna) — klik sel → rincian jenis monitoring yang belum diisi.
  - Bar **filter aktif** di tabel monitoring harian dengan tombol "Hapus filter".

## Deploy instalasi baru
1. Install Node.js dan Wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. Buat database: `wrangler d1 create daily-checklist-db`
4. Salin `database_id` dari output ke `wrangler.toml`.
5. Jalankan schema: `wrangler d1 execute daily-checklist-db --remote --file=./schema.sql`
6. Buat secret: `wrangler secret put SESSION_SECRET` (hapus placeholder `SESSION_SECRET` di `[vars]` jika memakai secret command).
7. Deploy: `wrangler deploy`
8. Buat akun admin pertama menggunakan `scripts/create-admin.mjs` sesuai instruksi script. Setelahnya ganti password cukup lewat panel **Ganti Password** di aplikasi.

## Upgrade database lama
**Jangan jalankan ulang `schema.sql` sebagai pengganti migrasi pada database produksi yang sudah berisi data.** Jalankan migrasi satu kali:

`wrangler d1 execute daily-checklist-db --remote --file=./migration.sql`

Migrasi menambah kolom shift/status/catatan dan membuat tabel shift serta audit history tanpa menghapus checklist lama. Checklist lama akan memiliki status default `Sudah Diisi`; shift lamanya tidak dapat diketahui sehingga kolom shift akan kosong.

## Lokal
`wrangler dev` menjalankan Worker lokal. Untuk database lokal baru: `wrangler d1 execute daily-checklist-db --local --file=./schema.sql`.

## Catatan operasional
- Jam validasi shift memakai zona waktu `Asia/Jakarta` (WIB).
- Satu teknisi hanya memiliki satu record per tanggal dan jenis checklist. Pengisian ulang pada tanggal/jenis yang sama memperbarui record dan menambahkan entri audit baru.
- Ekspor PDF menggunakan fitur print browser; pilih tujuan **Save as PDF**.
- Ekspor `.xlsx` menggunakan SheetJS dari CDN sehingga browser perlu koneksi internet saat memuat library tersebut.
- Data pengukuran tetap diinput manual oleh teknisi. Status tindak lanjut dipilih teknisi pada saat menyimpan checklist.

## Dashboard Manajemen (fitur tambahan)
- Grafik tren monitoring 6 bulan dengan komposisi checklist selesai, tindak lanjut, dan belum diisi.
- Indikator kondisi per jenis peralatan pada tanggal yang dipilih: **Normal** (terisi tanpa tindak lanjut), **Warning** (ada teknisi yang belum mengisi), dan **Critical** (ada checklist perlu tindak lanjut).
- Indikator kondisi adalah klasifikasi administratif berdasarkan status checklist, bukan diagnosis otomatis dari ambang batas sensor. Untuk alarm teknis otomatis, Admin perlu menentukan batas normal/minimum/maksimum setiap parameter peralatan.
