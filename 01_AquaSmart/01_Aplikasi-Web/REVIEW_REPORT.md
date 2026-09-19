# AquaSmart AIoT — laporan review dan penyelesaian lokal

## Lanjutan produk A–D: fondasi, belum integrasi

16 September 2026: mockup seluruh state untuk penjual, klaim, onboarding, dashboard dan Web Push tersedia melalui `mockups/index.html`; review internal di `mockups/REVIEW.md`. `docs/KALKULASI.md` mencatat enam kelompok formula/threshold dan asumsi baru. `docs/KONTRAK_PRODUK.md` menyatakan kontrak endpoint yang **belum aktif**.

Evidence baru: 21 pemeriksaan mockup dan 48 boundary checks policy lulus (`product-mockups-20260916/results.json` serta `policy-results.json` pada review-hermes); satu unittest wrapper pass. Policy config/class belum mengubah router atau database aktif. Full regression historis di bawah belum diulang untuk integrasi karena integrasi A–D belum dibuat.

| Bagian | Selesai | Belum selesai |
|---|---|---|
| A Provisioning | Mockup, formula kode/expiry/lockout, kontrak penjual terpisah | Schema, API, QR nyata, secret handoff, collision/concurrency tests |
| B Klaim/onboarding | Mockup semua state, aturan waiting berbeda online | Atomic claim, bypass legacy, kamera/manual aktif, integrasi dan race tests |
| C Dashboard | Mockup, policy freshness/expiry/durasi/WIB | Dashboard aktif, pump mode, schedule/command integration, switch race tests |
| D Web Push | Mockup izin/error, policy debounce unit-tested | Subscription API, VAPID/transport/outbox, service worker dan push nyata |

Tidak mengubah FR01/FR07–FR09, firmware, atau provenance data existing. Checklist penerimaan end-to-end belum ditandai selesai. Detail langkah lanjut pada CHECKPOINT.md.

## Hasil terbaru: 16 September 2026

Implementasi software lokal diuji ulang: **96 tes backend, 30 lint PHP, 24 suite browser lulus** (368 assertion JSON + 7 SW stdout). Evidence `backend-regression-20260916-102137` dan `frontend-fixes-regression-20260916-102137` pada folder review-hermes. Tidak ada failure/error/skip backend.

PWA dilengkapi PNG 192/512, ikon Apple 180, identity/scope eksplisit dan precache v5, memakai logo existing. Ukuran/decode/cache ikon serta installability diuji. Navigasi demo tetap di luar area scroll; 11 viewport dan semua frame dua alur diperiksa oleh runner rutin. HTTPS LAN IP terkini 192.168.8.170 dipercaya browser Windows: 4 pemeriksaan lulus di `software-final-https-20260916`; TLS1.3, CA salah dan hostname salah diuji ulang melalui check_local_tls.py.

Panduan ringkas: SOFTWARE_HANDOVER.md. Database aktif tidak diseed/migrasi ulang. Firmware dan status hardware tidak berubah. Instalasi PWA fisik Android/iOS, Safari/Firefox, uptime serta retensi durasi nyata belum terbukti; FR23/NFR05 tetap PARTIAL. Hasil di bawah merupakan riwayat jika berbeda dari ringkasan ini.

Pembaruan 16 September: IP LAN berubah menjadi 192.168.8.170; layanan dan sertifikat sudah diperbarui, tes TLS positif/negatif pada IP baru lulus. Android tersedia menurut pengguna; hasil akses dan instalasi fisik masih menunggu pengujian. FR23/NFR05 tetap PARTIAL; status FR01/FR07–09 dan hardware tidak berubah. Detail operasional terbaru di CHECKPOINT.md dan LOCAL_GUIDE.md.

Status terbaru sesi software malam 15 September: **96 tes backend pass, 23 suite browser pass, migrasi database aktif berhasil, TLS local CA teruji**. NFR15 VERIFIED (software), NFR05 PARTIAL, FR23 tetap PARTIAL. FR01/FR07–09 dan seluruh status hardware tidak berubah. Bagian audit awal di bawah adalah riwayat; hasil terbaru ada di bagian “Penyelesaian software lokal”.

## 1. Metadata

- Tanggal review: 15 September 2026, Asia/Jakarta.
- Aplikasi: `C:\Testing-Project\01_AquaSmart\01_Aplikasi-Web`.
- SKPL v1.0: `C:\Testing-Project\01_AquaSmart\02_Manajemen-Proyek\03_SKPL_AquaSmart_AIoT_Revisi.md`.
- Lingkungan: Windows PowerShell, PHP/PDO SQLite, Python 3, Node.js, Edge headless.
- Status produk: **LOCAL PROTOTYPE / SIMULASI**, bukan SIAP PRODUKSI.
- Tahap 1 melewati gate lokal sebelum Tahap 2; review Tahap 2 dan revisi Tahap 3 selesai untuk aplikasi aktif, lalu laporan Tahap 4 disusun. Cakupan eksternal dan arsip praktikum yang belum buildable dinyatakan terpisah; tidak ada klaim seluruh project 100% selesai.

