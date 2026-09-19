# AquaSmart Design DNA

Pembacaan desain: instrumen pemantauan air untuk pembudidaya, tenang dan mudah dibaca; ENERGY 1 / RHYTHM 2 / MOTION 2.

## Design system

Token berasal dari `web/assets/css/app.css`: ink `#10262A`, deep-current `#0E2A30`, clear-water `#4C9A8E`, foam `#F1F5F3`. Sediment `#B9834F` dan alarm `#D2601F` menandai kondisi air; warna teks status memakai varian lebih gelap. Spacing 4/8/12/16/24/32/48/64/96 px; radius kontrol 4 px dan panel 10 px. Lebar konten maksimum 1180 px.

## Design style

Palet air dan sedimen mempertahankan identitas produk. Latar terang membantu pembacaan angka; judul dan tabel memiliki hierarki terpisah. Font sans untuk instruksi, monospace terbatas pada angka/penanda alat. Fallback Segoe UI/Consolas menghindari ketergantungan jaringan. Kartu mengelompokkan satu parameter atau operasi, bukan statistik pemasaran. Grafik air dan sensor memberi konteks langsung pada demo.

## Visual effects

Pada viewport setinggi 500px atau kurang, modal demo memenuhi layar dan header diringkas agar konten tetap dapat dibaca saat landscape. Referensi video disembunyikan hanya pada layout pendek; navigasi tetap 44px dengan padding safe-area. Verifikasi: 11 ukuran, semua frame kedua alur, evidence `demo-devices-final-20260916`.

Navigasi demo berada di luar panel isi yang menggulir agar posisi tombol sebelumnya/berikutnya stabil ketika tinggi teks dan ilustrasi berubah. Ukuran target 44px dan token existing dipertahankan.

GSAP hanya dimuat saat demo dibuka. Tujuan transisi: menandai perpindahan frame. Reduced motion mempertahankan isi dan kontrol manual tanpa SMIL. Tab tersembunyi menjeda demo dan rendering Three.js. Three.js yang sudah ada dibatasi ke landing desktop; SVG/HTML tetap tersedia untuk mobile, WebGL gagal, dan reduced motion. Tidak memakai ScrollTrigger atau model/tekstur eksternal.

## Evidence dan batas

`review_completion.mjs` memeriksa parameter, fallback, tanpa request eksternal pada login, dan overflow 320/375/768/1024/1440 px. `review_demo.mjs` memeriksa focus trap, Escape, dan perubahan reduced motion saat modal terbuka. `review_routes.mjs` memeriksa semua delapan route pada tujuh ukuran/rasio layar dan target 44px. Tombol bahaya/badge memakai alarm-coral-text sehingga kontras putih meningkat dari 3,87:1 menjadi 6,95:1. Three berhenti ketika stage keluar viewport. Screenshot route, demo dan export mobile ditinjau; detail evidence ada di REVIEW_REPORT.md. Audit WCAG menyeluruh, profil FPS dan mobile fisik belum dilakukan.

## Provenance / diagnostik — kelanjutan software

Badge memakai ink/foam existing dan border kontras, lima label tertulis (bukan warna/tooltip saja). Hitungan sumber memakai flex-wrap; tabel raw digeser horizontal pada mobile dengan target focusable dan label region. Tidak ada dependency visual baru. Hasil pencarian ui-ux-pro-max dipakai untuk hierarki/keterbacaan, bukan mengganti tema terang existing dengan rekomendasi dark mode. Rekomendasi membawa provenance reading terakhir; legacy tetap terlihat. Regresi 23 suite dan pemeriksaan diagnostik320px lulus; screenshot ditinjau.
