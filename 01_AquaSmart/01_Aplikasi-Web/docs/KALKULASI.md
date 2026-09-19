# Kalkulasi alur client AquaSmart

Status: rancangan kontrak 16 September 2026. Formula berikut wajib dipakai konsisten pada implementasi baru. Jangan menyamakan rancangan dengan endpoint yang sudah terhubung. Konstanta dipusatkan pada `server/config/product.php`; unit test policy pada `server/tests/product_policy.php`. Pengujian repository/HTTP yang belum dibuat ditandai **pending**, bukan evidence lulus.

Sumber resmi: SKPL `02_Manajemen-Proyek/03_SKPL_AquaSmart_AIoT_Revisi.md`, BAB V FR2/FR4/FR5/FR7/FR8/FR12/FR17/FR18, BAB VI NFR6/NFR7/NFR11/NFR15. SKPL tidak menetapkan angka detail berikut. Angka implementasi lama dicatat sebagai baseline teknis, bukan requirement resmi.

## heartbeat-freshness

- Formula: `age = server_now_epoch_seconds - received_at_epoch_seconds`. `received_at=null` → waiting; `0 <= age <= HEARTBEAT_FRESH_SECONDS(120)` → online; lainnya → offline, dan age negatif menandai clock_anomaly. Waktu heartbeat diisi server, bukan waktu kiriman perangkat.
- Formula reading: `sample_age = now - sampled_at`. Null → missing; negatif → clock_skew; 0–`READING_FRESH_SECONDS(120)` → fresh; lebih besar → stale. Timestamp perangkat yang maju tidak menghidupkan status unit. Timestamp sampel yang mundur tetap menunjukkan basi meski baru diterima.
- Formula relatif: negatif → “Waktu perangkat tidak sesuai”; null → “Belum ada data”; 0–59 → “X detik lalu”; 60–3599 → `floor(age/60)` menit; 3600–86399 → `floor(age/3600)` jam; selebihnya → `floor(age/86400)` hari. Tidak memakai jam HP sebagai sumber otoritatif.
- Sumber: FR17/FR2; angka 120 detik **asumsi baru** untuk alur client, mempertahankan baseline DeviceRepository 120 detik. Bukan klaim interval sensor wajib. Penentuan online baru menunggu heartbeat terautentikasi; data simulasi tidak boleh dijadikan bukti perangkat fisik online.
- Edge case yang diuji: null, tepat 120, 121, timestamp masa depan, sampel basi baru diterima, 59/60/3599/3600/86400.
- Test file: `server/tests/product_policy.php` (policy); integrasi heartbeat device versus simulasi **pending**.

## command-expiry

- Formula: pending expiry = `created_at + COMMAND_PENDING_SECONDS(60)`. Saat pertama delivered: expiry = `delivered_at + max(COMMAND_ACK_MIN_SECONDS(30), duration + COMMAND_ACK_GRACE_SECONDS(15))`. Retry poll delivered tidak memperpanjang expiry.
- Formula: `now >= expires_at` → timeout. ACK tepat pada expiry tidak dapat mengubah timeout menjadi succeeded. Terminal ACK identik idempotent; terminal bertentangan ditolak. ACK sebelum delivered ditolak.
- Deduplikasi: unique `(device_id, request_id)`. Payload sama mengembalikan perintah existing; payload berbeda dengan request_id sama ditolak. Satu inflight per `(device_id, actuator)`.
- Sumber: FR8/FR12 dan baseline OperationsRepository. Nilai TTL adalah **asumsi baru**, alasan membatasi perintah terlambat; tidak menyatakan batas aman mekanik. Jendela kirim dan jendela ACK sengaja dibedakan.
- Edge case yang diuji: expiry-1/expiry/expiry+1, durasi+grace di bawah/atas minimum.
- Test file: `server/tests/product_policy.php`; baseline `test_operations.py`, `test_hardware_api.py`; pengujian out-of-order/duplikat pada endpoint produk baru **pending**.

