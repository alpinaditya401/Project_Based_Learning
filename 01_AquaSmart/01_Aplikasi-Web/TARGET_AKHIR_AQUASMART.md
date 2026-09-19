# Target Akhir AquaSmart Aquaponik

Tanggal kesepakatan: 16 September 2026.

Dokumen ini adalah acuan hasil akhir produk berdasarkan percakapan dengan pemilik proyek. Dokumen ini menjelaskan **yang harus dibangun**, bukan klaim bahwa seluruh fitur sudah tersedia. Baca bersama CHECKPOINT.md untuk mengetahui implementasi dan evidence terakhir.

## 1. Hasil akhir yang diinginkan

Client membeli satu paket aquaponik AquaSmart lengkap, memasangnya sendiri dengan panduan, memasang aplikasi di HP, mendaftarkan unit miliknya, menyambungkan unit ke WiFi, lalu memantau suhu air serta mengoperasikan pompa dan feeder dari aplikasi.

Client tidak perlu mengedit kode, mengunggah firmware, memasukkan API key secara manual, atau menjalankan server di komputernya. Persiapan perangkat dilakukan pihak AquaSmart sebelum dijual.

Aplikasi dapat dibuka lewat ikon di HP dan memberikan notifikasi saat aplikasi ditutup. Koneksi internet diperlukan untuk pemantauan dan kontrol jarak jauh. Jadwal yang telah tersimpan pada perangkat tetap berjalan ketika internet terputus.

## 2. Pengguna dan cakupan awal

| Aspek | Keputusan |
|---|---|
| Produk | Satu paket aquaponik lengkap, termasuk perangkat pemantauan dan kontrol |
| Sasaran client | Pengusaha ikan dan sayuran dalam sistem aquaponik |
| Komoditas uji pertama | Lele dan selada; mengacu pada SKPL yang sudah ada |
| Pengguna aplikasi | Satu pemilik/pengelola akun; pengurus lain bekerja di lapangan |
| Akun | Satu akun pemilik cukup untuk versi pertama |
| Jumlah unit | Satu akun dapat memiliki beberapa unit aquaponik |
| Pemasangan | Client dapat memasang sendiri, termasuk client luar kota |
| Platform | PWA yang dapat dipasang di Android dan iPhone |
| Distribusi awal | Melalui tautan, tanpa Play Store/App Store |
| Jaringan lokasi | WiFi dengan internet diasumsikan tersedia; panduan harus membantu memeriksa koneksi |
| Target pengujian awal | Sistem milik sendiri sebelum digunakan client |

Pihak AquaSmart membutuhkan fungsi pengelolaan unit sebelum dijual. Fungsi penjual ini terpisah dari akun pemilik unit. Akun karyawan client bukan kebutuhan versi pertama.

## 3. Fitur wajib versi pertama

### 3.1 Pemantauan suhu air

- Menampilkan suhu air per unit, waktu pembacaan terakhir, dan histori.
- Menampilkan status koneksi dan kesegaran data secara jelas.
- Batas peringatan dapat diatur.
- Nilai awal ditentukan dengan mencocokkan SKPL dan hasil pengujian; jangan mengarang batas suhu lele.
- Reading sensor fisik harus dibedakan dari data contoh, simulasi, manual, dan legacy.

### 3.2 Kontrol pompa sirkulasi

- Pompa yang dimaksud mengalirkan air dari kolam ikan ke tanaman.
- Mendukung mode menyala terus dan mode terjadwal.
- Menyediakan kontrol manual dengan status perintah yang jelas.
- Menampilkan perbedaan antara perintah dikirim, diterima, selesai, gagal, dan tidak mendapat respons.
- ACK perangkat tidak otomatis membuktikan air mengalir jika tidak ada sensor konfirmasi.
- Mode awal dan perilaku aman setelah restart/listrik kembali ditentukan saat uji fisik, sebelum dipakai client.

### 3.3 Pakan otomatis

- Client mengatur jam pemberian pakan dan durasi motor.
- Versi pertama memakai durasi, bukan klaim takaran gram.
- Menyediakan uji/manual feeding dan histori hasilnya.
- Takaran gram hanya dapat ditambahkan setelah kalibrasi fisik yang sesuai.

### 3.4 Pengelolaan beberapa unit

- Setiap unit memiliki nama, serial, status, reading, jadwal, dan pengaturan sendiri.
- Perpindahan unit di aplikasi tidak boleh mencampurkan data atau target kontrol.
- Pemilik hanya dapat mengakses unit miliknya.

### 3.5 Notifikasi saat aplikasi ditutup

