# Ceklist kesesuaian kontrak dan SKPL

Pemetaan setiap deliverable kontrak MP-TI/ASAIOT/2026 (D-01 sampai D-05) dan setiap
kebutuhan SKPL (FR1 sampai FR24, NFR1 sampai NFR15) ke status dan bukti di kode.

Tanggal penilaian: 21 September 2026. Commit yang dinilai: `5c3ba6e`.

## Cara membaca

Empat status yang dipakai:

| Status | Artinya |
| --- | --- |
| Terpenuhi | Ada implementasinya dan ada bukti yang bisa ditunjuk. |
| Terpenuhi sebagian | Ada, tetapi dengan batasan penting yang disebut di kolom batasan. |
| Tidak terpenuhi | Tidak ada implementasinya. |
| Tidak dapat diverifikasi | Perlu perangkat fisik atau jendela pengamatan yang tidak tersedia di repositori ini. |

Aturan yang dipakai saat menilai:

1. Klaim tanpa rujukan berkas dan baris tidak boleh berstatus terpenuhi.
2. Kontrol aktuator berstatus simulasi. Perintah dicatat server dan dijawab
   simulator. Tidak ada bukti relay, servo, atau motor bergerak.
3. Tidak ada bukti ESP32 fisik. Firmware belum pernah dikompilasi, dan seluruh
   pengujian jalur perangkat memakai fixture HTTP.
4. Aplikasi SPA lama di `web/` dan frontend Next.js di `frontend/` dinilai
   terpisah. Kebutuhan yang hanya dipenuhi salah satunya ditulis apa adanya.

Yang benar-benar dijalankan pada 21 September 2026: gerbang verifikasi backend
`python server/tests/run_verified_suite.py` dengan hasil `"passed": true`,
`tests_run` 104 dari `planned_tests` 104, `failures` 0, `errors` 0, `skipped` 0,
`php_files_checked` 37, dan `local_api_full_response_max_ms` 25,68 dari 10 sampel.
Penelusuran bukti per kebutuhan dilakukan dengan membaca berkas, bukan menjalankan
suite per kebutuhan.

Gerbang CI GitHub Actions juga hijau pada commit yang dinilai; tangkapan layarnya
ada di `docs/gambar/ci-quality-gate-daftar.png` (daftar lima jalannya) dan
`docs/gambar/ci-quality-gate-run.png` (rincian langkah lint, tipe, test, build).
Pemindaian SonarQube Cloud belum pernah dijalankan, jadi tidak ada status Quality
Gate SonarQube yang bisa diklaim.

## Ringkasan

| Kelompok | Jumlah | Terpenuhi | Terpenuhi sebagian | Tidak dapat diverifikasi |
| --- | --- | --- | --- | --- |
| Deliverable kontrak D-01 sampai D-05 | 5 | 0 | 4 | 1 |
| Kebutuhan fungsional FR1 sampai FR24 | 24 | 6 | 18 | 0 |
| Kebutuhan non-fungsional NFR1 sampai NFR15 | 15 | 2 | 11 | 2 |
| **Total** | **44** | **8** | **33** | **3** |

Tidak ada satu pun kebutuhan berstatus tidak terpenuhi. Sebagian besar berstatus
terpenuhi sebagian, dan itu bukan basa-basi: setiap batasannya disebut di bawah.

## Deliverable kontrak