## notification-debounce

- Formula state per `(owner, device, condition)`: `armed=true` awal. Breach boleh enqueue satu notifikasi jika armed dan `last_sent=null OR now-last_sent >= PUSH_MIN_INTERVAL_SECONDS(300)`. Sesudah enqueue: armed=false.
- Recovery: simpan `recovery_since` saat kondisi normal pertama; tetap normal setidaknya `PUSH_RECOVERY_SECONDS(120)` untuk armed=true. Breach selama masa recovery membatalkan recovery. Pengamatan normal sesaat tidak memulai episode baru.
- Bila episode baru terjadi sebelum 300 detik, tidak kirim saat itu; evaluasi berikut boleh kirim setelah 300 detik jika masih breach dan armed. Notifikasi bukan timer pengulangan kondisi yang tidak pernah pulih.
- Offline condition mengikuti heartbeat >120 detik; unit yang belum pernah heartbeat tidak menghasilkan alert offline. Suhu hanya dari reading valid/fresh; reading hilang/skew bukan recovery suhu. Recovery command-failure memerlukan hasil sukses command berikutnya, bukan sekadar ketiadaan command baru.
- Identitas notifikasi dan outbox harus unik agar worker paralel tidak menggandakan episode. Status enqueue/accepted layanan bukan bukti terlihat di HP. 404/410 menonaktifkan subscription; retry 429/5xx menghormati Retry-After dan tidak membuat episode baru.
- Sumber: FR5/FR6 serta TARGET_AKHIR §3.5; interval dan recovery **asumsi baru**, alasan mengurangi spam saat flapping. Pengiriman push nyata memerlukan worker+outbox; belum terhubung.
- Edge case yang diuji: breach menetap, recovery 119/120 detik, interval 299/300 detik, flapping/offline-online singkat.
- Test file: `server/tests/product_policy.php` (state transition); delivery subscription invalid/worker concurrency **pending**.

## kode-aktivasi

Integrasi IP: setiap request klaim terautentikasi (termasuk sukses) dihitung maksimal `ACTIVATION_MAX_FAILURES` per `ACTIVATION_LOCK_SECONDS` pada satu IP. Request berikut ditolak 429 sampai jendela berakhir. Ini pembatasan global IP konservatif, terpisah dari kegagalan per akun+serial; memakai konstanta existing tanpa angka baru. Tes: `test_product_api.py`.