- Web Push merupakan fitur wajib, bukan sekadar pesan di dalam dashboard.
- Peringatan utama: suhu melewati batas, perangkat offline, dan kegagalan/tidak adanya respons perintah pompa atau feeder.
- Aktivasi mencakup izin pengguna dan tombol kirim notifikasi percobaan.
- Status dukungan browser, izin ditolak, atau langganan notifikasi bermasalah harus terlihat beserta petunjuknya.
- Mengetuk notifikasi membuka unit atau kejadian yang sesuai.
- Hindari pengiriman berulang tanpa perubahan kondisi; aturan jeda dan pemulihan perlu diimplementasikan dan diuji.
- Notifikasi dapat terlambat karena koneksi atau pengaturan HP. Aturan lokal perangkat tidak boleh bergantung pada keberhasilan notifikasi.

Untuk iPhone, Web Push memerlukan PWA terpasang di Home Screen dan iOS 16.4 atau lebih baru. Versi OS/browser nyata tetap dicatat saat pengujian.

## 4. Alur penjual sebelum unit diserahkan

1. Menyiapkan dan menguji perangkat serta firmware.
2. Mendaftarkan unit dengan serial unik pada sistem AquaSmart.
3. Menyiapkan identitas autentikasi unik perangkat dan konfigurasi tujuan server.
4. Menghasilkan QR/kode aktivasi sekali pakai untuk klaim kepemilikan.
5. Menyertakan label dan panduan pemasangan yang cocok dengan unit tersebut.
6. Memastikan unit siap masuk mode pengaturan WiFi pertama kali.

Kunci autentikasi rahasia perangkat tidak dicetak sebagai kode aktivasi publik. Kode aktivasi tidak dapat digunakan ulang untuk mengambil alih unit yang sudah dimiliki client.

## 5. Alur client dari awal sampai siap digunakan

1. **Memasang paket:** mengikuti petunjuk komponen, koneksi, dan pemeriksaan awal.
2. **Memasang AquaSmart:** membuka tautan dan memasang PWA melalui petunjuk Android/iPhone.
3. **Membuat akun/login.**
4. **Memilih Tambah Perangkat:** scan QR atau masukkan serial dan kode aktivasi sebagai alternatif jika kamera tidak tersedia.
5. **Klaim unit:** server memvalidasi kode dan mengikat unit pada akun client.
6. **Menghubungkan WiFi:** client mengikuti petunjuk mode pengaturan perangkat, memilih WiFi lokasi, dan memasukkan password.
7. **Menunggu koneksi:** aplikasi menampilkan “Terdaftar, menunggu koneksi” sampai perangkat benar-benar menghubungi server.
8. **Memberi nama unit:** misalnya “Kolam Lele 1”.
9. **Pemeriksaan terpandu:** memeriksa pembacaan suhu dan melakukan uji pompa/feeder yang diawasi.
10. **Mengatur operasi:** memilih mode pompa, jadwal pakan, durasi motor, dan batas peringatan suhu.
11. **Mengaktifkan notifikasi:** memberikan izin dan memastikan notifikasi percobaan diterima.
12. **Menggunakan dashboard:** memantau unit dan menindaklanjuti peringatan.

**Klaim akun dan koneksi WiFi adalah dua proses berbeda.** QR menghubungkan kepemilikan. WiFi menghubungkan perangkat ke internet. Klaim berhasil tidak boleh langsung menghasilkan status online palsu.

Pengaturan WiFi direncanakan melalui jaringan pengaturan sementara milik perangkat. Detail protokol, halaman lokal, dan mekanisme perpindahan jaringan harus dibuktikan di Android/iPhone. Website tidak boleh mengklaim telah menyimpan WiFi ke perangkat jika belum ada komunikasi/konfirmasi firmware.

## 6. Operasi harian dan gangguan koneksi

### Saat internet tersedia

- Perangkat mengirim heartbeat dan telemetry ke server melalui HTTPS.
- Aplikasi mengambil data unit milik akun yang sedang login.
- Perintah memiliki identitas dan status yang dapat dilacak.
- Jadwal/pengaturan yang diubah harus menunjukkan apakah sudah diterapkan pada perangkat.

### Saat internet terputus

- Jadwal dan aturan terakhir yang sudah dikonfirmasi tersimpan tetap berjalan di perangkat.
- Aplikasi menampilkan offline dan waktu data terakhir, bukan menyamarkan data lama sebagai data terkini.
- Perintah manual tidak boleh tampak berhasil jika belum diterima perangkat.
- Perintah kedaluwarsa tidak dijalankan belakangan secara tak terduga.
- Setelah koneksi pulih, status diselaraskan kembali tanpa mengulang pemberian pakan/perintah yang sudah selesai.

