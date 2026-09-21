# Design system frontend AquaSmart

Palet, skala, dan komponen yang dipakai `frontend/`. Semua nilainya diturunkan dari
`01_AquaSmart/01_Aplikasi-Web/web/assets/css/app.css`, bukan palet baru. Tujuannya satu:
SPA lama dan frontend Next.js ini tidak boleh berbeda warna.

## 1. Dari mana tokennya datang

`app.css` mendeklarasikan 43 nama custom property unik: 42 di `:root` dan satu lagi
(`--gauge`) yang dideklarasikan lokal di aturan komponen SPA. Sebarannya di frontend ini:

| Kelompok | Jumlah | Keterangan |
|---|---|---|
| Diturunkan langsung ke `@theme` | 21 | 7 warna dasar, 3 warna teks, 4 permukaan, 3 font, 3 radius, 1 shadow. Nilai heksanya identik. |
| Skala spasi diwarisi, tidak disalin | 9 | `--space-1` sampai `--space-9` adalah 4, 8, 12, 16, 24, 32, 48, 64, 96px, yaitu langkah 1, 2, 3, 4, 6, 8, 12, 16, 24 pada skala bawaan Tailwind. Menyalinnya akan membuat dua sumber kebenaran. |
| Diganti nama | 2 | `--max` menjadi `--container-content` dan `--ease` menjadi `--ease-current`, nilainya sama persis. |
| Tidak dibawa | 10 | `--bg`, `--primary`, `--primary-dark`, `--success`, `--warning`, `--danger`, `--blue`, `--coral` semuanya alias ke token lain; alias menambah nama tanpa menambah keputusan. `--shadow-none` dan `--primary-soft` tidak dipakai di sini. |
| Lokal SPA | 1 | `--gauge` dipakai komponen gauge di SPA, yang tidak ada di frontend ini. |

Tidak ada dark mode dan tidak ada `prefers-color-scheme`. `DESIGN.md` menolaknya secara
sadar, jadi ketiadaannya adalah keputusan, bukan kelalaian.

## 2. Skala tipografi

Empat ukuran judul memakai `clamp()`, jadi langkah mobile ada di dalam skalanya sendiri,
bukan tambalan media query. Batas bawah adalah ukuran di lebar 360px, batas atas ukuran
mulai dari `--container-content`.

| Token | Rentang | Dipakai untuk |
|---|---|---|
| `--text-page` | 1,625rem sampai 2,125rem | Judul halaman, satu per halaman |
| `--text-section` | 1,375rem sampai 1,625rem | Judul bagian besar |
| `--text-panel` | 1,125rem sampai 1,25rem | Judul panel di dalam halaman |
| `--text-sub` | 1,0625rem sampai 1,125rem | Judul kartu dan sub-bagian |

Ukuran teks isi memakai skala bawaan Tailwind apa adanya.

## 3. Lapisan komponen

`components/ui/styles.ts` hanya berisi tampilan. Semua varian lewat CVA, dan tidak ada
komponen yang boleh menulis warna, radius, atau shadow sendiri.

| Varian | Pilihan | Catatan |
|---|---|---|
| `heading` | `level`: page, section, panel, sub; `tone`: deep, ink, warning, danger | Menggantikan tujuh kombinasi kelas yang sebelumnya ditulis ulang di 54 tempat |
| `button` | `tone`: primary, secondary, danger; `size`: md, compact | Keduanya `min-h-11` (44px). `compact` hanya memangkas padding horizontal |
| `control` | `font`: body, data | Input, select, dan textarea. Batas pakai `muted`, bukan `foam-line` |
| `panel` | `tone`: plain, notice | `notice` dipakai pemberitahuan SIMULASI dan bagian status pengembangan |
| `statusText` | `tone`: neutral, ok, warning, danger, idle | Satu sumber warna status, dipakai tingkat peringatan dan status perintah |
| `inlineLink` | tanpa varian | Tautan setinggi 44px yang berdiri sendiri di dalam blok |
| `brandLink` | tanpa varian | Wordmark yang juga tautan ke beranda, dibuat setinggi 44px |
| `sentenceLink` | tanpa varian | Tautan di dalam kalimat berjalan, lihat catatan target di bawah |

`TableRegion` membungkus tabel lebar supaya yang menggulir tabelnya, bukan halaman.

