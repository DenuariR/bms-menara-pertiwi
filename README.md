# DCM MENARA PERTIWI

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
- Pengaturan jam shift oleh Admin. Daftar shift tetap, hanya jam mulai dan jam selesai yang bisa diubah. Default: Pagi 07:00–15:00, Sore 15:00–23:00, Malam 23:00–07:00.
- Riwayat perubahan checklist tetap **dicatat** di tabel `checklist_history` (waktu, teknisi, parameter yang berubah, status, snapshot sebelum/sesudah), tetapi **panel tampilannya di dashboard admin sudah dihapus**. Endpoint `GET /api/admin/history` masih tersedia bila datanya dibutuhkan.
- Panel **Riwayat Checklist Saya** untuk user: melihat seluruh checklist pribadi yang sudah diisi beserta detail nilai, memperbarui checklist lewat tombol **Edit** di kolom Aksi, melengkapi checklist yang terlewat lewat tombol **Isi yang terlewat**, dan mengunduhnya sebagai Excel berformat formulir. Dialog **Isi yang terlewat** memilih tanggal, menampilkan shift yang dijadwalkan pada tanggal itu, lalu mendaftar sesi dan jenis monitoring yang belum terisi. Tombol **Isi** membuka form dengan tanggal, jenis, dan sesi terkunci; penyimpanan dicatat sebagai checklist baru di riwayat.
- Dashboard admin: panel **Yang belum mengisi** menampilkan status per tanggal untuk ketiga shift, **Pagi, Sore, dan Malam**, berurutan menurut jam mulai. Tiap baris memuat teknisi yang dijadwalkan, jumlah terisi dari 9 kewajiban (3 jenis × 3 sesi), dan rincian **sesi dan jenis monitoring** yang belum terisi. Satu shift dianggap terisi bila **minimal satu teknisinya mengisi**; teknisi lain di shift itu ikut dianggap terisi, jadi tidak perlu dua-duanya mengisi. Shift tanpa teknisi tetap tampil dengan keterangan "Tidak ada teknisi dijadwalkan" dan tanda - pada kolom Terisi. Teknisi Libur tidak dihitung. Pesan di atas tabel menyebut jumlah shift lengkap dari tiga, misalnya "1 dari 3 shift lengkap". Shift yang dipilih admin tidak dipakai di panel ini.
- **Jadwal bulanan**: tab **Jadwal shift** menampilkan grid satu bulan penuh, satu baris per teknisi dan satu kolom per tanggal. Kode sel: **P** Pagi, **S** Sore, **M** Malam, **O** Libur, dan **-** belum dijadwalkan. Tanggal Minggu ditandai merah. Tombol **Bulan lalu**, **Bulan depan**, dan isian **Bulan** memindahkan periode. Nama teknisi di kolom kiri punya tombol ↑ dan ↓ untuk memindahkan barisnya ke atas atau ke bawah; urutan tersimpan dan dipakai lagi saat tab jadwal dibuka. Klik satu sel untuk membuka dialog shift teknisi pada tanggal itu; pilihan bisa lebih dari satu shift, dan **Libur** tidak bisa digabung dengan shift. Dialog menampilkan jadwal tersimpan sebagai keterangan, tetapi semua centang mulai kosong; pilihan yang disimpan menjadi jadwal terbaru dan menggantikan jadwal lama sepenuhnya. Tombol **Hapus jadwal** di dialog mengosongkan satu sel teknisi pada tanggal itu setelah konfirmasi. Menyimpan dialog langsung memperbarui grid. Setelah tanggal 1 sampai 10 terisi, tombol **Isi otomatis** membaca urutan status tiap teknisi di tanggal itu lalu menyusun tanggal 11 sampai akhir bulan sebagai blok dua hari per status, misalnya **PP SS MM OO**, sehingga satu status tidak pernah lebih dari dua hari berturut-turut termasuk pada sambungan tanggal 10 ke 11. Jadwal lama di tanggal tersebut diganti. Bila pola seorang teknisi di tanggal 1-10 hanya memuat satu status, permintaan ditolak dengan pesan yang menyebut teknisi tersebut; teknisi yang belum punya jadwal sama sekali di tanggal 1-10 dilewati sehingga tanggal 11 ke atas dibiarkan kosong untuknya. Tombol **Hapus jadwal** membersihkan seluruh shift dan Libur pada bulan yang sedang tampil setelah konfirmasi. Teknisi melihat tugas dan hari liburnya di panel **"Jadwal tugas saya"**.
- **Batasan shift per akun**: user dapat dibatasi hanya boleh mengisi satu shift tertentu (mis. akun `shift1` hanya Shift Pagi). Penegakan di server (403 bila mencoba shift lain). Shift tidak lagi dipilih di dashboard user; sistem memakai shift dari jadwal pada tanggal yang dipilih, lalu shift pembatas akun, lalu shift yang sedang berjalan. Akun bawaan: `shift1` (Shift Pagi), `shift2` (Shift Sore), `shift3` (Shift Malam), password `teknisi123`.
- (Pembuatan jadwal lewat API tetap tersedia: `POST /api/admin/schedule` untuk rentang beberapa hari dan `POST /api/admin/schedule/day` untuk satu tanggal berisi banyak teknisi sekaligus.)
- Rekap bulanan dengan filter jenis monitoring; ekspor Excel `.xlsx`.
- Monitoring harian, pengelolaan user, serta pengaturan item checklist.
- **PWA (Progressive Web App)**: bisa dipasang ke layar utama Android via Chrome (**Tambahkan ke layar utama**), tampil fullscreen seperti aplikasi native tanpa Play Store. Sertakan manifest, ikon 192/512, dan service worker.
- UI mengikuti arah **Konsol operator** pada `DESIGN.md`: permukaan datar, garis 1px, angka tabular, ikon SVG, dan tema **biru muda** (header, sidebar, dan latar halaman biru muda; teks biru tua). Bootstrap 5 (CDN) tetap dipakai untuk perilaku dasar tombol, tabel, dan form, lalu diwarnai lewat variabel CSS agar sama dengan palet aplikasi.
- Audit dan perbaikannya: `anti-slop/audit-001-2026-11-14.md`, `anti-slop/audit-001-2026-11-14-fix.md`, dan `anti-slop/audit-002-2026-11-15-fix.md`.
- **Responsif**: satu kode untuk ponsel teknisi dan layar admin. Sidebar teknisi turun menjadi blok penuh di bawah 860px, menu admin menjadi bilah tab lengket pada layar 1024px ke atas, dialog menjadi hampir selebar layar di ponsel, target sentuh minimal 44px, dan area aman (notch serta bilah gestur) dihormati. Rincian nilai ada di `DESIGN.md`.
- **Jam shift dari dashboard**: admin dapat mengubah jam mulai dan selesai tiap shift pada tab Ringkasan, tanpa membuka Pengaturan. Shift tidak bisa ditambah atau dihapus, baik dari dashboard maupun API. Perubahan jam langsung dipakai pilihan sesi pengisian teknisi.
- **Dashboard Admin interaktif** (admin):
  - Pemilih **tanggal** sendiri, **muat ulang manual**, dan **segarkan otomatis** (tiap 30/60 detik) dengan cap waktu "terakhir dimuat".
  - Empat **readout KPI yang bisa diklik** dalam satu strip: progres pengisian (dengan bar tipis), checklist terisi, perlu tindak lanjut, belum mengisi. Klik readout → tabel "Monitoring harian" terfilter.
  - **Grafik Chart.js interaktif**: doughnut status (klik potongan → filter), bar record per jenis monitoring (klik batang → filter), dan **line tren pengisian 7/14/30 hari** (checklist vs perlu tindak lanjut).
  - **Matriks progres teknisi** per sesi (0/3, 1/3, 2/3, 3/3 sebagai tombol teks), klik sel → rincian jenis monitoring yang belum diisi.
  - Bar **filter aktif** di tabel monitoring harian dengan tombol "Hapus filter".

