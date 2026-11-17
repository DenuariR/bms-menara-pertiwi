# Arah desain: Konsol operator

Dokumen ini mengikat tampilan DCM Menara Pertiwi. Setiap warna, ukuran huruf, radius, dan bayangan di `src/index.js` harus berasal dari sini. Kalau sebuah nilai tidak ada di daftar, nilai itu tidak dipakai.

## Alasan

Teknisi memakai aplikasi ini di ruang pompa dan panel listrik, sering sambil berdiri, kadang dengan sarung tangan. Admin memakainya untuk membaca angka dan mengekspor laporan. Tampilan harus terbaca seperti panel HMI dan lembar log tercetak: tenang, padat, dan jelas mana angka mana label. Bukan seperti dashboard SaaS.

## Prinsip

1. Permukaan datar. Tidak ada gradien, tidak ada bayangan dekoratif. Kedalaman hanya dari garis 1px dan perbedaan latar.
2. Satu aksen. Biru `#0b5c8a` hanya untuk tautan, garis fokus, penanda aktif, dan grafik. Warna status dipakai pada teks dan kotak kecil, bukan pada seluruh kartu.
3. Angka rata. Semua nilai memakai angka tabular dan font monospace. Kolom angka tidak bergoyang saat data berubah.
4. Radius kecil. 3px untuk kontrol, 4px untuk panel. Sudut membulat besar adalah bahasa visual aplikasi konsumen, bukan alat kerja.
5. Label huruf besar kecil. Label bidang dan judul panel memakai huruf kapital 10 sampai 12px dengan jarak huruf. Isi tetap huruf normal.
6. Ikon geometris. SVG garis 16px, bukan emoji. Emoji berubah bentuk antar perangkat dan tidak bisa diwarnai.
7. Tema biru muda. Header, sidebar, dan latar halaman memakai biru muda. Teks tetap biru tua agar kontras tinggi dan terang di bawah lampu ruang panel.

## Palet

| Token | Nilai | Pemakaian | Kontras |
| --- | --- | --- | --- |
| `--ink` | `#0f3556` | Judul, tombol utama, teks aktif | 12.62:1 dengan putih |
| `--ink-2` | `#164a72` | Hover tombol utama | |
| `--ink-3` | `#1d5f8f` | Tombol utama ditekan | |
| `--paper` | `#eaf4fc` | Latar halaman | |
| `--surface` | `#ffffff` | Panel, kolom tabel | |
| `--line` | `#c8dcee` | Garis pemisah, tepi panel | 1.41:1, hanya garis |
| `--control` | `#5f87a6` | Tepi input dan tombol sekunder | 3.82:1, batas kontrol |
| `--text` | `#10263c` | Teks utama | 15.39:1 dengan putih |
| `--muted` | `#41617b` | Teks sekunder | 6.52:1 dengan putih |
| `--accent` | `#0b5c8a` | Tautan, garis aksen, grafik | 7.21:1 dengan putih |
| `--ok` | `#146c4c` | Status normal, terisi | 6.40:1 dengan putih |
| `--warn` | `#8a5200` | Perlu tindak lanjut | 6.39:1 dengan putih |
| `--crit` | `#a02a20` | Belum mengisi, kritis | 7.38:1 dengan putih |
| `--focus` | `#0b5c8a` | Cincin fokus | 7.21:1 di putih, 5.91:1 di chrome |
| `--chrome` | `#d9ebf9` | Header | 10.34:1 dengan `--ink` |
| `--side-text` | `#123a5c` | Teks sidebar | 9.75:1 di sidebar |
| `--side-dim` | `#3f6280` | Label sidebar | 5.32:1 di sidebar |

Sidebar memakai latar `#dcecf9`. Warna status di sidebar memakai `#0f5c40` (ok, 6.63:1) dan `#7a4a00` (perlu perhatian, 6.20:1).

`<meta name="theme-color">` dan `theme_color` manifest memakai `#d9ebf9`. `background_color` manifest memakai `#eaf4fc`.

