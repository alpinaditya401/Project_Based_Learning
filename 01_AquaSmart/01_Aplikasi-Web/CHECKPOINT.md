# Checkpoint AquaSmart — software lokal, 15 September 2026

Catatan titik stabil dan langkah lanjut sampai 16 September 2026, bukan status terkini. Status yang berlaku, termasuk gerbang test 21 September 2026, ada di [REVIEW_REPORT.md](REVIEW_REPORT.md).

## Lanjutan provisioning/onboarding/push: checkpoint fondasi 16 September 2026

**Permintaan A–D belum selesai.** Titik aman saat berhenti: mockup dan policy kalkulasi selesai; endpoint, schema provisioning, UI aktif dan Web Push belum disambungkan. Tidak ada migrasi aktif/setengah transaksi, perubahan data existing, atau perubahan firmware. Evidence lama tetap historis; tidak ada klaim semua software produk selesai.

### Selesai pada unit kerja ini

- Membaca target/checkpoint/laporan/SKPL dan mencocokkan source. Klaim lama ada dua jalur tanpa kode: `Auth::register(serial)` dan `DeviceLifecycle::claim(serial)`; kedua jalur wajib diamankan saat activation baru dibuat. Role admin registrasi adalah pemilik, bukan penjual.
- Lima mockup statis di `mockups/` beserta index.html dan REVIEW.md. Loading/empty/success/error/pending, error spesifik, anotasi kalkulasi, token existing, tombol nonaktif berlabel mockup. Review internal diselesaikan sebelum menulis ProductPolicy.
- `docs/KALKULASI.md`: enam kelompok formula, sumber SKPL/asumsi, edge case, dan status tes integrasi yang masih pending. `docs/KONTRAK_PRODUK.md`: kontrak security/integrasi dan daftar tes lanjut; seluruh endpoint di dokumen ini masih rancangan.
- `server/config/product.php` dan `server/src/ProductPolicy.php`: fungsi murni untuk freshness, expiry, activation format/lockout, debounce state, durasi feeder, waktu WIB/window pompa. Belum diimpor oleh router/runtime; perilaku legacy tidak berubah.
- 21 pemeriksaan mockup pass (5 halaman × 4 viewport + exception); 48 pemeriksaan policy pass dibungkus satu unittest pass. Evidence `../05_Desain-Figma/review-hermes/product-mockups-20260916/results.json` dan `policy-results.json`. Runner backend/browser ditambah suite policy/mockup; full runner belum diulang pada unit ini karena runtime existing tidak berubah.
- Backup dokumen sebelum perubahan berada pada folder bertimestamp `*-client-onboarding` di `_backup-sebelum-revisi/`. Tanpa Git.

### Langkah berikutnya, urut

1. Implementasikan A: otorisasi penjual terpisah, schema inventory/activation/credential staging, label/QR lokal, hash kode, unique constraints dan bounded collision retry. Tentukan secret handoff persiapan perangkat tanpa memunculkan key ke client. Tes fixture DB dahulu.
2. Implementasikan B: atomic claim dan persistent lockout/rate limit; perbaiki bypass register/claim lama untuk unit produk; tes dua akun/proses, expiry, reused code, secret leak. Baru sambungkan UI mockup.
3. Implementasikan C: dashboard contract server-time/provenance/multi-unit; jangan memetakan aerator menjadi pompa diam-diam. Hubungkan config/policy baru, tandai jadwal legacy >10 detik perlu review tanpa menghapusnya; uji fast switch dan timezone/restart/ACK boundaries.
4. Implementasikan D: library Web Push terpelihara, VAPID konfigurasi, subscription ownership/SSRF, atomic episode/outbox worker, retries/invalid subscriptions, SW push/click dan flow permission. Tombol test wajib mengirim nyata atau error config, tidak sukses palsu.
5. Sebelum mengaktifkan schema baru: backup DB konsisten, maintenance, migrasi tanpa seed, bandingkan row/value dan rollback bila perlu. Jalankan suite backend/browser relevan dan full regression setelah integrasi.
6. Update checklist penerimaan hanya jika evidence sesuai. WiFi device, ACK fisik, notifikasi/instalasi iPhone tetap PARTIAL/menunggu perangkat.

FR01/FR07–FR09 dan seluruh status hardware tidak berubah. Checklist hasil akhir A–D belum dinaikkan dari mockup atau policy test.

## Acuan target produk setelah diskusi pemilik