## 2. Progres Tahap 1

Backend PHP + SQLite dipertahankan karena mendukung transaksi, session, prepared query dan pengujian HTTP lokal yang berhasil. Tidak ada Git baru, commit, migrasi stack, atau penimpaan database lama pengguna.

Alur lokal yang tersedia: register dengan serial opsional, login/logout, admin/viewer workspace, claim/edit perangkat, key per-device, heartbeat, ingestion tervalidasi, histori/grafik, threshold, alert dan rekomendasi rule-based, jadwal pakan, queue/ACK simulator, histori kontrol, observasi pertumbuhan, audit, laporan UTC serta ekspor CSV/JSON lima jenis data. UI demo frame mempunyai tab dua alur, prev/next/jump/play/pause/replay, slider NTU, outcome feeder, keyboard/focus trap/Escape dan label SIMULASI.

Seed membuat akun admin/viewer dengan credential acak yang hanya dicetak saat runtime, enam perangkat dengan kondisi normal/warning/critical/offline/tanpa reading, serial tersedia/diklaim/invalid, jadwal, terminal feeding log, observasi dan audit. Contoh payload invalid/duplikat disediakan untuk dikirim ke API, bukan dianggap reading valid. Launcher membuat database baru, PHP loopback dan scheduler; CLI simulator mendukung succeeded/failed/timeout.

Perubahan schema bersifat additive: `device_credentials`, `rule_versions`, `reading_rule_versions`. Snapshot rules dihubungkan ke ingestion baru secara transaksional; seed historis tidak diberi versi buatan. Tes selalu menggunakan SQLite sementara. `server/data/aquasmart.sqlite` lama tidak dipakai tes/seed sesi ini.

Dependency runtime baru: tidak ada. GSAP 3.12.5 (72.214 byte) dan Three.js 0.160.1 (669.884 byte) adalah versi existing yang dipindahkan dari CDN ke lokal. GSAP lazy-load saat demo; Three hanya landing desktop sesuai kemampuan/reduced motion. SVG/HTML fallback tetap informatif. Font memakai fallback lokal, ScrollTrigger dan thumbnail YouTube dihapus. Lisensi/header vendor dipertahankan di `web/assets/vendor/`; tidak mengklaim versi library paling baru.

Panduan menjalankan: [LOCAL_GUIDE.md](LOCAL_GUIDE.md). Kontrak: [server/API.md](server/API.md). Pemilihan visual mengikuti design-dna, ui-ux-pro-max, anti-slop, GSAP dan genjutsu; token, alasan motion dan fallback dicatat di [DESIGN.md](DESIGN.md).

## 3. Ringkasan Review

- Inventaris source saat audit awal: **133 file**, mencakup PHP, Python, JS/MJS, TS/TSX, Vue/Svelte, HTML/CSS, manifest, SVG dan dokumen. Backup, database, cache dan artefak gambar dikecualikan. Dua README panduan kemudian ditambah.
- Review mendalam aplikasi aktif: **33 file runtime first-party** (19 repository/helper PHP, 6 entry/operational scripts, 8 file web). Vendor dibaca pada versi/lisensi/pemuatan, bukan audit seluruh implementasi upstream.
- UI: **8 route** home/login/register/dashboard/alerts/reports/settings/profile; **31 template section** pada kedua JS aktif. Ini jumlah template, bukan section unik yang serentak tampil.
- API: **37 kombinasi metode/path**, termasuk dua jalur simulator, ekspor dan versi rules.
- Pengujian: **88 tes backend unik**, **22 suite browser**, **68 file JS/Python syntax check**, **28 lint PHP**. Test dijalankan terisolasi, bukan pada database atau browser pengguna.
- 30 kelompok temuan: Bug fungsional 8; UI/UX 5; Kualitas kode 6; Keamanan/validasi 4; Gap SKPL 5; Batasan dependency 2. **28 diperbaiki**, satu kelompok arsip dipertahankan dengan batasan eksplisit, satu kelompok dependency fisik PARTIAL.
- Contoh praktikum 05/06/07 serta laporan akademik direview sebagai arsip terpisah: bukan aplikasi aktif, tidak memiliki package/build configuration lengkap dan masih memuat contoh auth/data. Tidak dijalankan atau dihitung sebagai fitur terverifikasi.
- Skrip diagnostik lama yang tidak masuk runner tidak dipakai untuk klaim lulus. Tiga yang syntax-nya rusak diganti entry point kompatibel ke runner maintained; source lama disimpan di backup.

Inventaris dan syntax evidence: `../05_Desain-Figma/review-hermes/source-review-20260915-102322/inventory.json`. Hash tersebut adalah snapshot waktu review, bukan hash setelah semua dokumentasi final ditulis.

## 4. Matriks Requirement