| ID | Deliverable | Status | Bukti | Batasan |
| --- | --- | --- | --- | --- |
| D-01 | Telemetri kualitas air | Terpenuhi sebagian | Tabel `sensor_readings` dengan kolom ph, temperature, turbidity, device_id, created_at, simulation, `CHECK (ph >= 0 AND ph <= 14)`, `CHECK (turbidity >= 0)`, `UNIQUE (device_id, created_at)` di `server/src/Database.php:88-100`. Validasi rentang di `server/router.php:302-347`. Penandaan sumber lewat `server/src/Provenance.php`. | Tidak ada satu pun reading yang terbukti berasal dari ESP32 fisik. Isi tabel berasal dari seed dan simulator. Firmware yang ada mengirim ke `/telemetry`, bukan `/readings`. |
| D-02 | Web/PWA dan backend lokal | Terpenuhi sebagian | Role dan ownership ditegakkan di query, bukan hanya router: `server/src/Auth.php:185-203`, `server/src/DeviceRepository.php:70-74`. CSRF pada seluruh mutasi, misalnya `server/router.php:261, 275, 286, 369, 399, 407`. Gerbang verifikasi 104 test lulus pada 21 September 2026. UI responsif di `frontend/app/dashboard/layout.tsx:18-50`. | **Stack basis data berbeda dari kontrak.** Kontrak menyebut MySQL/MariaDB, kode memakai SQLite (`server/src/Database.php:20-26`). Diajukan lewat [CR-001](CR-001_Basis_Data_SQLite.md), belum diputus sponsor. PWA hanya ada di SPA lama, tidak di frontend Next.js yang di-deploy. |
| D-03 | Kontrol aerator dan feeder | Terpenuhi sebagian | Perintah terotorisasi: `Auth::requireAdmin` dan `Auth::requireCsrf` di `server/router.php:405-407`, ownership di `server/src/DeviceRepository.php:70-74`. Status pending, delivered, succeeded, failed, timeout di `server/src/OperationsRepository.php`. Fail-safe berupa indeks unik parsial satu perintah aktif per aktuator (`OperationsRepository.php:17, 116`). Diuji di `server/tests/test_operations.py` dan `test_command_http.py`. | **Seluruh jalur ini simulasi.** Status Berhasil berarti simulator membalas, bukan bukti alat bergerak. Kanal hardware terpisah menjawab 503 kecuali `AQUASMART_HARDWARE_ENABLED=1`, dan kelima jalurnya diuji memakai fixture HTTP. |
| D-04 | Prototipe hardware-edge | Tidak dapat diverifikasi | Yang ada hanya dokumen dan source: `firmware/esp32/aquasmart_esp32/aquasmart_esp32.ino` (286 baris), `firmware/esp32/README.md`, `hardware/WIRING.md`, `hardware/environment-check.json`. | Dari empat bukti yang disyaratkan, hanya wiring yang tersedia, itu pun sebagai rancangan. `WIRING.md` menulis sendiri "Hasil saat ini: BELUM DIUKUR" untuk pengukuran pH. `firmware/esp32/README.md` menulis "Belum compile, belum upload, belum tersambung WiFi, belum telemetry/ACK/aktuasi fisik". `hardware/environment-check.json` mencatat arduino-cli tidak tersedia dan daftar port serial kosong. Bagian acceptance "tidak ada klaim produksi" justru terpenuhi dengan baik. |
| D-05 | Dokumentasi dan bukti uji | Terpenuhi sebagian | SKPL, kontrak, WBS, risk register, source code, panduan, dan handover semuanya ada dan dapat ditunjuk. Bukti uji ditulis runner ke folder ber-timestamp (`server/tests/run_verified_suite.py:18-19, 50-55`). | Empat ganjalan: baseline rencana masih menulis MySQL sehingga belum konsisten dengan kode; analisis CPM/PERT tidak tersaji di paket manajemen proyek, hanya definisi tabelnya di skrip generator; SKPL masih menyebut `growth_observations` sebagai target desain padahal tabelnya sudah dibuat; dan tidak ditemukan bukti peninjauan maupun tanda tangan sponsor. |

## Kebutuhan fungsional