Baca **[TARGET_AKHIR_AQUASMART.md](TARGET_AKHIR_AQUASMART.md)** sebelum melanjutkan. Dokumen ini mencatat hasil akhir yang diinginkan: paket aquaponik lele/selada, PWA Android/iPhone, satu akun pemilik untuk beberapa unit, aktivasi mandiri, suhu/pompa/feeder, dan Web Push wajib saat aplikasi ditutup. Target produk tersebut belum seluruhnya diimplementasikan; kelulusan software lokal di bawah bukan penyelesaian onboarding/produk siap jual. Batas pekerjaan firmware tetap berlaku sampai tahapnya dibuka terpisah.

## Penutupan implementasi software lokal: 16 September 2026

Panduan operasional terkini: **SOFTWARE_HANDOVER.md**. Implementasi yang tersedia lulus ulang 96 tes backend (0 failure/error/skip), 30 lint PHP, dan 24 suite browser (368 assertion JSON serta 7 assertion SW stdout). Evidence 16 September 2026 (hasil gerbang 21 September 2026 ada di `test-output/`): `backend-regression-20260916-102137/results.json` dan `frontend-fixes-regression-20260916-102137/summary.json` dalam `../05_Desain-Figma/review-hermes/`.

PWA kini menyertakan ikon PNG 192/512 dari SVG existing dengan padding aman, ikon Apple 180, id/scope eksplisit, dan precache v5 (per 21 September 2026 `web/sw.js` memakai cache `aquasmart-v18`). Tes memverifikasi ukuran/decode/cache ikon serta installability. Tes demo 11 viewport sudah masuk runner utama. Ikon dapat dibangun ulang dengan `node web/tests/build_app_icons.mjs`.

HTTPS aktif kembali melalui launcher, IP 192.168.8.170, TLS1.3; uji CA/hostname benar dan salah lulus. Browser Windows mempercayai HTTPS IP terkini dan PWA installability lulus 4 pemeriksaan (`software-final-https-20260916/results.json`). Tidak ada migrasi ulang, seed ulang, atau perubahan firmware/hardware.

Belum terbukti: pemasangan/standalone Android/iOS nyata, Safari/Firefox, uptime dan retensi durasi nyata. Pengguna sebelumnya melaporkan HTTP dikirim ke port HTTPS; sudah diarahkan memakai URL HTTPS lengkap. Pertanyaan hasil akses Android terkini masih menunggu jawaban. FR23 dan NFR05 tetap PARTIAL; jangan klaim seluruh verifikasi penerimaan selesai.

## Pembaruan 16 September 2026: persiapan uji Android

Audit demo lintas ukuran: 11 viewport portrait/landscape dari 320x568 sampai 1180x820, dua alur dan seluruh lima frame. Ditemukan area isi landscape tinggal 32–48px; diperbaiki dengan modal penuh dan header ringkas pada layar pendek, footer referensi disembunyikan pada kondisi tersebut, serta inset aman navigasi. 111 pemeriksaan layout pass (`demo-devices-final-20260916/results.json`) dan 17 pemeriksaan interaksi pass (`demo-devices-interactions-20260916/results.json`) di folder evidence review-hermes. Screenshot ponsel portrait/landscape dan tablet ditinjau. Ini emulasi Edge, bukan Android/iOS/Safari fisik; FR23 tetap PARTIAL.

Koreksi lanjutan sesuai laporan pengguna saat scroll: kedua tombol kini berada dalam `demo-navigation`, bar bawah di luar panel gulir (bukan kolom samping). Posisi tetap saat scroll dan pergantian frame pada 320/390/756/1280px; 17 pemeriksaan lulus di `../05_Desain-Figma/review-hermes/demo-scroll-bar-20260916/results.json`. Hasil ini menggantikan layout navigasi sebelumnya.

Perbaikan demo sistem: navigasi sebelumnya/berikutnya dipisahkan dari area gulir; hanya panel isi yang menggulir, dan perpindahan frame mengembalikan panel ke atas. `review_demo.mjs` lulus 17 pemeriksaan termasuk posisi kedua tombol saat scroll/pergantian frame pada lebar 320/390/756/1280. Evidence: `../05_Desain-Figma/review-hermes/demo-navigation-fixed-20260916/results.json`. CSS/JS/test dibackup manual sebelum perubahan. Uji Android fisik tetap terpisah dari emulasi ini.