**Catatan target sentuh.** Semua kontrol dan tautan mandiri setinggi minimal 44px. Satu
pengecualian yang disengaja: tautan di dalam kalimat berjalan, misalnya "Buat akun di
sini" pada halaman masuk. WCAG 2.2 SC 2.5.8 membebaskan target yang ukurannya dibatasi
tinggi baris teks di sekitarnya, dan memaksanya 44px akan merusak baris kalimat.
Padding vertikal tetap dipasang: area sentuhnya diukur 19px sebelum dan 35px sesudah,
tanpa mengubah tinggi baris.

## 4. Aksesibilitas terpisah dari tampilan

`components/ui/a11y.ts` tidak memuat satu pun nama kelas. Isinya `hintId`, `errorId`, dan
`fieldProps(id, { hint, error })` yang mengembalikan `id`, `aria-invalid`, dan
`aria-describedby` sekaligus. Ke-26 kontrol formulir memakainya, jadi perubahan tampilan
tidak bisa diam-diam menjatuhkan atribut aria, dan perbaikan pembaca layar tidak perlu
menyentuh daftar kelas.

`hooks/use-confirm-focus.ts` memegang perilaku, bukan cat: saat langkah konfirmasi
menggantikan tombol pemicunya, fokus dipindahkan ke `fieldset` berlabel supaya
pertanyaannya dibacakan dan Enter berikutnya tidak menembakkan aksi merusak. Empat tombol
konfirmasi memakai hook yang sama.

Struktur halaman memakai elemen HTML5 semantik: `header`, `nav`, `main`, `section`,
`article`, `aside`, `footer`, `dl` untuk pasangan label dan nilai, serta `fieldset` untuk
kelompok kontrol konfirmasi. ARIA hanya dipakai saat HTML tidak punya padanannya, misalnya
`aria-current`, `aria-live` lewat `role="status"`, dan `role="alert"` pada pesan galat.

## 5. Dial yang dideklarasikan

- **MOTION: 1.** Hanya transisi keadaan (hover, fokus, disabled) dan satu denyut skeleton
  yang berhenti saat `prefers-reduced-motion: reduce`. Tidak ada animasi dekoratif, tidak
  ada loop tanpa henti.
- **RHYTHM: 2.** Komposisi bagian bervariasi menurut isinya (ringkasan, kartu parameter,
  tabel, formulir), tetapi tidak ada bagian yang sengaja dibuat asimetris demi variasi.
- **Aksen tunggal.** `deep-current` memegang aksi utama. `clear-water-text`,
  `sediment-text`, dan `alarm-coral-text` hanya muncul saat menyatakan keadaan, dan selalu
  didampingi kata, tidak pernah warna sendirian.

## 6. Kontras terukur

Diukur dengan `contrast-check.py` dari skill antislop-human pada 20 September 2026. Bukan
perkiraan; semuanya lolos ambang AA teks normal 4,5:1.

| Teks | Latar | Rasio |
|---|---|---|
| ink | surface-white | 15,03:1 |
| deep-current | surface-white | 14,39:1 |
| clear-water-text | surface-white | 7,52:1 |
| sediment-text | surface-white | 7,03:1 |
| alarm-coral-text | surface-white | 6,63:1 |
| muted | surface-white | 5,74:1 |
| muted | bg-deep | 5,11:1 |
| foam | deep-current | 13,71:1 |
| putih | alarm-coral-text | 6,95:1 |

Angka terakhir adalah pasangan tombol berbahaya, yang pernah diperbaiki dari 3,87:1 ke
6,95:1 dan diukur ulang di sini.

## 7. Hasil pengukuran tata letak

Diukur dengan Chrome headless terhadap build produksi dan backend lokal ter-seed, pada
21 September 2026. Sepuluh rute, tiga lebar.

| Lebar | Overflow horizontal | Target di bawah 44px | Ukuran `h1` |
|---|---|---|---|
| 360px | tidak ada di 10 rute | nol, kecuali tautan dalam kalimat | 26px |
| 768px | tidak ada di 10 rute | nol, kecuali tautan dalam kalimat | 32px |
| 1280px | tidak ada di 10 rute | nol, kecuali tautan dalam kalimat | 34px |

Ukuran `h1` yang berubah dari 26px ke 34px adalah bukti bahwa langkah mobile memang
datang dari `clamp()`, bukan dari media query.

Pemeriksaan statis yang juga dijalankan dan lolos: tidak ada aturan `prefers-color-scheme`
maupun kelas `dark:`, tidak ada emoji, tidak ada em dash atau en dash, tidak ada warna
heksadesimal yang ditulis langsung di komponen, tidak ada `100vh`, tidak ada lebar tetap
piksel, tidak ada kelas animasi dekoratif, dan setiap elemen `<button>` mengambil
tampilannya dari varian `button()`.
