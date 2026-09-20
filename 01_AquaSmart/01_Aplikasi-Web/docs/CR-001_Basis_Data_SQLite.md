# Change Request CR-001: Basis data deployment v1 memakai SQLite

| Field | Isi |
| --- | --- |
| Nomor | CR-001 |
| Proyek | AquaSmart AIoT, kontrak MP-TI/ASAIOT/2026 |
| Tanggal pengajuan | 21 September 2026 |
| Pengaju | Project Manager |
| Kategori perubahan | Major (menyentuh baseline scope teknologi) |
| Prioritas | Tinggi, menghalangi penutupan D-02 |
| Deliverable terdampak | D-02 Web/PWA dan backend lokal; WBS 1.4 Backend & database |
| Status | **Diajukan ke Project Sponsor, menunggu keputusan** |
| Keputusan sponsor | Menunggu persetujuan |
| Tanggal keputusan | Menunggu persetujuan |

Dokumen ini mengikuti mekanisme pengendalian perubahan pada kontrak Bagian 3.1:
"Perubahan baseline melalui Change Request dan analisis dampak", dan
"Perubahan hanya dikerjakan setelah keputusan Approve/Reject/Defer tercatat".
Kolom persetujuan sengaja ditulis menunggu, agar dokumen ini tidak memalsukan
otorisasi maupun tanggal tanda tangan.

## 1. Perubahan yang diminta

Baseline menyebut basis data MySQL/MariaDB di dua tempat:

- Kontrak, tabel deliverable, **D-02**: "PHP Native, MySQL/MariaDB, autentikasi,
  dashboard, threshold, alert, riwayat, jadwal, laporan".
- Kontrak, **WBS 1.4** Backend & database: "PHP Native, MySQL/MariaDB, auth,
  device, readings, thresholds, alerts".

Yang diminta: untuk deployment v1, basis data yang dipakai adalah **SQLite dengan
mode jurnal WAL**, diakses lewat PDO. Permintaan ini hanya mengubah pilihan mesin
basis data. Tidak ada perubahan pada fungsi, antarmuka, kontrak API, maupun
kriteria penerimaan deliverable mana pun.

## 2. Kondisi saat ini

Implementasi yang berjalan sudah memakai SQLite, dan perbedaannya bukan sekadar
nama driver:

| Bukti | Lokasi |
| --- | --- |
| Koneksi PDO ke SQLite | `server/src/Database.php:20` |
| `PRAGMA foreign_keys = ON` dan `PRAGMA journal_mode = WAL` | `server/src/Database.php:25-26` |
| Kunci primer `INTEGER PRIMARY KEY AUTOINCREMENT` di lima tabel | `server/src/Database.php:37, 89, 116, 129, 143` |
| Volume persisten satu berkas basis data di deployment | `deploy/Dockerfile`, variabel `AQUASMART_DB_PATH` |

`AUTOINCREMENT` pada SQLite bukan sinonim `AUTO_INCREMENT` MySQL, dan mode WAL
tidak punya padanan langsung. Karena itu perpindahan mesin bukan penggantian
string koneksi, melainkan perubahan skema dan perilaku transaksi.

## 3. Alasan

1. **Bentuk deployment.** Backend berjalan sebagai satu kontainer di Railway.
   SQLite menyimpan seluruh basis data pada satu berkas di volume persisten,
   sehingga tidak diperlukan server basis data terpisah, kredensial jaringan
   tambahan, maupun port yang terbuka ke luar kontainer.
2. **Keamanan query tidak berubah.** Seluruh query memakai prepared statement
   PDO. Lapisan pertahanan terhadap injeksi identik pada kedua mesin.
3. **Bukti pengujian berdiri di atas SQLite.** Gerbang verifikasi backend
   dijalankan ulang pada 21 September 2026 dan hasilnya `"passed": true`,
   `tests_run` 104 dari `planned_tests` 104, `failures` 0, `errors` 0,
   `skipped` 0, dengan `php -l` bersih pada 37 berkas PHP. Migrasi mesin berarti
   seluruh bukti itu harus diperoleh ulang.
