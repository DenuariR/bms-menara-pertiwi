# Arah desain: Konsol operator

Dokumen ini mengikat tampilan DCM Menara Pertiwi. Setiap warna, ukuran huruf, radius, dan bayangan di `src/index.js` harus berasal dari sini. Kalau sebuah nilai tidak ada di daftar, nilai itu tidak dipakai.

## Alasan

Teknisi memakai aplikasi ini di ruang pompa dan panel listrik, sering sambil berdiri, kadang dengan sarung tangan. Admin memakainya untuk membaca angka dan mengekspor laporan. Tampilan harus terbaca seperti panel HMI di ruang gelap: tenang, padat, dan jelas mana angka mana label. Bukan seperti dashboard SaaS.

## Prinsip

1. Permukaan datar. Tidak ada gradien, tidak ada bayangan dekoratif. Kedalaman hanya dari garis 1px dan perbedaan latar.
2. Header tetap navy `#0b2a4a` dengan teks dan logo putih. Selain header, hanya hitam `#000000` dan putih `#ffffff`. Hierarki dibedakan oleh opasitas hitam, berat huruf, dan bentuk garis, bukan oleh warna tambahan.
3. Angka rata. Semua nilai memakai angka tabular dan font monospace. Kolom angka tidak bergoyang saat data berubah.
4. Radius kecil. 3px untuk kontrol, 4px untuk panel. Sudut membulat besar adalah bahasa visual aplikasi konsumen, bukan alat kerja.
5. Label huruf besar kecil. Label bidang dan judul panel memakai huruf kapital 10 sampai 12px dengan jarak huruf. Isi tetap huruf normal.
6. Ikon geometris. SVG garis 16px, bukan emoji. Emoji berubah bentuk antar perangkat dan tidak bisa diwarnai.
7. Header navy, sisanya hitam putih. Latar halaman dan panel putih, teks hitam, pemisah hitam beropasitas rendah. Navy hanya muncul di header dan warna tema sistem.

## Palet

| Token | Nilai | Pemakaian | Kontras |
| --- | --- | --- | --- |
| Header | `#0b2a4a` | Latar header, teks dan garis bawah putih | 14.54:1 dengan putih |
| `--paper`, `--surface`, `--chrome` | `#ffffff` | Latar halaman, panel, tabel, bilah tab | 21:1 dengan teks hitam |
| `--text`, `--ink`, `--side-text` | `#000000` | Teks utama dan judul | 21:1 |
| `--ink-2`, `--accent-dark` | `rgba(0,0,0,.85)` | Teks aktif turunan | 15.13:1 |
| `--ink-3`, `--muted`, `--side-dim`, `--warn` | `rgba(0,0,0,.72)` | Teks sekunder | 9.29:1 |
| `--line` | `rgba(0,0,0,.22)` | Garis pemisah | 1.69:1, hanya garis |
| `--control` | `rgba(0,0,0,.42)` | Tepi input dan tombol sekunder | 3.03:1 |
| `--accent`, `--focus`, `--ok`, `--crit` | `#000000` | Tautan, fokus, terisi, belum diisi | 21:1 |
| `--btn`, `--btn-danger` | `#000000` | Tombol dengan teks putih | 21:1 |

Status tidak memakai warna. Terisi ditulis tebal, perlu tindak lanjut miring, belum diisi bergaris bawah. Legenda memakai kotak hitam penuh, kotak berbatas hitam, dan kotak hitam 32 persen. Grafis tren memakai garis putus-putus untuk deret lanjutan.

Logo di header berukuran 124x50px di desktop dan 104x42px di bawah 520px. Logo asli berwarna navy, jadi disajikan putih dengan filter agar terbaca di header gelap.

`<meta name="theme-color">` dan `theme_color` manifest mengikuti warna header `#0b2a4a`. `background_color` manifest memakai `#ffffff`.

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
- Transisi hanya untuk toast dan bar muat, maksimal 160ms linear. Bar muat mengisi sekali dari kiri ke kanan dan berhenti penuh selama permintaan berjalan, tanpa putaran tanpa henti.
- Semua animasi dan gulir halus dimatikan saat `prefers-reduced-motion: reduce`.

## Komponen