## Data uji coba

- Akun: `uji1` (Shift Pagi), `uji2` (Shift Sore), `uji3` (Shift Malam), `uji4` (semua shift, mengisi Shift Sore tiap 7 hari). Password keempatnya `UjiCoba123!`.
- Isi: 249 record checklist untuk 30 hari (2026-10-18 sampai 2026-11-16), 3 jenis x 3 sesi per hari, dengan beberapa sesi sengaja dikosongkan dan 18 record berstatus **Perlu Tindak Lanjut**. Roster 90 baris ikut dibuat supaya panel "Yang Belum Mengisi" punya data.
- Generator: `node scripts/seed-test-30d.mjs 30 /tmp/dcm-seed /tmp/dcm-seed/ids.json` (butuh `ids.json` berisi id akun uji).
- Hapus akun dan seluruh datanya: `npx wrangler d1 execute daily-checklist-db --remote --file=scripts/cleanup-test-30d.sql`.

## Data uji pada akun teknisi

Data 30 hari untuk mencoba rekap bulanan, riwayat, isi terlewat, dan ekspor tanpa menunggu pengisian nyata.

- Rentang 2026-10-19 sampai 2026-11-17, 1.376 record checklist pada 8 akun teknisi yang sudah ada: Ade Nursyahbani, Rahmat Budi Raharjo, Muhamad Agung, Muhammad Iqbal, Ardi, Imron, Dimas, Rojak. Tidak ada akun baru dibuat.
- 69 shift lengkap, 12 shift sebagian, 9 shift kosong. Tanggal terakhir sengaja dibuat bertingkat: Shift Pagi lengkap, Shift Sore 7 dari 9, Shift Malam belum diisi, sehingga panel **Yang Belum Mengisi** menampilkan 1 dari 3 shift lengkap.
- 91 record berstatus **Perlu Tindak Lanjut** dengan catatan tindak lanjut.
- Roster 1 sampai 17 November sudah ada sebelumnya. Skrip menambah 78 baris jadwal untuk 19 sampai 31 Oktober dengan pola hari yang sama.
- Generator: `node scripts/seed-live-30d.mjs <roster.json> 30 <folderHasil> 2026-11-17`. Berkas `roster.json` diambil dari `SELECT date,shift_id,user_id FROM schedules`.
- Hapus hanya data buatan skrip ini: `npx wrangler d1 execute daily-checklist-db --remote --file=scripts/cleanup-live-30d.sql`. Berkas itu berisi daftar tepat setiap record dan jadwal tambahan, sehingga pengisian asli tidak tersentuh.

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