| ID | Kebutuhan | Status | Bukti | Batasan |
| --- | --- | --- | --- | --- |
| FR1 | Menerima data sensor via HTTPS POST dari ESP32 | Terpenuhi sebagian | `server/router.php:303-348`, kunci perangkat lewat `DeviceAuth::requireKey`, validasi rentang di `:315-317`. Test `server/tests/api_integration.py:618, 639, 648`. | Firmware tidak pernah memanggil `/readings`; yang dipanggil `/telemetry` (`aquasmart_esp32.ino:270`). HTTPS hanya tersedia lewat `server/run_tls_local.py`; entry point resmi melayani HTTP loopback. Tidak ada ESP32 fisik. |
| FR2 | Menyimpan reading dengan timestamp dan device_id | Terpenuhi sebagian | `server/src/DeviceRepository.php:144-158`, normalisasi UTC di `router.php:327-332`, test `api_integration.py:446`. | Jalur perangkat fisik tidak masuk tabel ini; telemetry ditangani repositori lain dan tidak mengisi `sensor_readings`. |
| FR3 | Menampilkan deret waktu terbaru di dashboard | Terpenuhi sebagian | `server/router.php:350-358`. SPA lama punya grafik kanvas (`web/assets/js/app.js:698, 1324-1329`). Next.js menampilkan tabel 18 baris (`frontend/app/dashboard/page.tsx:31-34`, `components/dashboard/readings-table.tsx`). | Grafik hanya ada di SPA lama. Frontend Next.js yang di-deploy menampilkan tabel, bukan grafik. |
| FR4 | Membandingkan nilai terkini dengan threshold | Terpenuhi sebagian | `server/src/DeviceRepository.php:169-191`, ambang per workspace, test `server/tests/test_monitoring.py:50` dan `test_threshold_contract.py`. | Yang dibandingkan adalah baris `threshold_settings` milik pemilik perangkat, bukan konstanta `ThresholdRules`; konstanta itu hanya mengisi nilai awal saat registrasi. |
| FR5 | Menampilkan notifikasi in-app saat threshold terlampaui | Terpenuhi sebagian | `server/router.php:429-436`, badge di `frontend/components/app-shell/nav-links.tsx:54-61`, halaman `frontend/app/dashboard/alerts/page.tsx`. | Notifikasi berbasis polling 30 detik, bukan push. Alert hanya lahir dari jalur `/readings`; perangkat yang memakai firmware repo ini mengirim ke `/telemetry` yang tidak memicu alert pH air. Latensi 60 detik yang disebut analisis belum diukur. |
| FR6 | Menyimpan log notifikasi | Terpenuhi sebagian | Tabel `alerts` di `server/src/Database.php:142-152`, penulisan di `DeviceRepository.php:186-188`, pembacaan `AlertRepository.php:6-32`. | Yang tercatat hanya alert pelanggaran ambang saat ingestion, bukan seluruh notifikasi yang pernah tampil di layar. |
| FR7 | Menjalankan jadwal pakan otomatis berbasis waktu | Terpenuhi sebagian | `server/src/OperationsRepository.php:86-99` mencocokkan jam pada zona Asia/Jakarta, hanya untuk jadwal aktif pada perangkat mode otomatis, dengan request id unik per hari. Test `server/tests/test_operations.py:90`. | **Scheduler tidak berjalan di deployment.** Pembungkusnya `server/operations_tick.php:5-8` menolak jalan kecuali CLI, basis data sementara eksplisit, `AQUASMART_APP_ENV` bernilai test atau development, dan simulator dinyalakan. Build yang di-deploy memakai `AQUASMART_APP_ENV=production`. |
| FR8 | Mencatat eksekusi pakan termasuk timeout dan gagal | Terpenuhi sebagian | `server/router.php:228-233`, `OperationsRepository::feedingLogs` di `:80-84`, timeout otomatis di `:19-37`. | Tidak ada tabel `feeding_logs`; log diturunkan dari `actuator_commands`. Seluruh status terminal berasal dari ACK simulator, bukan eksekusi pakan fisik. |
| FR9 | Mengirim perintah manual ke feeder dan aerator via API | Terpenuhi sebagian | `server/router.php:405-421`, `DeviceRepository::control` di `:52-99`, antrean di `OperationsRepository::enqueue`. | Simulasi. `enqueue` dipanggil tanpa argumen sehingga `$simulation` bernilai true. Kanal hardware terpisah mati secara default. |
| FR10 | Menghitung rekomendasi dasar berbasis aturan | Terpenuhi | `server/src/DeviceRepository.php:177-190` menyusun tabel aturan dari ambang workspace lalu menulis kalimat saran ke pesan alert. Test `server/tests/test_monitoring.py:50`. | Yang dihitung adalah aturan mana yang terlanggar; kalimat sarannya template tetap per parameter. Panel "Panduan Tindakan" di SPA lama adalah teks statis dan tidak dihitung sebagai rekomendasi sistem. |
| FR11 | Menyimpan observasi pertumbuhan | Terpenuhi | `server/src/ObservationRepository.php:6-45` (tabel, validasi tanggal UTC, larangan tanggal masa depan, audit), endpoint `server/router.php:163-177`, UI di `frontend/app/dashboard/reports/page.tsx`. | Data entri manusia, ditandai provenance manual, dan dinyatakan begitu di layar. |
| FR12 | Menampilkan riwayat kontrol aktuator | Terpenuhi sebagian | `server/router.php:228-233`, UI `frontend/app/dashboard/control/page.tsx:137-154` dan `components/control/command-table.tsx`. | Di deployment produksi, satu-satunya transport yang memindahkan status keluar dari pending terkunci ke environment development atau test, sehingga riwayat di sana akan berhenti pada Antre dan Tanpa balasan. Isi riwayat adalah hasil simulator. |
| FR13 | Autentikasi pengguna | Terpenuhi | `server/router.php:116-149`, `Auth::login` dengan `password_verify`, `session_regenerate_id(true)` di `Auth.php:161`, test `api_integration.py:403-412`. | Middleware Next.js hanya memeriksa keberadaan cookie; keabsahan sesi tetap diputuskan PHP. |
| FR14 | Membedakan role admin dan viewer | Terpenuhi | `Auth::requireAdmin` menolak viewer dengan 403 (`server/src/Auth.php:199-206`), dipasang pada seluruh endpoint mutasi, test `server/tests/test_workspace.py:48-56`. | UI menyembunyikan tombol untuk viewer, tetapi gerbang sebenarnya ada di server. |
| FR15 | Menampilkan konfigurasi threshold | Terpenuhi sebagian | `server/router.php:448-451`, test `api_integration.py:572-578`, UI `frontend/app/dashboard/settings/page.tsx:60-88`. | SPA lama menyimpan angka ambang secara hardcoded di `web/assets/js/app.js:61`, menduplikasi konstanta server. Frontend Next.js tidak menduplikasi angka itu. |
| FR16 | Mengizinkan update threshold oleh admin | Terpenuhi sebagian | `server/router.php:453-471` dengan validasi rentang, test `api_integration.py:579-595`. | Jalur SPA lama menyimpan sebagian nilai ke state lokal setelah PATCH, sehingga tampilannya bisa berbeda dari server sampai muat ulang. Jalur Next.js memakai respons server. |
| FR17 | Mendeteksi device online dan offline | Terpenuhi sebagian | `server/router.php:294-301`, `DeviceLifecycle.php:57-75`, kebasian 120 detik di `server/config/product.php:6`. | Firmware tidak pernah memanggil endpoint heartbeat. Seluruh pengujian memakai fixture HTTP. Status online berarti kesegaran HTTP, bukan verifikasi perangkat. |
| FR18 | Menampilkan daftar device dan statusnya | Terpenuhi | `server/router.php:254-257`, `DeviceRepository::allForUser`, UI di `frontend/app/dashboard/settings/page.tsx:137-143` dan `components/settings/device-card.tsx`. | Nilai online mewarisi batasan FR17. Kolom sinyal pada SPA lama diisi "Belum diukur" karena memang tidak diukur. |
| FR19 | Menyimpan versi model atau rules (stretch) | Terpenuhi sebagian | `server/router.php:485-490`, `RuleVersionRepository.php:7-32` menyimpan snapshot ambang dengan id SHA-256. | Nama artefaknya `rule_versions`, bukan `model_versions` seperti tertulis di SKPL, dan isinya snapshot ambang, bukan versi model machine learning. Data lama tidak direkonstruksi. |
| FR20 | Menghasilkan laporan harian dan bulanan (stretch) | Terpenuhi | `server/router.php:510-535`, `ReportsRepository.php:7-82` dengan agregasi per hari UTC dan pemisahan sampel simulasi. | Bucket agregasi selalu harian; bulanan berarti rentang sebulan berisi bucket harian. Zona laporan UTC, berbeda dari jadwal pakan yang memakai WIB. |
| FR21 | Ekspor data CSV dan JSON (stretch) | Terpenuhi sebagian | `server/router.php:492-508`, `ExportRepository.php:7-90`, header `X-Export-Rows` dan `X-Provenance-Counts`, batas 10.000 baris. | SPA lama memakai jalur ekspor sendiri di sisi klien, bukan endpoint ini. Setiap ekspor membawa `hardware_verified=false`. |
| FR22 | Menampilkan mockup UI login, dashboard, pengaturan | Terpenuhi sebagian | Ketiga layar ada sebagai UI terimplementasi di kedua aplikasi, misalnya `frontend/app/login/page.tsx`, `app/dashboard/page.tsx`, `app/dashboard/settings/page.tsx`. | Berkas mockup statis di `mockups/` hanya memuat lima halaman lain dan tidak mencakup login maupun pengaturan. Tangkapan layar lama di folder audit bertanggal sebelum halaman Next.js ini ada, jadi tidak dapat dipakai sebagai buktinya. |
| FR23 | PWA installable | Terpenuhi sebagian | SPA lama punya `web/manifest.webmanifest` (display standalone, ikon 192 dan 512 maskable) dan `web/sw.js` (cache `aquasmart-v5`). | Frontend Next.js yang di-deploy **tidak** punya manifest maupun service worker; pencarian di seluruh pohon `frontend/` tidak menemukan keduanya. Jadi aplikasi yang dinilai penilai lewat tautan deployment tidak installable. |
| FR24 | Menyimpan audit log who-what-when | Terpenuhi sebagian | Tabel `audit_logs` di `server/src/Database.php:115-126`, penulisan `AuditRepository::record`, endpoint `server/router.php:423-427`, call site tersebar di sembilan repositori. | What dan when kuat, **who tidak ditampilkan**: `AuditRepository::recent` tidak menyertakan kolom `user_id`, sehingga identitas pelaku tidak pernah keluar dari API dan tidak ada kolom pelaku di UI. |