- Header: tinggi 56px, latar `#0b2a4a`, teks `#ffffff`, garis bawah 3px `#ffffff`, judul 12.5px kapital. Logo 124x50px (104x42px di bawah 520px), tanpa latar dan tanpa garis, ditampilkan putih di atas header gelap.
- Login: kartu putih terpusat, lebar maksimal 460px, latar halaman `--paper`, header dan footer disembunyikan. Garis atas 3px `--accent` mengikat kartu ini ke motif garis aksi header. Judul 22px kapital `--ink`, deskripsi 13.5px `--muted`, dua bidang bertumpuk penuh lebar dengan tinggi 44px dan radius 3px, tombol `--btn` dengan teks putih, dan catatan 12px `--muted`. Tombol tampilkan password muncul saat bidang difokuskan.
- Form checklist: judul panel memakai jenis monitoring yang sedang diisi dan sesinya, tanpa sapaan nama. Judul mengikuti perubahan pilihan jenis, pilihan sesi, dan mode edit atau isi terlewat.
- Sidebar: latar `#ffffff`, lebar 224px, tombol 32px, penanda aktif garis kiri 3px `--accent` dengan latar `--chrome`.
- Tabel: kepala tabel latar `rgba(0,0,0,.06)`, huruf 10.5px kapital, baris 13px, hover `rgba(0,0,0,.09)`.
- Readout: nilai mono 25px, label 10px kapital, catatan 11px. Readout bisa diklik dan punya `aria-label` lewat teks di dalamnya.
- Status: selalu teks. Warna hanya penguat, tidak pernah satu-satunya pembeda.
- Riwayat checklist user: kolom terakhir **Aksi** berisi tombol Lihat dan Edit, tidak membungkus ke baris berikutnya. Tombol Edit membuka checklist tersimpan di form dengan tanggal, jenis, dan sesi terkunci, lalu tombol simpan berubah menjadi **Perbarui checklist**. Tombol **Isi yang terlewat** membuka dialog berisi tanggal dan tabel sesi serta jenis yang belum terisi; tombol Isi memakai form yang sama dengan tombol simpan **Simpan checklist terlewat**.
- Sidebar teknisi: shift tampil sebagai kotak teks berisi nama dan jam, bukan dropdown. Shift diambil otomatis dari jadwal tanggal terpilih, lalu shift pembatas akun, lalu shift yang sedang berjalan.
- Panel **Yang belum mengisi**: satu baris per shift, urut jam mulai (Pagi, Sore, Malam), kolom Shift | Teknisi | Terisi | Yang belum diisi. Nama shift tebal dengan jam di bawahnya, teknisi dipisah koma. Kolom Terisi memakai bentuk `6/9`, atau `-` bila shift tanpa teknisi. "Lengkap semua sesi" memakai `--ok`, rincian kekurangan `--warn`, dan shift tanpa teknisi `--muted`. Tidak ada latar khusus per shift.
- Grafik: garis `--accent`, batang `--accent`, status memakai `--ok`, `--warn`, `--crit` dalam tiga tingkat hitam. Legenda 11px dengan teks `--muted`. Legenda tren memakai urutan yang sama dengan donut: hitam penuh terisi, hitam 72 persen tindak lanjut, hitam 22 persen belum diisi.
- Grid jadwal bulanan: satu baris per teknisi, satu kolom per tanggal, kepala dua baris (nomor tanggal lalu singkatan hari). Nama teknisi menempel di kiri saat tabel digeser, diikuti dua tombol kecil ↑ dan ↓ untuk memindahkan baris ke atas atau ke bawah; tombol nonaktif di ujung atas dan bawah, dan urutan disimpan ke server. Sel memakai kode P, S, M, O, atau tanda - dengan latar `rgba(0,0,0,.06)` untuk O. Tanggal Minggu memakai `--crit` pada kepala kolom sebagai penanda hari libur pekan, bukan status checklist. Klik sel membuka dialog shift berisi kotak centang dan tombol Simpan. Dialog menampilkan jadwal tersimpan di `#schedCellNow`, tetapi centang selalu mulai kosong supaya isian baru menggantikan jadwal lama sepenuhnya. Tombol bahaya **Hapus jadwal** di kaki dialog menghapus satu sel teknisi pada tanggal itu; tombol nonaktif bila sel belum berisi.
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
- Navigasi admin di bawah 1024px memakai bilah tab lengket di bawah header. Bilah ini menggantikan tombol kembali supaya perpindahan antar panel cukup satu ketukan. Alasannya, menu vertikal penuh lebar memaksa pengguna kembali ke menu dulu setiap kali ingin pindah tab.
- Grid jadwal bulanan di bawah 640px diganti daftar 31 tanggal untuk satu teknisi yang dipilih. Alasannya, kolom tanggal tidak bisa dibaca bila 31 kolom dipaksa masuk layar telepon.
- Tabel **Yang belum mengisi** dan **Jam shift** berubah menjadi daftar kartu di bawah 600px. Alasannya, teks panjang dan input waktu tidak muat dalam empat kolom pada layar sempit.
- Tabel admin lain menjaga kolom pertama tetap terlihat saat digulir. Alasannya, nama teknisi atau item adalah acuan untuk membaca baris yang sisanya tersembunyi di samping.
- Bootstrap CSS tidak dipakai. Gaya tombol, tabel, dan input yang sebelumnya berasal dari Bootstrap ditulis langsung di `src/index.js` supaya tidak ada stylesheet pihak ketiga yang memblokir tampilan pertama di jaringan telepon.

## Larangan

- Gradien apa pun.
- Bayangan selain `dialog`.
- Emoji di antarmuka.
- Radius di atas 4px pada panel dan kontrol.
- Teks abu di bawah 4.5:1.
- Angka tanpa `font-variant-numeric: tabular-nums`.