IP Wi-Fi berubah menjadi 192.168.8.170. Launcher Caddy/PHP telah dijalankan ulang dengan `python -X utf8 server/run_tls_local.py --host 192.168.8.170`. URL pada 16 September 2026: https://192.168.8.170:8443/#/home . Uji TLS pada IP baru lulus (CA/hostname benar HTTP200, CA/hostname salah ditolak); `local-tls-software/tls.json` berisi hasil baru, hasil IP lama disimpan sebagai `tls-20260915.json`.

Pengguna mengonfirmasi Android tersedia. Pemeriksaan akses melalui Chrome Android sedang menunggu hasil pengguna; instalasi dan standalone belum diuji. Salinan CA publik: `server/tls/public/AquaSmart-local-root.crt`. Trust Windows tidak otomatis berlaku di Android. Percobaan curl Windows pada IP baru menemui `CRYPT_E_NO_REVOCATION_CHECK`; jangan mencatatnya sebagai lulus. Tes Python memverifikasi CA dan hostname, sedangkan evidence Edge sebelumnya berlaku pada IP lama.

Bagian operasional 15 September di bawah adalah snapshot sebelumnya. Gunakan IP baru untuk URL, argumen launcher dan LocalAddress rule firewall. Tidak ada perubahan status requirement atau hardware.

## Selesai pada sesi ini

- Provenance eksplisit simulation/device/manual/seed/legacy_unverified diteruskan ke DTO reading, alert, audit, histori command/feeding log, observasi, rekomendasi UI dan ekspor. Alert tidak menebak sumber dari pesan. Legacy tidak direlabel menjadi seed atau device.
- Seed baru seluruhnya berlabel seed / seed-local-v1. Database yang sudah berisi pengguna tidak di-bootstrap ulang. Audit aksi manual menyimpan asal alert yang diakui; lifecycle command mempertahankan provenance record asal.
- CSV/JSON enam jenis: readings, alerts, commands, feeding_logs, reports, telemetry. JSON memiliki meta.source_counts; report memiliki source_counts dan lima source_* per hari; CSV memiliki lima source_* serta provenance/session untuk record biasa. HTTP X-Provenance-Counts mencakup keluaran kosong. Flag simulation lama dipertahankan untuk kompatibilitas, bukan pengganti provenance.
- Badge lima sumber tampil; diagnostic raw ADC/mV dan null sensor tersedia, tanpa mengarang pH air/NTU. Ekspor telemetry dipisahkan dari laporan kualitas air. Token desain existing dipertahankan, tanpa dependency/efek berat baru.
- Migrasi database AKTIF berhasil tanpa seed ulang: backup timestamp, 12 tabel lama mempertahankan seluruh nilai dan jumlah row, quick_check OK. 36 reading dan 3 alert lama tetap legacy_unverified. Tidak perlu restore.
- Caddy 2.11.4 resmi terverifikasi SHA-512, HTTPS LAN TLS 1.3 berjalan. CA salah ditolak; hostname salah ditolak melalui TLS/SNI. Root CA dipasang CurrentUser\Root Windows dan Edge benar-benar memuat HTTPS tanpa ignore-certificate flags. In-app browser juga membuka home/login tanpa interstitial.

## Evidence sesi 15 September 2026

- Backend: 96 tes pass, 0 fail/error/skip; 30 PHP lint pass. `../05_Desain-Figma/review-hermes/backend-regression-20260915-203430/results.json`.
- Browser: 23 suite pass, 246 assertion JSON + 7 assertion SW standalone stdout; `../05_Desain-Figma/review-hermes/frontend-fixes-regression-20260915-202608/summary.json`.
- Setelah perbaikan wrapping tabel diagnostik: 10 pemeriksaan pass, screenshot ditinjau; `../05_Desain-Figma/review-hermes/software-provenance-final/results.json`.
- TLS positif/negatif: `../05_Desain-Figma/review-hermes/local-tls-software/tls-20260915.json` (IP 192.168.0.103; `tls.json` sejak 16 September berisi uji IP 192.168.8.170).
- Edge HTTPS LAN/PWA: 4 pemeriksaan pass; `../05_Desain-Figma/review-hermes/local-tls-software/browser/results.json`. Ini bukan pengujian instalasi HP.
- Trust/browser inventory: `../05_Desain-Figma/review-hermes/local-tls-software/trust-and-browsers.json`.
- Migrasi aktif: `_backup-sebelum-revisi/20260915-202837-active-migration/result.json` dan `before.sqlite`. Sebelum migrasi tidak ada proses PHP; runner menolak migrasi jika PHP masih aktif. Migrasi menggunakan Database::connection(false), tanpa bootstrap. Semua tes backend tetap memakai DB sementara.
- Backup source sesi ini: path pada `_backup-sebelum-revisi/latest-software.txt`. Tidak menggunakan Git.