Database yang sudah berjalan sebelum status libur ditambahkan juga perlu menjalankan:

`wrangler d1 execute daily-checklist-db --remote --file=./migration-schedule-off.sql`

Migrasi ini hanya membuat tabel `schedule_off` (status libur per teknisi per tanggal) dan indeksnya. Roster di `schedules` tidak berubah. Tabel yang sama juga sudah ada di `schema.sql` untuk instalasi baru.

## Lokal
`wrangler dev` menjalankan Worker lokal. Untuk database lokal baru: `wrangler d1 execute daily-checklist-db --local --file=./schema.sql`.

## Aplikasi Android
Folder `app/` berisi aplikasi Android Flutter yang membuka Worker di WebView, lengkap dengan penyimpanan Excel dan tombol kembali. Aplikasi tidak menggandakan logika server, jadi setiap perubahan pada Worker langsung terpakai tanpa membangun ulang APK.

- Build otomatis: push ke branch `main`, buka tab **Actions**, jalankan **Build APK**, lalu unduh artifact `dcm-menara-pertiwi-apk`.
- Build lokal: `cd app && flutter pub get && flutter build apk --release`.
- APK hasil workflow ditandatangani dengan debug keystore untuk uji coba. Untuk distribusi resmi, siapkan keystore rilis lebih dulu.

Panduan lengkap ada di [`app/README.md`](app/README.md).

## Catatan operasional
- Jam validasi shift memakai zona waktu `Asia/Jakarta` (WIB).
- Satu teknisi hanya memiliki satu record per tanggal dan jenis checklist. Pengisian ulang pada tanggal/jenis yang sama memperbarui record dan menambahkan entri audit baru.
- Ekspor `.xlsx` menghasilkan lembar formulir yang meniru template asli: **Formulir Monitoring** (Panel Utama Listrik & Ruang Pompa: kolom PANEL/ITEM + 8 kolom jam, blok Catatan & Supervisor) dan **Checklist Chiller York** (TIME + grup EVAPORATOR/CONDENSER/COMPRESSOR/OIL SUMP/MOTOR/SETPOINT, baris NOTE & SUPERVISOR). Satu sheet per kombinasi tanggal + jenis; bila lebih dari satu sheet, ditambahkan sheet **Rekap** di akhir. Library ExcelJS 4.4.0 dimuat dari CDN (SRI) saat ekspor pertama, jadi perlu koneksi internet.
- Kolom jam pada sheet formulir diisi dari sesi: Panel/Pompa sesi 1/2/3 → 12:00/15:00/18:00; Chiller sesi 1/2/3 → 09:00/12:00/15:00. Kolom jam lain dibiarkan kosong.
- Data pengukuran tetap diinput manual oleh teknisi. Status tindak lanjut dipilih teknisi pada saat menyimpan checklist.

## Data uji (palsu)
Untuk mencoba rekap bulanan dan ekspor Excel tanpa menunggu pengisian nyata:
```
node scripts/seed-fake-data.mjs 30
# hasil: 11 file SQL + seed-meta.json di folder temp
for f in /data/user/0/com.foxdebug.acode/cache/opencode/tmp/seed/seed_*.sql; do
  wrangler d1 execute daily-checklist-db --remote --file="$f"
done
```
Script membuat ±250 checklist untuk 30 hari terakhir (3 jenis × 3 sesi per hari, dengan beberapa sesi sengaja kosong), nilai realistis sesuai tipe item, sebagian berstatus **Perlu Tindak Lanjut**. Hapus kembali dengan `wrangler d1 execute daily-checklist-db --remote --file=d1-dump/cleanup-fake-data.sql` (berisi daftar id yang dibuat, sehingga data asli tidak tersentuh).

Produksi sudah pernah dibersihkan dari 249 record uji akun `uji1` sampai `uji4`. Data uji yang aktif sekarang adalah data 30 hari pada akun teknisi di bagian **Data uji pada akun teknisi**.

## Dashboard Manajemen (fitur tambahan)
- Grafik tren monitoring 6 bulan dengan komposisi checklist selesai, tindak lanjut, dan belum diisi.
- Indikator kondisi per jenis peralatan pada tanggal yang dipilih: **Normal** (terisi tanpa tindak lanjut), **Perhatian** (ada teknisi yang belum mengisi), dan **Kritis** (ada checklist perlu tindak lanjut).
- Indikator kondisi adalah klasifikasi administratif berdasarkan status checklist, bukan diagnosis otomatis dari ambang batas sensor. Untuk alarm teknis otomatis, Admin perlu menentukan batas normal/minimum/maksimum setiap parameter peralatan.
