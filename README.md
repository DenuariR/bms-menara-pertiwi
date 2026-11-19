# DCM Menara Pertiwi

## Fitur

### Untuk teknisi

- Masuk dengan akun teknisi. Kolom password bisa ditampilkan atau disembunyikan, dan sesi login tetap tersimpan saat aplikasi Android dibuka kembali.
- Mengisi checklist harian untuk tiga jenis monitoring: Chiller York Centrifugal, Panel Utama Listrik, dan Monitoring Ruang Pompa.
- Setiap jenis checklist diisi dalam tiga sesi terpisah.
- Shift ditentukan otomatis dari jadwal tanggal terpilih, pembatasan akun, lalu shift yang sedang berjalan. Teknisi tidak perlu memilih shift secara manual.
- Item checklist menerima nilai teks, angka, dan pilihan status seperti A, O, M atau H, M, L.
- Menyimpan status **Sudah Diisi** atau **Perlu Tindak Lanjut**, lengkap dengan catatan tindak lanjut.
- Melihat detail checklist yang sudah diisi, memperbaruinya lewat tombol **Edit**, dan melengkapi checklist yang terlewat lewat tombol **Isi yang terlewat**.
- Melihat jadwal tugas dan hari libur sendiri.
- Mengunduh riwayat checklist sebagai Excel.
- Mengganti password sendiri.

### Untuk admin

- Masuk dengan akun admin dan mengganti password sendiri.
- Dashboard dengan pemilih tanggal, muat ulang manual, dan segarkan otomatis.
- Empat angka ringkasan yang bisa diklik: progres pengisian, checklist terisi, perlu tindak lanjut, dan belum mengisi.
- Grafik interaktif: donut status checklist, batang jumlah record per jenis monitoring, dan garis tren 7, 14, atau 30 hari. Klik pada grafik menyaring tabel monitoring.
- Matriks progres teknisi per sesi. Klik sel untuk melihat jenis monitoring yang belum diisi.
- Panel **Yang belum mengisi** yang menampilkan status tiap shift, teknisi yang dijadwalkan, dan rincian kekurangan per sesi serta jenis.
- Monitoring harian dengan filter jenis dan status, serta ekspor Excel.
- Rekap bulanan dengan filter jenis dan ekspor Excel.
- Riwayat checklist per shift dan sesi. Tanggal default adalah hari sebelumnya, sehingga checklist hari ini muncul keesokan harinya.
- Jadwal bulanan dengan kode **P** Pagi, **S** Sore, **M** Malam, **O** Libur, dan **-** belum dijadwalkan. Admin bisa mengatur jadwal per sel, menandai libur, mengurutkan teknisi, mengisi otomatis sisa bulan, dan menghapus jadwal.
- Mengatur jam mulai dan jam selesai tiap shift. Daftar shift tetap, hanya jamnya yang bisa diubah.
- Menambah dan menghapus pengguna serta mengatur peran dan pembatasan shift.
- Menambah, mengubah, dan menghapus item checklist tiap jenis monitoring.

### Aplikasi Android

- Membuka aplikasi yang sama dengan versi web, tanpa perlu memasang aplikasi lain.
- Menyimpan berkas Excel melalui pemilih berkas Android.
- Tetap masuk setelah aplikasi ditutup dan dibuka kembali selama token masih berlaku.
- Tombol kembali menutup dialog, kembali ke halaman sebelumnya, lalu keluar setelah ditekan dua kali.
- Layar muat saat membuka aplikasi dan layar khusus saat koneksi terputus.
- Tampilan menyesuaikan layar telepon dan area aman perangkat.

## Tampilan

### Masuk

<img src="docs/screenshots/01-login.png" width="700" alt="Tampilan halaman masuk">

### Dashboard admin

<img src="docs/screenshots/02-admin-dashboard.png" width="900" alt="Dashboard admin dengan angka ringkasan dan grafik">

Dashboard dengan data checklist yang sudah terisi:

<img src="docs/screenshots/admin-dashboard-with-data.png" width="900" alt="Dashboard admin dengan data checklist, grafik berwarna, dan progres teknisi">

### Riwayat checklist per shift dan sesi

<img src="docs/screenshots/03-admin-history.png" width="900" alt="Riwayat checklist admin per shift dan sesi">

### Monitoring harian

<img src="docs/screenshots/04-admin-monitoring.png" width="900" alt="Tabel monitoring harian">

### Jadwal shift

<img src="docs/screenshots/05-admin-schedule.png" width="900" alt="Grid jadwal shift bulanan">

### Form checklist teknisi

<img src="docs/screenshots/06-technician-form.png" width="360" alt="Form pengisian checklist pada layar telepon">

### Riwayat checklist teknisi

<img src="docs/screenshots/07-technician-history.png" width="360" alt="Riwayat checklist teknisi pada layar telepon">

## Video tutorial pengisian checklist

![Video tutorial pengisian checklist](docs/videos/checklist-tutorial.gif)

[Unduh versi video WebM](docs/videos/checklist-tutorial.webm)
