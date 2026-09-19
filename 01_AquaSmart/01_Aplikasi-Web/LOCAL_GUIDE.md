# AquaSmart LOCAL PROTOTYPE

Panduan ringkas terbaru: **[SOFTWARE_HANDOVER.md](SOFTWARE_HANDOVER.md)**. Verifikasi 16 September: 96 tes backend, 30 lint PHP dan 24 suite browser lulus. Ikon PWA PNG/Apple dan cache v5 tersedia; browser Windows kembali memverifikasi HTTPS IP 192.168.8.170 tanpa bypass sertifikat. Instalasi HP nyata masih menunggu hasil pengguna.

## Pembaruan akses Android: 16 September 2026

URL terkini adalah https://192.168.8.170:8443/#/home karena IP Wi-Fi komputer berubah. Caddy/PHP telah dijalankan ulang dengan `python -X utf8 server/run_tls_local.py --host 192.168.8.170`; verifikasi CA/SAN dan negative test pada IP baru lulus. Evidence `local-tls-software/tls.json` adalah hasil terbaru; `tls-20260915.json` menyimpan hasil lama. Evidence browser di bawah masih pengujian IP lama.

Pengguna memiliki Android; hasil akses Chrome, trust CA, prompt instalasi dan standalone masih menunggu pengujian pengguna. Public CA untuk ditransfer ke Android tersedia di `server/tls/public/AquaSmart-local-root.crt`; tidak berisi private key. Jangan menganggap trust Windows juga sudah terpasang di Android.

Jika akses HP timeout dan firewall memerlukan rule, perintah untuk IP terkini dari PowerShell Administrator adalah:

```powershell
New-NetFirewallRule -DisplayName 'AquaSmart HTTPS LAN 8443' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8443 -LocalAddress 192.168.8.170 -RemoteAddress LocalSubnet -InterfaceAlias 'Wi-Fi 2' -Profile Any
```

Rule sebelumnya gagal karena Access is denied; belum ada bukti rule terpasang. Jangan mematikan firewall global. Curl Windows pada IP baru gagal dengan `CRYPT_E_NO_REVOCATION_CHECK` karena pemeriksaan revocation tidak tersedia; hasil ini bukan bukti akses Android. Pemeriksaan Python dengan CA dan hostname terverifikasi menghasilkan HTTP200.

Instruksi IP 192.168.0.103 di bagian 15 September berikut adalah riwayat; gunakan alamat baru untuk akses saat ini. FR23 dan NFR05 tetap PARTIAL, status hardware tidak berubah.

## Hasil software terbaru — 15 September 2026 malam

Bagian ini menggantikan status persiapan pada panduan historis di bawah. Database aktif telah dimigrasikan tanpa seed ulang; backup dan pelestarian semua nilai 12 tabel tercatat pada `_backup-sebelum-revisi/20260915-202837-active-migration/result.json`. Jangan menjalankan seed_local terhadap database lama.