## Tipografi

- Sans sistem: `ui-sans-serif, system-ui, "Segoe UI", Roboto, Helvetica, Arial`. Tidak ada webfont, tidak ada Inter.
- Mono sistem untuk angka: `ui-monospace, SFMono-Regular, Menlo, Consolas`.
- Ukuran: isi 14px, tabel 13px, label 11px, judul panel 12.5px, readout 25px.
- Berat: 600 untuk label dan judul, 400 untuk isi. Tidak ada 800 atau 900.

## Bentuk dan jarak

- Radius kontrol 3px, panel 4px, kotak status 1px.
- Garis 1px untuk pemisah, 3px untuk garis aksen header dan penanda menu aktif.
- Jarak panel 12px, isi panel 16 sampai 18px, jarak antar bidang 10 sampai 12px.
- Readout KPI berupa satu strip 4 kolom dengan garis pemisah 1px, bukan empat kartu terpisah.

## Bayangan dan gerak

- Satu bayangan di seluruh aplikasi: `dialog` saat terbuka.
- Transisi hanya untuk toast dan bar muat, maksimal 160ms linear.
- Semua animasi dan gulir halus dimatikan saat `prefers-reduced-motion: reduce`.

## Komponen

- Header: tinggi 56px, latar `--chrome`, teks `--ink`, garis bawah 3px `--accent`, judul 12.5px kapital. Logo 40px (34px di bawah 520px) dengan latar putih, garis 1px, radius 3px.
- Sidebar: latar `#dcecf9`, lebar 224px, tombol 32px, penanda aktif garis kiri 3px `--accent` dengan latar putih.
- Tabel: kepala tabel latar `#f0f7fd`, huruf 10.5px kapital, baris 13px, hover `#f2f8fd`.
- Readout: nilai mono 25px, label 10px kapital, catatan 11px. Readout bisa diklik dan punya `aria-label` lewat teks di dalamnya.
- Status: selalu teks. Warna hanya penguat, tidak pernah satu-satunya pembeda.
- Riwayat checklist user: kolom terakhir **Aksi** berisi tombol Lihat dan Edit, tidak membungkus ke baris berikutnya. Tombol Edit membuka checklist tersimpan di form dengan tanggal, jenis, dan sesi terkunci, lalu tombol simpan berubah menjadi **Perbarui checklist**. Tombol **Isi yang terlewat** membuka dialog berisi tanggal dan tabel sesi serta jenis yang belum terisi; tombol Isi memakai form yang sama dengan tombol simpan **Simpan checklist terlewat**.
- Sidebar teknisi: shift tampil sebagai kotak teks berisi nama dan jam, bukan dropdown. Shift diambil otomatis dari jadwal tanggal terpilih, lalu shift pembatas akun, lalu shift yang sedang berjalan.
- Panel **Yang belum mengisi**: satu baris per shift, urut jam mulai (Pagi, Sore, Malam), kolom Shift | Teknisi | Terisi | Yang belum diisi. Nama shift tebal dengan jam di bawahnya, teknisi dipisah koma. Kolom Terisi memakai bentuk `6/9`, atau `-` bila shift tanpa teknisi. "Lengkap semua sesi" memakai `--ok`, rincian kekurangan `--warn`, dan shift tanpa teknisi `--muted`. Tidak ada latar khusus per shift.
- Grafik: garis `--accent`, batang `--accent`, status memakai `--ok`, `--warn`, `--crit`. Legenda 11px dengan teks `--muted`. Legenda tren memakai urutan yang sama dengan donut: hijau terisi, amber tindak lanjut, merah belum diisi.
- Grid jadwal bulanan: satu baris per teknisi, satu kolom per tanggal, kepala dua baris (nomor tanggal lalu singkatan hari). Nama teknisi menempel di kiri saat tabel digeser, diikuti dua tombol kecil ↑ dan ↓ untuk memindahkan baris ke atas atau ke bawah; tombol nonaktif di ujung atas dan bawah, dan urutan disimpan ke server. Sel memakai kode P, S, M, O, atau tanda - dengan latar `#f0f7fd` untuk O. Tanggal Minggu memakai `--crit` pada kepala kolom sebagai penanda hari libur pekan, bukan status checklist. Klik sel membuka dialog shift berisi kotak centang dan tombol Simpan. Dialog menampilkan jadwal tersimpan di `#schedCellNow`, tetapi centang selalu mulai kosong supaya isian baru menggantikan jadwal lama sepenuhnya. Tombol bahaya **Hapus jadwal** di kaki dialog menghapus satu sel teknisi pada tanggal itu; tombol nonaktif bila sel belum berisi.
- Isi otomatis: tombol utama di toolbar grid. Tanggal 1 sampai 10 menjadi acuan status tiap teknisi; urutan status uniknya diurutkan menjadi blok dua hari (PP SS MM OO) dan diterapkan ke tanggal 11 sampai akhir bulan. Blok terakhir di tanggal 1-10 dihitung supaya sambungan ke tanggal 11 tidak membuat status yang sama lebih dari dua hari. Pola yang hanya memuat satu status ditolak dengan pesan yang menyebut nama teknisi, sedangkan teknisi tanpa jadwal di tanggal 1-10 dilewati dan tanggal 11 ke atas dibiarkan kosong untuknya. Tombol meminta konfirmasi karena menimpa jadwal yang sudah ada.
- Hapus jadwal: tombol bahaya di toolbar grid untuk mengosongkan shift dan Libur pada bulan yang tampil. Konfirmasi dulu, lalu status hasil ditulis di `#schedMonthMsg`.