Status awal sesi adalah UNVERIFIED sampai bukti dikumpulkan. VERIFIED di bawah terbatas pada fungsi lokal dan cakupan test yang disebutkan. Rekap setelah penyelesaian software: **30 VERIFIED, 4 PARTIAL, 3 SIMULATION ONLY, 2 UNVERIFIED, 0 NOT IMPLEMENTED**.

| ID | Requirement | Status | Evidence / batas |
|---|---|---|---|
| FR01 | Ingestion sensor dari ESP32 via HTTPS | PARTIAL | HTTP, key per-device, validasi/persist teruji; ESP32 fisik dan TLS belum tersedia. |
| FR02 | Reading dengan device ID dan timestamp | VERIFIED | api_integration, monitoring: penyimpanan dan timestamp UTC. |
| FR03 | Time-series dan histori dashboard | VERIFIED | review_data, review_refresh, review_routes: angka/grafik/histori dan empty state. |
| FR04 | Perbandingan threshold | VERIFIED | monitoring, completion_validation, review_threshold; batas finite dan breach. |
| FR05 | Notifikasi breach | VERIFIED | review_refresh membuktikan ingestion sampai alert UI melalui polling sekitar 15 detik. |
| FR06 | Log notifikasi | VERIFIED | Alert persisten, ownership dan acknowledge idempotent pada API. |
| FR07 | Jadwal pakan otomatis | SIMULATION ONLY | test_operations: tick, hari/jam WIB, auto mode, idempotensi; launcher menjalankan scheduler. |
| FR08 | Feeding log sukses/gagal/timeout | SIMULATION ONLY | command_http, operations, simulator CLI dan ekspor status terminal; tidak ada motor fisik. |
| FR09 | Kontrol feeder/aerator | SIMULATION ONLY | review_feeder dan commands: antre/delivered/ACK/timeout; status bukan bukti aktuator nyata. |
| FR10 | Rekomendasi rule-based | VERIFIED | monitoring: saran terkait parameter breach; tidak mengklaim model ML atau validasi biologis. |
| FR11 | Growth observations | VERIFIED | test_growth, review_growth: create/read/delete, XSS escaping, tanggal UTC, error hapus tertangani. |
| FR12 | Histori kontrol aktuator | VERIFIED | operations dan review_operations; panel polling serta sumber simulator. |
| FR13 | Login/logout | VERIFIED | api_integration, workspace, completion_validation: session, normalisasi kontak, logout. |
| FR14 | Admin/viewer | VERIFIED | Workspace/API/browser: viewer read-only, mutasi/akses silang ditolak. |
| FR15 | Tampilkan threshold | VERIFIED | review_settings, review_threshold; nilai server tampil. |
| FR16 | Update threshold admin | VERIFIED | API CSRF/role/finite/bounds, persist dan UI. |
| FR17 | Heartbeat online/offline | VERIFIED | device_lifecycle dan monitoring: key scoped, heartbeat tanpa reading, last_seen/stale. |
| FR18 | Daftar perangkat/status | VERIFIED | Lifecycle API/UI: claim serial, edit name/location, status/empty dan key rotation. |
| FR19 | Persist versi rules — stretch | VERIFIED | test_rule_versions: snapshot threshold aktual + hash, link reading, retry idempotent dan isolasi owner. |
| FR20 | Agregasi laporan — stretch | VERIFIED | test_reports/calendar: harian/mingguan/bulanan UTC, leap year, empty, error dan sumber. |
| FR21 | Ekspor CSV/JSON — stretch | VERIFIED | test_export 4 tes: 5 jenis data, filter, actual feeding rows, CSV formula, batas tanggal/ownership; review_export actual download. |
| FR22 | UI login/dashboard/settings | VERIFIED | Delapan route aktif dapat dinavigasi; state dan kontrol browser diuji. |
| FR23 | PWA installable basic | PARTIAL | Manifest/SW/installability Edge lulus pada HTTPS LAN dipercaya; install HP/Safari/Firefox belum diuji karena platform tidak tersedia, rule firewall LAN ditolak hak admin. |
| FR24 | Audit who/what/when | VERIFIED | Audit user/device/time untuk auth, lifecycle, threshold, command/scheduler/ACK, observasi, profil dan workspace. |
| NFR01 | TTFB lokal <2 detik | VERIFIED | 10 sampel GET devices: full response maksimum 31,17 ms; bukti terbatas mesin/test lokal ini. |
| NFR02 | Uptime lokal ≥90% | UNVERIFIED | Tidak ada jendela observasi availability yang memadai; test singkat bukan uptime. |
| NFR03 | Akurasi pH ±0,2 / suhu ±0,5°C | UNVERIFIED | Membutuhkan sensor fisik, referensi ukur dan kalibrasi. |
| NFR04 | Password hashing PHP | VERIFIED | password_hash/password_verify; Argon2id bila tersedia, credential seed acak hanya runtime. |
| NFR05 | HTTPS/TLS minimal 1.2 | PARTIAL | Caddy local CA, TLS1.3, CA salah/hostname salah ditolak; root dipercaya Windows/Edge. Bukan TLS publik. |
| NFR06 | Validasi endpoint | VERIFIED | Review router + tes malformed JSON/array, ukuran payload, rentang/tanggal, durasi, role dan input terkait. |
| NFR07 | Rate limiting publik | VERIFIED | Login/register/ingestion: 429 dan Retry-After; bucket 60 detik sejak request pertama. |
| NFR08 | Mitigasi API dasar | VERIFIED | Prepared queries, session/CSRF, ownership, CSP lokal, response tanpa detail internal, scoped device key. Bukan sertifikasi pentest. |
| NFR09 | Ukuran target tombol | VERIFIED | review_routes: kontrol terlihat ≥44px, keyboard/focus drawer/modal; bukan sertifikasi WCAG penuh. |
| NFR10 | Responsivitas mobile | VERIFIED | Semua route pada 320/390/756/1024/1440px dan landscape; demo 320–1440px. |
| NFR11 | Tidak ada reading duplikat | VERIFIED | UNIQUE(device_id,created_at), retry identik idempotent dan konflik payload ditolak. |
| NFR12 | Retensi minimal 6 bulan | PARTIAL | Reading lama dibaca lintas koneksi, backup SQLite konsisten dan quick_check lulus; durasi penyimpanan nyata belum diamati. |
| NFR13 | Dokumentasi API | VERIFIED | server/API.md mencakup 37 kombinasi metode/path, roles, payload, error, waktu, simulator dan ekspor. |
| NFR14 | Error log dapat ditinjau | VERIFIED | Forced report error menghasilkan referensi pada php-server.log; launcher menulis php.log tanpa credential. |
| NFR15 | Isolasi simulasi/lapangan | VERIFIED | Pemisahan logis software: provenance eksplisit end-to-end, hitungan lima sumber, raw terpisah pH/NTU, legacy tetap unknown, tes campuran lintas DTO/export/report. Bukan bukti lapangan. |