HTTPS sekarang berhasil di [AquaSmart lokal](https://192.168.0.103:8443/#/login). Untuk menjalankan ulang dari root aplikasi:

```powershell
python -X utf8 server/run_tls_local.py --host 192.168.0.103
```

Launcher memakai database aktif yang dipertahankan, PHP loopback8080 dan Caddy8443. Credential lama tidak direset; gunakan akun lokal existing. Ctrl+C menghentikan launcher dan kedua proses. Bukan layanan Windows otomatis. Jika IP WiFi berubah, gunakan alamat LAN baru dan ulangi verifikasi SAN/CA serta rule firewall.

Caddy 2.11.4 diunduh dari rilis resmi GitHub caddyserver/caddy; archive diverifikasi terhadap checksum SHA-512 resmi sebelum dieksekusi. Executable berada di `C:\Users\User\.aquasmart\caddy-2.11.4\caddy.exe`. Runtime dan log berada di `C:\Users\User\.aquasmart\tls-local`. Python Windows Store melakukan virtualisasi AppData pada lingkungan ini, sehingga lokasi runtime menggunakan direktori pengguna tersebut.

Perintah yang benar-benar dijalankan: `caddy version`, validate/run melalui launcher, `python -X utf8 server/tests/check_local_tls.py --host 192.168.0.103`, dan `certutil -user -addstore Root C:\Users\User\.aquasmart\tls-local\data\pki\authorities\local\root.crt`. Verifikasi TLS 1.3/HTTP200 berhasil; SAN IP 192.168.0.103 cocok. CA salah menghasilkan CERTIFICATE_VERIFY_FAILED; hostname salah menghasilkan TLS alert/SNI rejection. Tidak ada fallback insecure.

Root CA telah terpasang CurrentUser\Root, thumbprint `87AF00B8F06BEC9BF422510B8EF2841D1F838124`. Edge baru memuat app tanpa sertifikat bypass. Public root certificate boleh disalin ke perangkat uji; root/intermediate private key tidak boleh dibagikan atau dimasukkan ZIP. Jika kelak ingin menghapus trust pengujian: `certutil -user -delstore Root 87AF00B8F06BEC9BF422510B8EF2841D1F838124` (belum dijalankan).

### Hasil PWA / cross-browser nyata

| Platform | Hasil |
|---|---|
| Edge Windows HTTPS LAN | Secure context, manifest, SW controller dan getInstallabilityErrors lulus (0 error). Headless regression, bukan bukti klik install selesai. |
| Codex in-app browser | Home dan login HTTPS dibuka melalui UI, tanpa interstitial. |
| Android fisik | Belum tersedia/dihubungkan; prompt install dan standalone belum diamati. |
| iOS/Safari/macOS | Platform/browser tidak tersedia; tidak diuji, bukan dinyatakan lulus/gagal. |
| Firefox | Tidak ditemukan pada executable/PATH standar atau connector browser; belum diuji. |

Screenshot viewport390 adalah emulasi desktop, bukan HP. FR23 tetap PARTIAL. Evidence di `../05_Desain-Figma/review-hermes/local-tls-software/`. Tes browser aplikasi setelah UI berubah: 23 suite/246 assertion JSON + 7 SW stdout; tes diagnostik terakhir 10 pass dan HTTPS/PWA LAN 4 pass.

### Kendala akses HP: Windows Firewall

Wi-Fi 2 saat ini profil Public. Upaya memasang rule berikut ditolak **Access is denied**, sehingga rule belum terpasang dan akses HP belum terbukti. Jalankan hanya dari PowerShell Administrator pada LAN terpercaya; scope tetap interface/IP/LocalSubnet, tanpa mematikan firewall atau mengubah profil global:

```powershell
New-NetFirewallRule -DisplayName 'AquaSmart HTTPS LAN 8443' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8443 -LocalAddress 192.168.0.103 -RemoteAddress LocalSubnet -InterfaceAlias 'Wi-Fi 2' -Profile Any
```

Setelah akses tersedia, pasang public root CA ke HP dan percaya sertifikat untuk TLS sesuai OS, buka URL IP LAN HTTPS, lalu catat Add to Home Screen/prompt, standalone, offline fallback, login/logout serta versi OS/browser. Jika tidak ada prompt, cek error manifest/SW/ikon/scope dan dukungan platform; jangan menebak penyebab sebelum mengamati. TLS local CA hanya NFR05 PARTIAL.

### Provenance dan ekspor

Badge sumber adalah field eksplisit, bukan hasil parsing pesan atau flag simulation. Legacy tidak diketahui tetap Legacy. Device berarti deklarasi sumber, bukan bukti hardware/kalibrasi. Panel raw menampilkan ADC/mV/null/status/sesi; mapping turbidity bukan NTU dan pH tanah bukan pH air. Pilih jenis ekspor Telemetry mentah untuk diagnostik. Lima hitungan sumber disertakan pada JSON/report/CSV; X-Provenance-Counts juga mengirim semua hitungan nol untuk CSV kosong (file kosong tetap header saja). Report source_* per hari menghitung sampel, bukan jumlah baris aggregate.

## Panduan historis persiapan (status lama)


## Kelanjutan hardware dan LAN — 15 September 2026

Wiring: [hardware/WIRING.md](hardware/WIRING.md). Firmware dan toolchain: [firmware/esp32/README.md](firmware/esp32/README.md). Status saat ini: source disiapkan, belum compile/flash. Arduino CLI/Caddy tidak ditemukan di PATH; port serial kosong tanpa error pada `hardware/environment-check.json`.

### Fase 1: HTTP LAN privat

Gunakan database development yang dipertahankan. Backup konsisten wajib sebelum pertama kali membuka database lama dengan versi schema baru. Backup sesi ini tersedia di `_backup-sebelum-revisi/20260915-hardware-api/aquasmart-before.sqlite`; database aktif belum dimigrasikan dalam checkpoint ini. Tes memakai database sementara. Hentikan server sebelum mengganti/restore database; restore ke path baru dan arahkan AQUASMART_DB_PATH, jangan menimpa DB yang sedang dipakai.

Perintah contoh berikut belum dijalankan untuk membuka LAN. Ganti IPv4 dengan alamat WiFi/LAN komputer dari `Get-NetIPAddress -AddressFamily IPv4`; jangan gunakan 127.0.0.1 sebagai alamat tujuan ESP32. Periksa tidak ada layanan lain memakai port 8080.

```powershell
Set-Location 'C:\Testing-Project\01_AquaSmart\01_Aplikasi-Web'
$lanAddress = 'GANTI_IPV4_LAN_KOMPUTER'
$env:AQUASMART_DB_PATH = (Resolve-Path 'server/data/aquasmart.sqlite').Path
$env:AQUASMART_APP_ENV = 'development'
$env:AQUASMART_SESSION_SECURE = '0'
# Tetap OFF hingga wiring low-voltage dan konfigurasi firmware siap.
$env:AQUASMART_HARDWARE_ENABLED = '0'
php -S "${lanAddress}:8080" -t web server/router.php
```

ESP32 dan komputer harus berada di LAN yang saling menjangkau (WiFi ESP32 2.4 GHz), tanpa guest/client isolation. Firmware memakai API_BASE HTTP dengan IPv4 private dan ALLOW_PRIVATE_LAN_HTTP=true. HTTP mengekspos key di jaringan: gunakan hanya diagnosis singkat LAN terpercaya, tanpa port forwarding/router publik.

Windows Firewall, PowerShell Administrator: buat rule terbatas profil Private dan LocalSubnet **hanya jika diperlukan**. Perintah ini belum dijalankan; jangan mematikan firewall global.

```powershell
New-NetFirewallRule -DisplayName 'AquaSmart HTTP LAN sementara' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8080 -Profile Private -RemoteAddress LocalSubnet
# Setelah fase HTTP selesai:
Remove-NetFirewallRule -DisplayName 'AquaSmart HTTP LAN sementara'
```

Gunakan key unik device, bukan key fixture test. Buat command hardware secara sengaja melalui endpoint admin+CSRF `hardware-commands`; tombol control/jadwal existing tetap simulator. Flag server dan firmware keduanya harus mengizinkan aktuator. Jangan menjalankan otomatisasi beban AC.

### Fase 2: Caddy HTTPS lokal

Template tersedia `server/tls/Caddyfile.example`. Caddy **belum tersedia/dijalankan**, sehingga TLS runtime dan NFR05 masih **UNVERIFIED**. Setelah TLS local CA benar-benar lolos verifikasi, status hanya boleh naik ke **PARTIAL**.

Pasang Caddy dari [distribusi resmi](https://caddyserver.com/docs/install). PHP untuk fase ini bind hanya `127.0.0.1:8080`, dengan AQUASMART_SESSION_SECURE=1. Caddy menerima HTTPS 8443 dan proxy ke PHP; port PHP tidak perlu rule LAN. Template menonaktifkan admin API, redirect HTTP dan instalasi trust otomatis.

```powershell
$env:AQUASMART_TLS_HOST = 'GANTI_IPV4_LAN_ATAU_NAMA_DNS_LOKAL'
$env:AQUASMART_SESSION_SECURE = '1'
# Terminal pertama, dengan AQUASMART_DB_PATH yang benar:
php -S 127.0.0.1:8080 -t web server/router.php
# Terminal kedua:
caddy validate --config server/tls/Caddyfile.example --adapter caddyfile
caddy run --config server/tls/Caddyfile.example --adapter caddyfile
```

Untuk akses LAN HTTPS tambahkan rule Private/LocalSubnet yang sama dengan port 8443 dan nama `AquaSmart HTTPS LAN`. Nama/IP URL harus sama dengan AQUASMART_TLS_HOST dan SAN sertifikat. Nama DNS lokal harus dapat di-resolve oleh komputer, ponsel, dan ESP32; `.local` tidak otomatis tersedia.

Periksa `caddy environ` dan direktori data Caddy aktual untuk `pki/authorities/local/root.crt`. Distribusikan **root.crt publik saja**, bukan root.key/private key. Pasang root CA secara eksplisit pada perangkat uji terpercaya, lalu embed PEM root.crt ke ROOT_CA dalam config.local.h ESP32. Jangan menaruh private key di folder web/ZIP/source. `skip_install_trust` memastikan menjalankan template tidak otomatis mengubah trust OS.

Verifikasi dari klien dengan CA dan hostname, tanpa opsi insecure:

```powershell
curl.exe --cacert 'GANTI_PATH_ROOT_CRT' 'https://GANTI_HOST_YANG_SAMA:8443/api/health'
```

Catat tanggal, hostname/SAN, masa berlaku, issuer local CA, dan hasil verifikasi klien. Uji CA salah dan hostname salah harus ditolak. Firmware default memanggil setCACert dan memerlukan waktu NTP valid; setInsecure hanya fallback development eksplisit OFF secara default, tidak menjadi evidence TLS. Dokumentasi resmi: [tls internal](https://caddyserver.com/docs/caddyfile/directives/tls), [trust CA lokal](https://caddyserver.com/docs/automatic-https).

### PWA dan browser manual

Belum diuji pada Android/iOS/Safari/Firefox fisik. HTTP alamat LAN bukan secure context yang diperlukan Service Worker; pengecualian localhost komputer tidak berlaku pada IP LAN ponsel. Setelah CA lokal dipercaya dan HTTPS valid, uji Android Chrome: login, dashboard, Add to Home Screen/Install jika tersedia, buka standalone, tutup/buka, logout, offline fallback tanpa menampilkan data sesi pengguna sebelumnya.

iOS Safari: percaya profil root CA pada perangkat uji sesuai pengaturan OS, buka URL HTTPS tanpa warning, gunakan Share → Add to Home Screen bila tersedia, lalu ulangi alur login/logout/standalone/offline. Periksa keyboard form, safe-area, orientasi dan ukuran layar. Jangan menganggap tes Chromium desktop membuktikan iOS.

Firefox desktop dan Safari macOS: uji auth/CSRF, tabel/chart, modal keyboard/focus, ekspor CSV/JSON, offline fallback dan reduced motion. UI instalasi PWA berbeda antar browser; fungsi aplikasi web diuji terpisah dari kemampuan instalasi. Catat versi OS/browser, hasil aktual dan screenshot, bukan mengisi checklist lulus sebelum diuji.

Referensi: [persyaratan instalasi PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), [trust sertifikat manual iOS](https://support.apple.com/en-us/102390).

## Panduan aplikasi lokal sebelumnya

Lingkungan utama: Windows PowerShell. Membutuhkan PHP dengan PDO SQLite dan mbstring, Python 3, serta Node.js dan Edge untuk test browser. Tidak memakai Git atau proses build frontend.

## Menjalankan demo lokal

```powershell
Set-Location C:\Testing-Project\01_AquaSmart\01_Aplikasi-Web
python server/run_local.py
```

Launcher mencetak alamat loopback, akun admin/viewer, key berbeda untuk setiap perangkat, lokasi database baru, dan log PHP. Simpan credential sendiri bila ingin dipakai kembali. Jangan menyalinnya ke frontend, laporan, atau source publik. Setiap run membuat direktori `server/data/local-<waktu>-<acak>` baru; database aktif lama tidak ditimpa. Hentikan dengan Ctrl+C. Gunakan `--port 8081` bila 8080 sedang dipakai.

Scheduler berjalan sekali per detik selama launcher hidup. Jadwal mengikuti `Asia/Jakarta`; laporan kalender memakai UTC. Jadwal yang terlewat ketika launcher mati tidak dieksekusi ulang. Tanpa ACK dari simulator, command menjadi timeout; ini bukan kegagalan motor fisik.

## Menjalankan simulator perangkat

Pada PowerShell kedua, salin key yang baru dicetak launcher ke environment lokal:

```powershell
$env:AQUASMART_DEVICE_KEY = Read-Host 'Device key dari launcher'
python server/simulator_device.py --base-url http://127.0.0.1:8080 --device-id AQS-KOLAM-01 --once
```

Gunakan key yang sesuai dengan device ID. Tekan Beri Pakan lalu jalankan simulator sebelum 60 detik. Simulator memproses satu batch dan ACK sukses; gunakan `--outcome failed` untuk kegagalan atau `--outcome timeout` untuk sengaja tidak mengirim ACK. Scheduler menandai timeout ketika masa berlaku habis. Semua perintah adalah SIMULASI. Tidak ada akses GPIO/serial.

Demo frame tersedia melalui Lihat Demo Sistem. Slider NTU memengaruhi status dan rekomendasi; dropdown respons feeder menampilkan sukses/gagal/timeout. Demo frame berdiri sendiri dan tidak menulis reading atau command ke database.

## Seed terpisah

```powershell
php server/seed_local.php C:\lokasi-yang-anda-pilih\demo-baru.sqlite
```

Path harus belum ada. Output mencakup akun, serial tersedia/sudah diklaim/tidak terdaftar, serta contoh payload valid dan invalid. Seed memuat device normal, warning, critical, offline, tanpa reading; reading simulasi, jadwal, tiga status feeding log, audit, dan observasi. Invalid payload harus ditolak API, bukan dimasukkan sebagai data sensor valid. Kirim fixture valid dua kali dengan timestamp identik untuk membuktikan idempotensi.

## Test

```powershell
python server/tests/run_verified_suite.py
python web/tests/verify_frontend_fixes.py
python web/tests/verify_static.py
python web/tests/verify_api_integration.py
python web/tests/verify_security.py
python -m unittest discover -s web/tests -p 'test_*.py'
node --check web/assets/js/app.js
node --check web/assets/js/experience.js
```

Runner memakai database dan browser terpisah. Evidence tersimpan di `../05_Desain-Figma/review-hermes/`. `test_static.py` berisi fungsi pytest; unittest discovery tidak mengeksekusi fungsi pytest tersebut. Pemeriksaan statik utama adalah `verify_static.py`.

## Batas saat ini

Halaman Laporan menyediakan Ekspor Data Berfilter: sensor, alert, command, log pakan, dan agregat; CSV/JSON, harian/mingguan/bulanan UTC. Maksimal 10.000 baris; pilih periode lebih pendek bila ditolak. CSV kosong hanya berisi header; JSON kosong berisi metadata dan `rows: []`. CSV menetralkan teks yang dapat dijalankan sebagai formula spreadsheet. Tombol CSV pembacaan dimuat tetap merupakan ekspor terbatas yang terpisah.

Admin dapat mengklaim serial tersedia, mengubah nama/lokasi, dan merotasi key melalui Pengaturan. Key baru ditampilkan sekali dan langsung menggantikan key sebelumnya. Heartbeat tersedia tanpa membuat reading melalui API. Konfigurasi rules yang dipakai ingestion baru disimpan beserta versi dan hash; seed historis tidak diberi versi buatan. Kontrak lengkap: [server/API.md](server/API.md).

Backup konsisten: `python server/backup_local.py --database <path-database> --output <path-backup-baru>`. Backup tidak menimpa file yang ada. Untuk restore, hentikan server lalu gunakan salinan backup sebagai database melalui `AQUASMART_DB_PATH`; jangan menimpa database yang sedang terbuka. Tidak ada penghapusan otomatis reading berdasarkan usia.

PWA shell dan kriteria installability Chromium diuji; instalasi perangkat fisik belum dibuktikan. Tidak ada bukti ESP32 fisik, kalibrasi, TLS produksi, uptime lapangan, atau retensi enam bulan pada deployment nyata. Tanggal observasi dan laporan memakai UTC; jadwal pakan memakai Asia/Jakarta.
