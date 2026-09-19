# AquaSmart: penggunaan software lokal

Versi diperiksa 16 September 2026. Aplikasi tetap prototipe lokal. Database aktif sudah dimigrasikan tanpa seed ulang; akun lama tetap digunakan. Folder firmware dan status hardware tidak berubah.

## Menjalankan aplikasi

Dari PowerShell:

```powershell
Set-Location 'C:\Testing-Project\01_AquaSmart\01_Aplikasi-Web'
Get-NetIPAddress -AddressFamily IPv4 | Where-Object InterfaceAlias -Like '*Wi-Fi*'
python -X utf8 server/run_tls_local.py --host 192.168.8.170
```

Ganti argumen host jika IP komputer berubah. Buka **https://192.168.8.170:8443/#/home** dengan awalan HTTPS lengkap. Pesan `Client sent an HTTP request to an HTTPS server` berarti akses memakai HTTP pada port HTTPS. Terminal launcher harus tetap berjalan; Ctrl+C menghentikan PHP dan Caddy. Jangan menjalankan launcher kedua jika layanan sudah aktif.

Komputer dan HP perlu saling menjangkau di LAN. Akses dari komputer sendiri belum membuktikan akses HP. Jika timeout, periksa jaringan/isolasi klien dan rule TCP8443 terarah pada LOCAL_GUIDE.md. Pembuatan rule memerlukan PowerShell Administrator; jangan mematikan firewall global.

## Kepercayaan sertifikat dan instalasi

CA publik: `server/tls/public/AquaSmart-local-root.crt`. Transfer hanya file tersebut ke perangkat uji. Trust yang dipasang di Windows tidak otomatis berlaku di HP. Private key tetap di direktori runtime pengguna di luar web root.

- Android: pasang CA melalui pengaturan keamanan perangkat (nama menu bervariasi), lalu buka URL HTTPS di Chrome. Setelah halaman dipercaya, gunakan menu Install app/Tambahkan ke layar utama bila tersedia. Catat apakah hasilnya aplikasi standalone atau shortcut browser.
- iPhone/iPad: pasang profil CA lokal dan aktifkan trust penuh melalui pengaturan sertifikat perangkat; buka lewat Safari, lalu Bagikan > Tambahkan ke Layar Utama. Instalasi/trust harus dilakukan pemilik perangkat.
- Setelah memasang: buka ikon, periksa login/logout, navigasi, lalu putuskan jaringan untuk memeriksa penanda offline. Data server baru dan kontrol membutuhkan koneksi; jangan menganggap shell offline sebagai bukti data sensor terkini.

Ikon PNG 192/512, ikon Apple 180, identity/scope manifest dan cache shell tersedia. Bukti installability Edge bukan bukti pemasangan Android/iOS. Catat model, versi OS/browser, warning, hasil install dan standalone sebelum menaikkan FR23.

Referensi implementasi: [ikon manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons) dan [ikon Home Screen Apple](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html).

## Alur aplikasi yang tersedia

Login menggunakan akun existing. Dashboard menampilkan perangkat, reading/histori, status dan badge sumber. Alert/rekomendasi mengikuti reading; pengaturan threshold dan jadwal mengikuti hak akses. Reports menyediakan ekspor CSV/JSON serta panel telemetry mentah. Label device bukan bukti kalibrasi; legacy tetap tidak diketahui. Tombol kontrol/jadwal existing menggunakan simulasi; flag hardware launcher tetap nonaktif.

## Verifikasi dan pemulihan

```powershell
python -X utf8 server/tests/run_verified_suite.py
python -X utf8 web/tests/verify_frontend_fixes.py
python -X utf8 server/tests/check_local_tls.py --host 192.168.8.170
node web/tests/review_local_tls.mjs local-tls-check https://192.168.8.170:8443
```

Backend/browser regression memakai database sementara. Jangan menjalankan seed_local pada database aktif. Backup migrasi yang sudah diverifikasi berada di `_backup-sebelum-revisi/20260915-202837-active-migration/`; jangan menimpa database yang sedang dipakai. Backup operasional menggunakan `server/backup_local.py` sesuai panduan lokal.

CA/hostname salah harus ditolak. TLS local CA tetap NFR05 PARTIAL. FR23 menunggu instalasi perangkat nyata dan pengujian browser yang belum tersedia. NFR02 membutuhkan observasi uptime; NFR12 membutuhkan bukti retensi durasi nyata; NFR03 dan FR01/FR07–09 memerlukan tahap hardware terpisah. Pengujian singkat tidak menggantikan bukti tersebut.