## State operasional

URL aktif saat akhir sesi: https://192.168.0.103:8443/#/login . PHP bind 127.0.0.1:8080, Caddy 8443. Database: server/data/aquasmart.sqlite yang sudah dimigrasikan. Tidak ada akun/password yang direset. Server dijalankan melalui `python -X utf8 server/run_tls_local.py --host 192.168.0.103`; bukan Windows service/autostart. Ctrl+C pada launcher menghentikan kedua proses; jika sesi launcher berakhir, jalankan ulang perintah.

Caddy executable: C:\Users\User\.aquasmart\caddy-2.11.4\caddy.exe. Runtime/config/log/CA: C:\Users\User\.aquasmart\tls-local. Private keys berada di luar workspace/web, jangan distribusikan. Public root.crt: data/pki/authorities/local/root.crt. Thumbprint root yang dipasang: 87AF00B8F06BEC9BF422510B8EF2841D1F838124.

Rule firewall LAN dicoba secara terbatas pada Wi-Fi 2, IP 192.168.0.103, TCP8443, LocalSubnet; Windows menolak dengan Access is denied. Rule TIDAK terpasang; profil Wi-Fi tetap Public, tidak ada penonaktifan firewall. Keberhasilan URL LAN pada komputer sendiri tidak membuktikan akses dari HP.

## Belum selesai / keterbatasan nyata

- Android/iOS fisik tidak tersedia dalam sesi. Prompt install/Add to Home Screen dan peluncuran standalone HP belum diamati. Jangan tulis install gagal: belum diuji.
- Safari iOS/macOS tidak tersedia; Firefox tidak ditemukan pada executable/PATH standar atau browser connector. Connector hanya menyediakan in-app browser. Tidak ada klaim hasil Safari/Firefox.
- Hak administrator diperlukan untuk rule firewall terarah bila HP tidak dapat mengakses. Perintah tepat di LOCAL_GUIDE; setelah itu pasang public root CA di HP yang dipakai uji, lalu catat hasil nyata instalasi/platform.
- TLS menggunakan local CA, bukan TLS publik. Trust HP tidak otomatis mengikuti trust Windows.

## Requirement per 16 September 2026

Penilaian ulang 21 September 2026 terhadap kontrak dan SKPL ada di `docs/CEKLIST_KESESUAIAN_KONTRAK_SKPL.md`.

NFR15: VERIFIED untuk pemisahan logis/provenance software lokal (baris campuran tetap eksplisit; bukan bukti data lapangan/kalibrasi). NFR05: PARTIAL, naik dari UNVERIFIED berdasarkan TLS lokal teruji. FR23: tetap PARTIAL, Edge installability lulus tetapi instalasi HP/Safari/Firefox belum diuji.

FR01 tetap PARTIAL; FR07, FR08, FR09 tetap SIMULATION ONLY. Seluruh status hardware dari sesi sebelumnya TIDAK BERUBAH. Tidak membaca/mengedit firmware dalam pekerjaan ini, tidak flash, tidak mengasumsikan ESP32 tersambung, tidak menguji aktuator.

Total matriks: 30 VERIFIED, 4 PARTIAL (FR01, FR23, NFR05, NFR12), 3 SIMULATION ONLY (FR07–09), 2 UNVERIFIED (NFR02, NFR03).

## Langkah lanjut tepat

1. Baca hasil migrasi dan pastikan URL/IP LAN masih benar; jangan menjalankan seed_local pada DB aktif.
2. Jalankan rule firewall dari PowerShell Administrator hanya pada LAN terpercaya, lalu verifikasi akses HP menggunakan URL HTTPS LAN dan CA yang tepat.
3. Uji install/standalone/offline/logout pada Android dan iOS; uji Safari/Firefox saat browser/platform tersedia. Catat versi, prompt aktual, error dan screenshot; FR23 tetap PARTIAL sampai evidence lengkap.
4. Tahap fisik adalah sesi terpisah; jangan menaikkan FR01 atau FR07–09 dari tes software ini.

Tidak ada migrasi/setengah edit yang masih berjalan. TLS launcher adalah satu-satunya layanan yang sengaja dipertahankan untuk akses aplikasi.