## Responsif

- Lebar kerja 1180px. Pada layar 1440px ke atas, lebar kerja 1360px.
- Header 56px, turun ke 52px di bawah 520px, ditambah `env(safe-area-inset-top)`. Padding samping memakai `max(20px, env(safe-area-inset-left))` dan `max(20px, env(safe-area-inset-right))`, bagian bawah memakai `env(safe-area-inset-bottom)` agar tidak tertutup bilah gestur.
- Breakpoint mengikuti isi: 860px sidebar teknisi turun menjadi blok penuh, 1024px menu admin menjadi bilah tab lengket tepat di bawah header, 600px padding panel mengecil dan dialog menjadi hampir selebar layar, 420px readout menjadi 2 kolom dan isian checklist menjadi satu kolom.
- Sidebar teknisi memakai `max-height:calc(100dvh - 84px)` dengan gulir sendiri di desktop, agar menu tidak terpotong di layar pendek.
- Grafik memakai tinggi `clamp(170px, 16vw, 230px)` supaya tidak gepeng di layar lebar.
- Target sentuh minimal 44px pada perangkat `pointer:coarse`, termasuk tombol sel matriks. Ukuran huruf isian menjadi 16px pada perangkat sentuh agar Safari iOS tidak memperbesar halaman saat bidang difokuskan.
- Tabel lebar tetap di dalam `.scroll` dengan `overscroll-behavior-x:contain` dan `scrollbar-width:thin`.
- Grid jadwal bulanan memakai `.scroll` untuk 31 kolom tanggal. Kolom nama menempel di kiri, tinggi sel 30px dan menjadi 44px pada perangkat sentuh, sehingga tanggal lain tetap bisa dicapai tanpa membuat halaman melebar.
- `html{scroll-padding-top}` dan `scroll-margin-top` panel disamakan dengan tinggi header lengket supaya lompatan ke bagian tidak tertutup header.

## Larangan

- Gradien apa pun.
- Bayangan selain `dialog`.
- Emoji di antarmuka.
- Radius di atas 4px pada panel dan kontrol.
- Teks abu di bawah 4.5:1.
- Angka tanpa `font-variant-numeric: tabular-nums`.