## 5. Temuan dan Status

| File/Section | Isu dan bukti | Kategori | Prioritas | Status |
|---|---|---|---|---|
| web/index.html | CDN defer memblokir startup | Bug fungsional | P1 | Diperbaiki |
| Auth.php | Normalisasi register/login tidak konsisten | Bug fungsional | P1 | Diperbaiki |
| simulator_device.py | Duration hilang memicu KeyError | Bug fungsional | P2 | Diperbaiki |
| RateLimiter.php | Bucket reset di pergantian menit membuat batas tidak stabil | Bug fungsional | P2 | Diperbaiki |
| app.js refreshDashboardData | Reading baru tidak memperbarui alert UI | Bug fungsional | P1 | Diperbaiki |
| ObservationRepository.php / app.js | Tanggal lokal dianggap masa depan oleh server UTC | Bug fungsional | P1 | Diperbaiki |
| app.js showModal | Rejection hapus observasi/revoke viewer tidak ditangani | Bug fungsional | P1 | Diperbaiki |
| ExportRepository.php | Literal feeder terinterpretasi sebagai kolom SQLite; ekspor kosong | Bug fungsional | P1 | Diperbaiki |
| experience.js demo | Parameter NTU, outcome dan replay belum lengkap | UI/UX | P2 | Diperbaiki |
| experience.js assets | Thumbnail referensi dipakai ulang | UI/UX | P2 | Diperbaiki |
| app.js CSV | Cakupan dan sumber ekspor ambigu | UI/UX | P2 | Diperbaiki |
| app.css | Kontras teks putih/coral 3,87:1; kini 6,95:1 | UI/UX | P2 | Diperbaiki |
| app.js / experience.js | Scroll reduced motion dan lifecycle animasi belum konsisten | UI/UX | P2 | Diperbaiki |
| Test runners | Suite terlewat dan decoding cp1252 Windows | Kualitas kode | P1 | Diperbaiki |
| test_audit_bugs.py | Import unittest melakukan sys.exit | Kualitas kode | P2 | Diperbaiki |
| experience.js | initSystemFlow/flowTweens dan hook yang tidak ada | Kualitas kode | P2 | Diperbaiki |
| server/test_*.php, minimal_test.php | Require Markdown mencemari JSON; hash bergantung panjang file | Kualitas kode | P2 | Diperbaiki |
| Tiga audit Python lama | Syntax error dan asumsi browser port tetap; diganti alias runner | Kualitas kode | P2 | Diperbaiki |
| router.php register | Batas nama/password belum memadai | Keamanan/validasi | P1 | Diperbaiki |
| router.php threshold | Angka nonfinite/overflow | Keamanan/validasi | P1 | Diperbaiki |
| DeviceAuth.php | Key global untuk semua perangkat | Keamanan/validasi | P1 | Diperbaiki |
| Http.php / router.php | CSP izin eksternal sisa, batas webroot dan tahun timestamp | Keamanan/validasi | P2 | Diperbaiki |
| Device lifecycle | Heartbeat eksplisit/claim/edit/key belum lengkap | Gap SKPL | P1 | Diperbaiki |
| Audit lifecycle | Auth, scheduler dan status ACK belum lengkap | Gap SKPL | P1 | Diperbaiki |
| Export | CSV/JSON lima jenis data dan filter server belum tersedia | Gap SKPL | P2 | Diperbaiki |
| Rules | Versi threshold aktual belum dipersist per reading | Gap SKPL | P2 | Diperbaiki |
| Operasional/docs | Seed, launcher, backup, API lengkap dan log review belum tersedia | Gap SKPL | P2 | Diperbaiki |
| Dokumen submission lama | Klaim lama tidak cocok evidence runtime | Kualitas kode | P2 | Diperbaiki |
| Contoh framework 05/06/07 | Mock stats, cookie contoh, API placeholder, source TS tanpa build config | Batasan dependency | P2 | Dibiarkan: arsip praktikum tidak diimpor runtime PHP/SPA; README menandai UNVERIFIED dan tidak aman sebagai auth produksi |
| Hardware/deployment | ESP32, kalibrasi, motor, TLS, uptime dan retensi durasi nyata tidak tersedia | Batasan dependency | P1 | PARTIAL: perangkat fisik, alat referensi, host TLS dan observasi durasi diperlukan |