Operasi ini bergantung pada firmware, penyimpanan konfigurasi, dan pengelolaan waktu perangkat. Pemilihan sumber waktu, perilaku setelah listrik padam, dan nilai aman pompa memerlukan pengujian fisik. Terputusnya internet tidak sama dengan terputusnya listrik.

## 7. Pemulihan dan kepemilikan

- Sediakan petunjuk mengganti WiFi tanpa kehilangan kepemilikan unit.
- Bedakan reset koneksi dengan pelepasan kepemilikan.
- Unit yang sudah diklaim tidak dapat diklaim akun lain hanya dengan memasukkan serial.
- Pelepasan/pemindahan kepemilikan memerlukan alur terautentikasi dan pencatatan.
- Siapkan pesan yang jelas untuk kode salah, kode terpakai, perangkat belum online, dan akun bukan pemilik.

Detail antarmuka pemulihan dapat ditentukan saat implementasi; batas kepemilikan di atas harus dipertahankan.

## 8. Server dan pemasangan aplikasi

- Server operasional harus dapat diakses melalui internet dengan domain dan HTTPS publik.
- Komputer pengembang bukan server harian client.
- HP dan unit tidak harus berada di WiFi yang sama setelah pengaturan awal selesai.
- Tidak meminta client memasang CA lokal untuk penggunaan produk sehari-hari.
- PWA dapat diluncurkan dari ikon Home Screen.
- Cache offline membantu membuka shell aplikasi, bukan menyediakan data sensor baru tanpa koneksi.
- Hosting, domain, biaya operasional, dan penyedia layanan belum dipilih. Jangan membeli atau menerbitkan layanan berbayar tanpa keputusan pemilik.

## 9. Status implementasi saat dokumen dibuat

### Fondasi yang sudah tersedia dan diuji lokal

- Registrasi/login, dasar klaim serial dan kepemilikan unit.
- Kunci perangkat, heartbeat, API telemetry, serta dasar queue/ACK.
- Dashboard, histori, alert, pengaturan dan ekspor.
- Provenance eksplisit dan migrasi database lama tanpa seed ulang.
- PWA dasar, ikon Android/Apple dan cache shell.
- Perbaikan navigasi demo dan pengujian 11 ukuran layar.
- HTTPS local CA dan pengujian sertifikat positif/negatif.

Evidence terakhir: 96 tes backend, 30 lint PHP, 24 suite browser (368 assertion JSON + 7 SW stdout), dan 4 pemeriksaan browser HTTPS. Detail/path evidence berada pada CHECKPOINT.md dan REVIEW_REPORT.md. Hasil tersebut hanya membuktikan cakupan yang diuji.

### Target produk yang masih perlu diselesaikan

- Penerbitan unit penjual dan QR/kode aktivasi sekali pakai.
- Onboarding client lengkap dan panduan pemasangan mandiri.
- Integrasi pengaturan WiFi perangkat.
- Dashboard yang difokuskan pada suhu, pompa, dan feeder aquaponik.
- Web Push serta pengujian notifikasi aplikasi tertutup.
- Integrasi jadwal lokal/offline dan kontrol hardware nyata.
- Reset koneksi dan pemindahan kepemilikan.
- Server publik dan konfigurasi operasional.
- Verifikasi Android/iPhone fisik dan uji paket end-to-end.

**Kontrol/jadwal website existing masih memakai jalur simulasi.** Adanya API hardware atau animasi demo tidak membuktikan pompa/feeder fisik bekerja. Firmware dan kalibrasi belum dapat dianggap selesai dari tes website.

## 10. Checklist penerimaan hasil akhir

Pembaruan 16 September, fondasi alur baru: mockup kelima layar dan policy kalkulasi telah diuji (21 pemeriksaan layout, 48 boundary checks). Ini belum memenuhi checklist penerimaan di bawah: endpoint provisioning/claim, dashboard produk dan Web Push masih perlu integrasi. Referensi `mockups/REVIEW.md`, `docs/KALKULASI.md`, dan CHECKPOINT.md. Tidak ada kotak end-to-end yang dinaikkan hanya dari mockup.

Kotak berikut sengaja belum ditandai karena ini penerimaan produk end-to-end.