4. **Biaya nol.** Tidak ada layanan basis data berbayar yang perlu disewa untuk
   prototipe akademik ini.

## 4. Analisis dampak

| Aspek | Dampak | Penjelasan |
| --- | --- | --- |
| Scope | **Nihil** | D-01, D-02, dan D-03 tetap terpenuhi dengan kriteria penerimaan yang sama. Tidak ada fitur yang ditambah atau dikurangi. |
| Jadwal | **Menghemat** | Tidak ada pekerjaan migrasi skema, konversi data, dan pengujian ulang yang perlu dijadwalkan. Baseline 60 hari kerja tidak berubah. |
| Biaya | **Menghemat** | Tidak ada tambahan biaya layanan basis data. Pos Cloud/Infrastructure Rp100.000 tidak bertambah. |
| Kualitas | **Netral sampai positif** | Seluruh integration test inti tetap hijau di atas mesin yang benar-benar dipakai, bukan di atas mesin yang hanya tertulis di dokumen. |
| Keamanan | **Netral** | Prepared statement, hashing Argon2id, regenerasi sesi, CSRF, dan rate limiter tidak bergantung pada mesin basis data. |
| Keselamatan | **Netral** | Tidak menyentuh jalur kontrol aktuator, yang berstatus simulasi dan tidak berubah oleh CR ini. |
| Risiko baru | **Ada, dicatat** | Lihat bagian 5. |

## 5. Risiko yang muncul dan mitigasinya

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| SQLite menulis dengan kunci tingkat basis data, sehingga tulis serentak tinggi akan mengantre | Sedang, hanya pada beban banyak perangkat | Mode WAL sudah aktif sehingga pembacaan tidak memblokir penulisan. Beban prototipe adalah satu ruang budidaya dengan pengiriman berkala, bukan tulis serentak masif. |
| Basis data satu berkas ikut hilang bila volume kontainer hilang | Tinggi bila terjadi | Volume persisten dipakai, dan `server/backup_local.py` tersedia untuk salinan. Uji pemulihan belum dijalankan; ini dicatat sebagai pekerjaan terbuka, bukan diklaim selesai. |
| Baseline dokumen lain masih menyebut MySQL/MariaDB | Rendah, risiko ketidakkonsistenan dokumen | Bila CR disetujui, kontrak Bagian 2 dan WBS 1.4, SKPL, RTM, serta runbook diperbarui pada versi berikutnya sesuai mekanisme Bagian 3.1. |

## 6. Alternatif yang dipertimbangkan

| Alternatif | Alasan tidak dipilih |
| --- | --- |
| Migrasi penuh ke MySQL/MariaDB sekarang | Mengubah skema dan perilaku transaksi, lalu menuntut pengulangan seluruh 104 test integrasi. Dikerjakan pada sisa waktu menjelang tenggat, risikonya lebih besar daripada manfaatnya. |
| Menjalankan dua mesin berdampingan | Menambah jalur kode yang harus diuji dua kali tanpa menambah kemampuan produk. |
| Membiarkan dokumen dan kode berbeda tanpa CR | Ditolak. Perbedaan antara baseline dan implementasi harus tercatat, bukan didiamkan. |

## 7. Rencana bila perubahan ditolak

Bila sponsor menolak, migrasi ke MySQL/MariaDB dijadwalkan sebagai pekerjaan
tersendiri dengan urutan: menyiapkan skema padanan, mengganti konstruksi khas
SQLite, memindahkan data uji, menjalankan ulang seluruh 104 test, lalu
memperbarui bukti uji. Pekerjaan itu memerlukan perpanjangan jadwal dan tidak
dapat dipenuhi dalam baseline berjalan.

## 8. Keputusan

| Kolom | Isi |
| --- | --- |
| Approve / Reject / Defer | Menunggu persetujuan |
| Nama pemutus | Menunggu persetujuan |
| Tanggal | Menunggu persetujuan |
| Catatan sponsor | Menunggu persetujuan |