Temuan yang gagal pada run awal tidak dihapus: timeout growth, ekspor feeding kosong, syntax audit lama, dan regresi sebelum perbaikan tetap merupakan evidence historis. Hanya hasil setelah perbaikan dipakai untuk rekap lulus.

## 6. Perubahan yang Dilakukan

- Backend: Auth, Http, Database, DeviceAuth, DeviceLifecycle, DeviceRepository, OperationsRepository, AlertRepository, ObservationRepository, RateLimiter, router. Penambahan ExportRepository dan RuleVersionRepository menyelesaikan ekspor dan persist konfigurasi.
- Operasional: seed_local.php, run_local.py, simulator_device.py, backup_local.py; seed aman, launcher/scheduler, tiga outcome simulator dan backup SQLite konsisten.
- UI: index.html, app.js, experience.js, app.css. Pemuatan lokal/lazy, state data dan alert, form perangkat/ekspor, UTC observasi, konfirmasi async tertangani, timeout request 20 detik, reduced motion, cleanup animasi serta kontras.
- Test: suite completion/lifecycle/operability/export/rule_versions/review_hardening; browser completion/lifecycle/PWA/export dan perbaikan growth/refresh/routes. Runner menyertakan suite kalender dan ekspor, membaca UTF-8, menangkap runtime exception/console.error/security error.
- Kualitas kode: dead animation dihapus; lima entry check rules PHP menggunakan kontrak aktual; tiga audit Python lama menjadi alias runner yang terisolasi.
- Dokumentasi: README, LOCAL_GUIDE, DESIGN, API, REVIEW_REPORT, CHECKPOINT, README test; rujukan status/RTM manajemen diperbarui. Dokumen submission lama diberi penanda arsip.

Backup selektif terdapat dalam `_backup-sebelum-revisi/`: baseline, lifecycle, audit, source-labels, export, observation-utc, rule-versions, review-hardening, legacy-audits dan final-docs. Tidak menyalin node_modules, build, screenshot atau database besar.

## 7. Hasil Pengujian

Perintah berikut benar-benar dijalankan dari root aplikasi kecuali dinyatakan lain.

| Perintah | Hasil akhir yang relevan |
|---|---|
| `python server/tests/run_verified_suite.py` | **88 pass, 0 fail/error/skip; 28 lint PHP pass**. Evidence backend-regression-20260915-102523/results.json |
| `python web/tests/verify_frontend_fixes.py` | **22 suite pass, 0 fail; 236 assertion JSON**. Service-worker standalone juga exit 0 dengan 7 assertion stdout, terpisah dari 236 |
| `python server/tests/review_inventory.py` | **68 syntax pass, 0 fail** setelah tiga skrip lama diperbaiki; 133 file diinventarisasi |
| `python web/tests/verify_static.py` | 20 check pass |
| `python web/tests/verify_api_integration.py` | 10 check pass |
| `python web/tests/verify_security.py` | 5 check pass |
| `python -m unittest discover -s web/tests -p 'test_*.py'` | 3 pass |
| `node --check web/assets/js/app.js`, `node --check web/assets/js/experience.js` | Exit 0 |
| `node web/tests/review_export.mjs filtered-export-final` | 6 assertion pass, actual JSON/CSV download, error dan mobile |
| `node web/tests/review_drawer_keyboard.mjs drawer-contrast-final` | 17 assertion pass sesudah revisi kontras |
| `python web/tests/full_audit.py --help` | Alias maintained dapat diparse dan menampilkan penggunaan |