- Formula: 16 karakter acak dari `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, tampil 4 grup masing-masing 4. Tidak mengandung 0/O/1/I/L. Pilihan karakter memakai `random_int`, bukan modulo byte bias.
- Entropi: `16 * log2(31)` ≈ 79,27 bit. Validasi `strtoupper` setelah hanya menghapus spasi ASCII dan tanda hubung; karakter ambigu tidak otomatis diganti.
- Expiry: `issued_at + ACTIVATION_TTL_SECONDS(2592000)` = 30×24×3600 detik. `now >= expiry` sudah expired. Pemakaian sukses hanya sekali dan dilakukan dalam transaksi atomik bersama ownership.
- Collision: UNIQUE hash kode dan serial di database; ulangi generator maksimal `ACTIVATION_COLLISION_RETRIES(5)`, setelah itu rollback. Keacakan tidak membuat collision matematis mustahil; constraint mencegah kode duplikat tersimpan.
- Lockout: `ACTIVATION_MAX_FAILURES(5)` kegagalan per akun+serial dalam jendela `ACTIVATION_LOCK_SECONDS(900)` detik memblokir klaim sampai akhir jendela. `retry_after=max(0, locked_until-now)`; tepat locked_until boleh lagi. Rate limit IP endpoint terpisah dibutuhkan agar pergantian akun/serial tidak menghindari batas.
- Sumber: NFR6/7/8 serta instruksi provisioning; seluruh angka **asumsi baru**, alasan entropi, masa distribusi unit, dan pembatasan tebakan. Device key berbeda dari activation code, 32 byte random (256 bit), tidak tampil di endpoint client.
- Edge case yang diuji: format, charset ambigu, expiry-1/expiry, threshold lockout, boundary unlock.
- Test file: `server/tests/product_policy.php`; forced collision, concurrency dua akun, replay dan leak response API **pending** sampai provisioning repository tersedia.

## durasi-feeder

- Formula alur produk baru: `is_int(duration) AND FEEDER_MIN_SECONDS(1) <= duration <= FEEDER_MAX_SECONDS(10)`. Float, boolean, string angka, null, 0, negatif dan >10 ditolak server.
- Sumber: FR7/FR9 hanya menetapkan kontrol; batas 1–10 detik adalah **asumsi baru**, alasan membatasi jumlah pakan pada pilot. Tidak menjamin keamanan SG90 tanpa kalibrasi mekanik/catu daya. Baseline legacy mengizinkan 1–30 detik; jangan diam-diam mengubah/menghapus jadwal lama. Migrasi kebijakan perlu menandai jadwal >10 untuk ditinjau sebelum dipakai jalur produk baru.
- Edge case yang diuji: 0, -1, 1, 10, 11, float, boolean, string.
- Test file: `server/tests/product_policy.php`; validasi endpoint/jadwal produk baru **pending**.

## jadwal-timezone

- Formula penyimpanan jadwal: jam lokal `HH:mm`, timezone `Asia/Jakarta` (WIB UTC+7); timestamp kejadian disimpan UTC epoch/ISO Z. `local_now=UTC_now.setTimezone(Asia/Jakarta)` sebelum membandingkan HH:mm dan hari.
- Eksekusi feeder: occurrence key `(schedule_id, local_date)`; insert/queue atomik UNIQUE mencegah eksekusi ganda saat restart pada menit yang sama. Tidak ada catch-up otomatis untuk menit yang terlewat.
- Jendela pompa [start,end): jika start<end, aktif saat `start <= local_minute < end`; jika start>end, aktif saat `minute>=start OR minute<end`. start=end ditolak karena ambigu, gunakan mode kontinu untuk sepanjang hari. 23:59–00:01 aktif pada 23:59 dan 00:00, tidak pada 00:01. Untuk versi awal jendela harian; kalender hari khusus belum ditetapkan.
- Sumber: FR7 serta instruksi pengguna WIB; tanpa catch-up dan interval setengah terbuka adalah **asumsi baru** untuk mencegah pakan dobel/ambigu. Mode pompa baru belum ada; `aerator` existing tidak boleh diam-diam dianggap pompa.
- Edge case yang diuji: UTC→WIB lintas tanggal, 23:59→00:01, start=end, jam invalid, occurrence key restart sama dan hari berikut berbeda.
- Test file: `server/tests/product_policy.php`; restart scheduler dengan queue persistence dan pompa endpoint **pending**.

## Nilai lain pada mockup

- 28,4 °C, 08:00, 3 detik dan nama unit adalah contoh statis, bukan default produksi atau data sensor.
- Threshold suhu runtime lama 25–30 °C terdapat di Auth.php; SKPL FR4/FR15/FR16 tidak memberi angka. Jangan mengklaimnya sebagai batas resmi lele. Alur baru mengambil setting pemilik dan menampilkan satuan; tidak menambah threshold diam-diam.
- Serial memakai regex legacy `^[A-Z0-9_-]{1,128}$`. Nama 1–100, lokasi 1–150 karakter mengikuti validasi DeviceLifecycle existing, bukan angka SKPL.
- Batas audit visual 320/390/820/1280 px adalah viewport uji, bukan breakpoint wajib perangkat. Target tombol 44px mengikuti desain existing dan sasaran aksesibilitas NFR9.