- [ ] Penjual dapat menyiapkan unit dengan identitas unik dan kode aktivasi.
- [ ] Client baru dapat mengikuti panduan tanpa mengedit kode atau firmware.
- [ ] PWA berhasil dipasang dan dibuka standalone di Android dan iPhone nyata.
- [ ] Client dapat klaim melalui QR maupun input manual.
- [ ] Klaim tidak sah/berulang dan akses unit milik akun lain ditolak.
- [ ] Client dapat menghubungkan/mengganti WiFi perangkat melalui panduan yang sudah diuji.
- [ ] Unit menjadi online hanya setelah komunikasi nyata diterima server.
- [ ] Satu akun dapat mengelola beberapa unit tanpa data/kontrol tertukar.
- [ ] Suhu fisik tampil dengan waktu, provenance, dan peringatan yang benar.
- [ ] Pompa kontinu/terjadwal dan feeder berdurasi bekerja pada perangkat fisik.
- [ ] Status perintah sesuai hasil komunikasi; tidak mengklaim kondisi fisik yang tidak diukur.
- [ ] Jadwal terkonfirmasi tetap berjalan saat internet putus.
- [ ] Pemulihan koneksi/restart tidak mengulang pakan atau menjalankan perintah kedaluwarsa.
- [ ] Notifikasi percobaan dan kejadian nyata diterima saat PWA ditutup pada kedua platform.
- [ ] Ketukan notifikasi membuka unit/kejadian yang tepat.
- [ ] Data lama/offline, kegagalan, dan izin notifikasi ditolak dijelaskan kepada client.
- [ ] Server publik memakai HTTPS dipercaya tanpa CA lokal di HP client.
- [ ] Backup/pemulihan data dan panduan operasional diverifikasi.
- [ ] Hasil uji mencatat perangkat, versi OS/browser, tanggal, hasil, dan keterbatasan.

## 11. Urutan melanjutkan proyek

1. Baca dokumen ini, CHECKPOINT.md, REVIEW_REPORT.md dan SKPL. Cocokkan source aktual sebelum menganggap fitur sudah selesai.
2. Implementasikan pengelolaan unit penjual, kode aktivasi, dan proteksi klaim.
3. Implementasikan onboarding client dan dashboard aquaponik mobile.
4. Implementasikan langganan/pengiriman Web Push, penanganan izin, dan tes notifikasi.
5. Kerjakan integrasi WiFi, jadwal lokal, dan kontrol fisik pada tahap firmware/hardware tersendiri.
6. Siapkan lingkungan publik setelah domain/hosting diputuskan.
7. Jalankan pengujian end-to-end memakai Android, iPhone, dan paket fisik sendiri.
8. Perbaiki hasil uji dan perbarui checklist dengan evidence sebelum pilot client.

Jangan membuat layar yang seolah menyelesaikan pekerjaan perangkat padahal belum terintegrasi. Tahap yang masih menunggu firmware harus diberi status jujur dan dapat dilanjutkan kemudian.

## 12. Batas pekerjaan dan aturan kelanjutan

- Tidak memakai Git; gunakan backup manual pada `_backup-sebelum-revisi/` sebelum perubahan besar.
- Pertahankan database dan akun existing; jangan seed ulang data client/lama.
- Jangan menghapus atau menyamarkan provenance legacy/simulasi.
- Instruksi sebelumnya membatasi pekerjaan aktif pada software/website dan melarang perubahan `firmware/`. Dokumen target ini tidak otomatis mencabut batas tersebut. Tahap firmware/hardware memerlukan pembukaan cakupan tersendiri oleh pemilik.
- Jangan menaikkan status FR01/FR07–FR09 atau klaim hardware berhasil dari tes simulasi.
- NFR05 local CA tetap PARTIAL; instalasi/notifikasi fisik tidak dibuktikan oleh emulasi viewport.
- pH, kekeruhan, akun karyawan, marketplace aplikasi, dan takaran pakan gram bukan prioritas versi pertama.
- Catat perubahan, pengujian, keterbatasan, dan langkah berikutnya di CHECKPOINT.md agar sesi berikutnya dapat melanjutkan.

## 13. Instruksi singkat untuk sesi berikutnya

> Lanjutkan AquaSmart di `C:\Testing-Project\01_AquaSmart\01_Aplikasi-Web`. Baca `TARGET_AKHIR_AQUASMART.md` sebagai target produk dan `CHECKPOINT.md` sebagai status implementasi. Fokus awal pada website/backend: penerbitan unit, QR/kode aktivasi sekali pakai, onboarding client, dashboard aquaponik suhu/pompa/feeder, dan Web Push. Pertahankan data existing, backup manual tanpa Git, dan jangan mengubah firmware atau status hardware dalam tahap software. Verifikasi source dan jalankan tes yang relevan. Bedakan fitur yang sudah berfungsi dari alur yang menunggu perangkat atau server publik.