Pytest tidak terpasang: `python -m pytest web/tests/test_static.py -q` gagal memuat modul pytest. Ketiga fungsi assertion kemudian benar-benar dijalankan tanpa dependency tambahan dan **3 pass**:

```powershell
python -c "import runpy,unittest; m=runpy.run_path('web/tests/test_static.py'); s=unittest.TestSuite(unittest.FunctionTestCase(v) for k,v in m.items() if k.startswith('test_')); r=unittest.TextTestRunner(verbosity=2).run(s); raise SystemExit(not r.wasSuccessful())"
```

Browser evidence penuh: `../05_Desain-Figma/review-hermes/frontend-fixes-regression-20260915-102113/summary.json`. Tidak ada runtime exceptions, console.error atau security error yang dicatat pada suite tersebut. HTTP error yang sengaja diuji bukan kegagalan tak tertangani. Setelahnya hanya warna CSS dan screenshot export diubah; drawer dan export diulang terarah. Backend feeding export diperbaiki dan seluruh backend diulang menjadi 88 pass.

Ukuran layar: 320×740, 390×844, 756×1024, 1024×768, 1440×1024 serta 844×390/720×512. Pemeriksaan mencakup keyboard/drawer/modal, 44px target, reduced motion, error/offline/empty, viewer dan state register. Kontras putih pada tombol bahaya/badge diperbaiki dari 3,87:1 ke 6,95:1; ini bukan audit WCAG menyeluruh. Screenshot mobile export dan route/demo telah diperiksa.

Jangan menjumlahkan rerun sebagai tes unik. Tidak dijalankan: instalasi PWA pada ponsel nyata, Safari/Firefox, screen reader manual, benchmark FPS/GPU, build framework akademik, hardware/TLS/endurance. Masing-masing memerlukan perangkat/toolchain/lingkungan yang belum tersedia.

## 8. Batasan dan Risiko

- ESP32/sensor/motor fisik, kalibrasi dan TLS deployment belum dibuktikan. Label non-simulasi tidak membuktikan kalibrasi.
- Queue dan ACK adalah kontrak simulator lokal. Scheduler hanya bekerja saat launcher hidup; jadwal terlewat ketika mati tidak di-replay. Jangan memakai ini sebagai kontrol keselamatan perangkat fisik.
- NFR02/NFR12 membutuhkan observasi durasi; smoke/backup bukan bukti uptime atau retensi enam bulan nyata.
- Simulasi ditandai pada reading dan export, tetapi tabel dapat memuat kedua sumber. Provenance alert lama berdasarkan label pesan dan dapat UNVERIFIED; untuk pilot gunakan database/ingestion terpisah dan provenance eksplisit.
- GSAP/Three versi existing, bukan audit vulnerability upstream. Three berhenti saat tab tersembunyi, stage keluar viewport, route berpindah atau reduced motion; tidak ada klaim FPS/performa GPU.
- PWA Chromium memenuhi pemeriksaan installability otomatis; instalasi dan perilaku platform mobile tetap perlu uji nyata.
- Contoh akademik mengandung kontrak data/auth placeholder dan kekurangan konfigurasi build. Tidak dipromosikan menjadi aplikasi aktif atau dipakai sebagai evidence keamanan.
- Framework PHP dev server dan rate limit SQLite merupakan lingkungan demonstrasi lokal. Load testing multi-user/production belum dilakukan.

## 9. Checkpoint

[CHECKPOINT.md](CHECKPOINT.md) mencatat titik stabil, bukti terakhir, state database dan langkah lanjut untuk batasan tersisa. Tidak ada migration/setengah edit yang sengaja ditinggalkan. Tes memakai runtime sementara dan semua proses test selesai; launcher tidak dibiarkan berjalan pada database pengguna.

## Hardware Integration — snapshot sesi sebelumnya (status hardware tidak berubah)

Ini checkpoint persiapan hardware/API, **bukan pernyataan seluruh permintaan lanjutan selesai**. Status aplikasi lokal pada bagian sebelumnya tetap baseline; bukti terbaru backend adalah **94 tes pass, 30 PHP lint pass**, tanpa failure/error/skip (`../05_Desain-Figma/review-hermes/backend-regression-20260915-154050/results.json`). Enam tes baru mencakup telemetry, replay/ACK/expiry/ownership, gate hardware, serta migrasi rollback/idempotence. Tidak ada tes browser baru pada kelanjutan ini.

Identifikasi berdasarkan uraian foto pengguna, bukan foto yang diperiksa langsung: ESP32 DOIT DevKit V1 ESP-WROOM-32 **30 pin/15 per sisi/Micro-USB**; turbidity Water Clarity Detector kit, kemiripan SEN0189 belum mengonfirmasi model; probe diduga DS18B20, kabel belum terverifikasi. Sensor pH tanah **bukan pH air terkalibrasi**, hasil pengukuran AO pH/turbidity **BELUM DIUKUR**. Relay `1Ch Relay 24V H/L` tidak sesuai adaptor 12V/GPIO langsung. Pengganti perlu 5V optoisolated dengan trigger 3.3V eksplisit dan verifikasi VCC/JD-VCC; SG90 perlu catu 5V regulated >=2A, ground bersama; adaptor 12V perlu buck; DHT11 bukan suhu air. Detail wiring dan power-on tanpa AC ada di `hardware/WIRING.md`.

