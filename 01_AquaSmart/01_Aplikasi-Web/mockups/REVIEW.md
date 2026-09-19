# Review internal mockup produk

16 September 2026. Gate mockup sebelum logic: disetujui internal untuk implementasi bertahap, bukan persetujuan penerimaan produk fisik.

- Token: memakai app.css dan DESIGN.md; ink/deep-current/foam, spacing 8/16/24, radius 4/10, font existing. Tidak menambahkan library atau animasi.
- Pembacaan: instrumen aquaponik untuk pemilik awam; ENERGY 1 / RHYTHM 2 / MOTION 1 pada mockup statis. Fokus pada langkah aktivasi dan status yang benar-benar diketahui.
- Lima halaman: provisioning.html, claim.html, onboarding.html, dashboard.html, push.html. Masing-masing memiliki loading/empty/success/error/pending; error spesifik ada di setiap halaman.
- Seluruh tombol sengaja disabled dan halaman berlabel mockup statis. Navigasi antarmockup berupa tautan nyata. QR belum digambar agar tidak memberi kode palsu yang seolah bisa diklaim.
- Nilai contoh diberi label; setiap nilai terhitung memiliki anotasi serta tautan ke docs/KALKULASI.md. Online, klaim, ACK dan keberhasilan fisik dibedakan.
- Tes `web/tests/review_product_mockups.mjs`: 21 pemeriksaan lulus di 320/390/820/1280px; semua state terdeteksi, tidak overflow, tombol ≥44px, tidak ada exception. Evidence `../05_Desain-Figma/review-hermes/product-mockups-20260916/`.
- Screenshot penjual/push mobile dan dashboard desktop ditinjau. Form satu kolom pada mobile, anotasi berada sesudah konten terkait; chart diberi label contoh.
- Gate antislop untuk artefak statis: PASS pada label data contoh, token existing, target tombol, overflow, tujuan tiap panel, serta ketiadaan kontrol aktif palsu. Pengujian aplikasi aktif, kontras otomatis menyeluruh, firmware dan perangkat fisik tidak dicakup hasil ini.

Tidak ada endpoint baru atau Web Push aktif hanya karena mockup selesai. Lanjutkan menggunakan checklist implementasi pada CHECKPOINT.md.