## Kebutuhan non-fungsional

| ID | Kebutuhan | Status | Bukti | Batasan |
| --- | --- | --- | --- | --- |
| NFR1 | Latensi API, TTFB di bawah 2 detik lokal | Terpenuhi sebagian | `server/tests/test_operability.py:16-26` mengukur 10 iterasi `GET /api/devices` dan menegaskan maksimum di bawah 2 detik. Pengukuran 21 September 2026: `local_api_full_response_max_ms` 25,68. | Yang diukur waktu respons penuh, bukan TTFB, dan hanya satu endpoint. Bukti terbatas pada mesin pengembangan. |
| NFR2 | Uptime lokal minimal 90 persen | Tidak dapat diverifikasi | Tidak ditemukan artefak pengukuran uptime; yang ada hanya `GET /api/health`. | Angka 90 persen belum pernah diukur. Butuh jendela pengamatan yang tidak tersedia di repositori. |
| NFR3 | Akurasi sensor pH plus minus 0,2 dan suhu plus minus 0,5 derajat | Tidak dapat diverifikasi | Tidak ada data kalibrasi. Kode justru menolak klaim terkalibrasi: `TelemetryRepository.php:31` memaksa `calibrated=false` dan `ph_sensor='soil_placeholder'`. | Firmware belum dikompilasi, tidak ada perangkat fisik, dan sensor pH yang ada adalah placeholder sensor tanah, bukan pH air. |
| NFR4 | Password diproses dengan password_hash dan password_verify | Terpenuhi | `server/src/Auth.php:61-62` memakai Argon2id bila tersedia, verifikasi di `:40`, hash tidak pernah keluar ke respons (`:47`). | Jatuh ke bcrypt bila build PHP tidak mendefinisikan Argon2id. Jalur seed data uji memakai default. |
| NFR5 | HTTPS/TLS minimal 1.2 | Terpenuhi sebagian | Jalur TLS lokal `server/run_tls_local.py:26-32`, pemeriksa `server/tests/check_local_tls.py`, artefak hasil mencatat TLSv1.3. | Sertifikat dari CA lokal Caddy, bukan CA publik. Pemeriksanya tidak terdaftar di gerbang verifikasi dan tidak menegaskan versi minimum. Deployment Railway memakai TLS penyedia, bukan konfigurasi ini. |
| NFR6 | Validasi input pada semua endpoint | Terpenuhi sebagian | Lapisan umum `server/src/Http.php:44-63` (tolak non-JSON 415, batas 64 KiB, kedalaman 32, tolak nilai bersarang) dan validasi per endpoint di 35 titik `validation_error`. | Kata "semua endpoint" tidak terbukti; tidak ada test yang mengenumerasi 38 rute. |
| NFR7 | Rate limiting sederhana | Terpenuhi sebagian | `server/src/RateLimiter.php:5-16` dengan bucket per alamat IP dan rute, dipasang di login, register, ingestion, command, telemetry, heartbeat. | Di belakang BFF Next.js, seluruh permintaan browser tiba dari IP server Vercel, sehingga batas login dan register berlaku bersama untuk semua pengguna. Tercatat di `frontend/README.md`. |
| NFR8 | Mitigasi dasar OWASP API Top 10 | Terpenuhi sebagian | Seluruh akses basis data memakai prepared statement; satu-satunya interpolasi SQL memakai daftar literal keras. Auth, CSRF, dan pembatasan field respons ada. | Ini mitigasi yang terlihat di kode, bukan sertifikasi. Tidak ada laporan pentest, tidak ada hasil SAST, dan pemetaan item per item OWASP tidak ada. |
| NFR9 | Target sentuh minimum WCAG 2.2 untuk tombol | Terpenuhi sebagian | SPA lama menetapkan 44px di `web/assets/css/app.css:100-248`. Frontend Next.js memakai `min-h-11` lewat varian `button()` dan diukur nol target di bawah 44px pada 360, 768, dan 1280 piksel (`frontend/DESIGN_SYSTEM.md` bagian 7). | Ambang WCAG 2.2 SC 2.5.8 sebenarnya 24 piksel; 44 piksel adalah aturan internal yang lebih ketat. Tidak ada audit aksesibilitas otomatis seperti axe di kedua aplikasi. |
| NFR10 | Responsivitas mobile-first | Terpenuhi sebagian | SPA lama punya breakpoint dan uji viewport otomatis. Frontend Next.js diukur tanpa overflow horizontal pada tiga lebar (`frontend/DESIGN_SYSTEM.md` bagian 7). | Uji viewport otomatis yang tersimpan di repositori menguji SPA lama. Pengukuran frontend Next.js dilakukan manual pada sesi ini dan belum menjadi test yang berjalan otomatis. |
| NFR11 | Tidak ada duplikat reading per device dan timestamp | Terpenuhi | `UNIQUE (device_id, created_at)` di `server/src/Database.php:97`, ditambah pemeriksaan aplikasi di `DeviceRepository.php:132-139` yang membedakan idempoten dan konflik 409. | Dijaga di dua lapis dan ada test untuk ketiga kondisinya. |
| NFR12 | Retensi data minimal enam bulan | Terpenuhi sebagian | Kebijakan tertulis di `server/API.md:86`, mekanisme salinan `server/backup_local.py`, test `test_operability.py:28-42` membuktikan reading bertanggal lama bertahan melewati koneksi baru dan salinan. | Enam bulan belum pernah diamati. Tidak ada mekanisme retensi yang dipaksakan di kode; ini kebijakan, bukan fitur. |
| NFR13 | Dokumentasi API tersedia | Terpenuhi sebagian | `server/API.md` (122 baris), `server/REPORTS_API.md`, `server/ThresholdRules.md`, dan `frontend/README.md`. | Tidak ada spesifikasi machine-readable seperti OpenAPI, dan tidak ada pemeriksa otomatis yang menjaga dokumen tetap sinkron dengan router. |
| NFR14 | Log error terkumpul dan dapat ditinjau | Terpenuhi sebagian | `server/router.php:47-50` menulis id rujukan acak ke log dan mengembalikan id itu ke klien tanpa detail internal. Diuji di `server/tests/test_reports.py:33-38`, termasuk memastikan password seed tidak muncul di log. | Log berbasis berkas pada instalasi lokal, tanpa rotasi, agregasi, maupun alerting. Di deployment kontainer, log berumur sependek kontainernya. |
| NFR15 | Modul simulasi terpisah dari data lapangan | Terpenuhi sebagian | `server/src/Provenance.php` mendefinisikan lima sumber dan menambahkan kolom provenance ke lima tabel, dengan CHECK constraint pada tabel telemetry. | Pemisahan ini logis di perangkat lunak dan belum pernah diuji terhadap data lapangan, karena tidak ada data lapangan di repositori ini. |

## Celah yang paling perlu dibaca penilai

1. **D-04 tidak dapat diverifikasi.** Tidak ada bukti perangkat fisik. Yang ada
   adalah rancangan wiring, source firmware yang belum dikompilasi, dan catatan
   lingkungan yang menyatakan toolchain tidak tersedia.
2. **D-02 berbeda stack basis data dari kontrak.** Diajukan lewat CR-001 dan
   menunggu keputusan sponsor, bukan didiamkan.
3. **FR23 PWA hanya ada di SPA lama.** Aplikasi yang dibuka lewat tautan
   deployment adalah frontend Next.js, yang belum installable.
4. **FR7 scheduler tidak berjalan di deployment.** Jadwal tersimpan dan logikanya
   diuji, tetapi pemicunya menolak jalan di environment produksi.
5. **FR9, FR12, dan D-03 berstatus simulasi.** Status Berhasil berarti simulator
   membalas perintah.
6. **FR24 tidak menampilkan pelaku.** Audit log menyimpan `user_id`, tetapi
   endpoint pembacaannya tidak mengembalikannya.
7. **NFR2 dan NFR3 belum pernah diukur.** Uptime dan akurasi sensor tidak punya
   artefak pengukuran apa pun di repositori ini.