| Tahap | Hasil aktual |
|---|---|
| Source/documentation prepared | Firmware `.ino`, config.example.h, README, wiring, API, Caddy template prepared; firmware PARTIAL |
| Compiled | UNVERIFIED — Arduino CLI tidak ditemukan di PATH |
| Flashed | UNVERIFIED — serial port tidak terdeteksi; tidak upload |
| Network connected | UNVERIFIED — belum ESP32 fisik |
| Telemetry received | Fixture API verified; ESP32 fisik UNVERIFIED |
| Command delivered / ACK | Fixture API verified, replay/idempotence/timeout diuji; ESP32 fisik UNVERIFIED |
| Physical actuation observed | UNVERIFIED — servo/relay/pompa belum diamati |
| Calibration completed | UNVERIFIED — ADC/mapping bukan NTU; soil pH bukan pH air |
| TLS | Caddyfile/panduan prepared, Caddy belum tersedia/dijalankan; NFR05 UNVERIFIED |

API menambahkan raw telemetry dengan provenance/session, key per-device, timestamp/deduplikasi/null-sensor/voltage validation; polling/ACK device hanya mengakses channel hardware miliknya; queue manual admin+CSRF default disabled. Scheduler/tombol kontrol lama tetap simulasi. Firmware default tidak mengaktifkan sensor/aktuator; NVS recovery, expiry, safe output, retry, timeout/watchdog dan root CA dibuat sebagai source yang belum dikompilasi. ACK bukan bukti gerakan fisik.

Backup SQLite konsisten dibuat **sebelum migration** di `_backup-sebelum-revisi/20260915-hardware-api/aquasmart-before.sqlite`. Migrasi diuji pada salinan sementara: seluruh nilai 12 tabel lama utuh dan quick_check OK (`hardware/legacy-migration-check.json`); database aktif belum diubah. Legacy diberi legacy_unverified tanpa menebak asal. **NFR15 tetap PARTIAL**: propagasi provenance ke seluruh DTO/recommendation/report/seed_local/UI belum selesai. Raw telemetry belum masuk report pH/NTU, sehingga tidak ada angka placeholder yang disamarkan sebagai air terkalibrasi. Daftar pekerjaan tepat untuk melanjutkan ada di CHECKPOINT terbaru.

Perintah aktual: backup_local.py; Get-Command untuk toolchain; Get-CimInstance Win32_SerialPort; runner backend; pemeriksaan migrasi salinan dengan PHP Database::connection + SQLite perbandingan seluruh kolom original. Perintah compile/upload/Caddy/LAN/firewall pada panduan **belum dijalankan**. Tidak ada Git init/add/commit, perubahan trust OS atau uji AC.

## Penyelesaian software lokal — 15 September 2026 malam

Scope sesi ini hanya software/website. Tidak ada perubahan dalam firmware/, tidak flash atau mengasumsikan ESP32 terhubung. Status FR01 PARTIAL serta FR07–09 SIMULATION ONLY tetap dipertahankan.

**Provenance:** reading/latest-reading/alert/audit/command/log/observasi membawa field asal dan sesi. Parsing provenance dari pesan dihapus. Reading sebelumnya untuk deduplikasi alert dibandingkan pada provenance yang sama, sehingga seed/legacy tidak menekan alert sumber baru. Recommendation UI membawa badge reading terakhir. Audit pengakuan alert manual menyimpan origin_provenance; event lifecycle command mempertahankan sumber record asal. Semua fixture seed_local diberi seed. Legacy tetap legacy_unverified tanpa rekonstruksi asal.

Export JSON/CSV mencakup enam jenis, termasuk telemetry mentah. JSON meta.source_counts berisi simulation/device/manual/seed/legacy_unverified; report total serta setiap hari membawa lima hitungan; CSV membawa provenance/session dan source_* (total ekspor pada row biasa, count sampel per hari pada aggregate). X-Provenance-Counts juga tersedia pada keluaran CSV kosong. Flag simulation kompatibilitas tidak digunakan untuk menebak provenance. Dataset campuran tetap terlihat; angka aggregate bukan klaim semua sampel berasal dari lapangan.

UI menampilkan badge lima sumber, hitungan, panel raw ADC/mV/null/sesi/status dan ekspor diagnostik. pH tanah tetap diberi peringatan bukan pH air, mapping turbidity bukan NTU. CSS mengikuti DESIGN.md; tidak ada efek/dependency berat baru. Screenshot mobile ditinjau dan wrapping tabel diperbaiki.

**Database aktif:** `python -X utf8 server/migrate_active.py` dijalankan setelah tes. Runner memverifikasi tidak ada proses PHP; backup konsisten sebelum perubahan di `_backup-sebelum-revisi/20260915-202837-active-migration/before.sqlite`. Migration memakai `Database::connection(false)` tanpa bootstrap. Seluruh nilai dan jumlah baris 12 tabel lama cocok; quick_check OK; 36 reading dan 3 alert tetap legacy_unverified. Tidak ada seed ulang/reset credential/restore yang diperlukan. Laporan rinci `result.json` pada folder backup. Pengaman bootstrap juga mencegah populasi ulang otomatis pada DB yang sudah memiliki pengguna.

**TLS:** Caddy resmi 2.11.4, archive cocok checksum SHA-512 rilis, executable di C:\Users\User\.aquasmart\caddy-2.11.4. Launcher `server/run_tls_local.py --host 192.168.0.103` menjalankan PHP loopback8080 dan Caddy8443 terhadap DB aktif. TLS1.3 dan HTTP200 terverifikasi, SAN IP sesuai; CA salah menghasilkan CERTIFICATE_VERIFY_FAILED dan hostname salah TLS/SNI rejection. Tidak ada insecure fallback. Local CA root dipasang pada CurrentUser\Root Windows (thumbprint 87AF00B8F06BEC9BF422510B8EF2841D1F838124), Edge memuat HTTPS tanpa ignore-certificate flags. CA/private keys runtime di direktori pengguna, di luar web/source publik.

**PWA/cross-browser:** Edge desktop HTTPS LAN lulus secure context, manifest, SW controller, installability (0 error). In-app browser menampilkan home/login HTTPS tanpa interstitial. Ini bukan bukti pemasangan aplikasi pada HP; viewport mobile hanya emulasi. Android/iOS dan Safari tidak tersedia. Firefox tidak ditemukan pada executable/PATH standar maupun connector. Tidak ada bug platform yang diinventarisasi tanpa pengujian. FR23 tetap PARTIAL, bukan dinyatakan install gagal.

**Kendala LAN:** Wi-Fi 2 berprofil Public. Upaya rule inbound terbatas IP192.168.0.103/TCP8443/LocalSubnet/interface Wi-Fi 2 ditolak Windows **Access is denied**. Rule tidak terpasang; firewall/profil global tidak diubah. Akses HP perlu rule dari Administrator pada LAN terpercaya serta trust CA pada HP. Langkah tepat ada di LOCAL_GUIDE.md. Keberhasilan mengakses IP LAN dari komputer sendiri tidak membuktikan jangkauan perangkat lain.

### Evidence ulang

| Pemeriksaan | Hasil / artefak |
|---|---|
| Backend | 96 pass, 0 fail/error/skip; 30 PHP lint. `backend-regression-20260915-203430/results.json` |
| Browser penuh | 23 suite pass; 246 assertion JSON + 7 SW stdout. `frontend-fixes-regression-20260915-202608/summary.json` |
| Diagnostic CSS final | 10 pass, screenshot ditinjau. `software-provenance-final/results.json` |
| TLS positif/negatif | Lulus. `local-tls-software/tls.json` |
| Edge HTTPS LAN/PWA | 4 pass. `local-tls-software/browser/results.json` |
| Trust/inventory | `local-tls-software/trust-and-browsers.json` |

Artefak tes pada `../05_Desain-Figma/review-hermes/`; migrasi pada folder backup yang disebut di atas. Rerun gagal awal tetap disimpan; tidak dijumlahkan sebagai tes unik. Caddy/PHP sengaja berjalan untuk akses lokal, bukan proses test terlantar. Tidak ada Git init/add/commit.

## 10. Status Akhir

Sisi provenance software, UI diagnostik, ekspor, migrasi aktif, dan TLS lokal selesai dengan bukti di atas. URL saat akhir sesi: https://192.168.0.103:8443/#/login . Akun lama dipertahankan. Launcher bukan service/autostart; panduan restart/stop ada di LOCAL_GUIDE.

Perubahan requirement: **NFR15 PARTIAL → VERIFIED** pada pemisahan logis/provenance software; **NFR05 UNVERIFIED → PARTIAL** karena local CA teruji. **FR23 tetap PARTIAL** karena install HP/Safari/Firefox belum diuji. **FR01 dan FR07–09 tidak berubah**; tidak ada klaim sensor/aktuator fisik.

Matriks: **30 VERIFIED, 4 PARTIAL (FR01, FR23, NFR05, NFR12), 3 SIMULATION ONLY (FR07–09), 2 UNVERIFIED (NFR02, NFR03)**. Perlu perangkat/platform nyata dan hak admin untuk menyelesaikan verifikasi HP/LAN. Uptime, retensi durasi nyata, kalibrasi serta hardware tetap di luar bukti sesi software ini. Detail state dan langkah berikutnya: CHECKPOINT.md.
