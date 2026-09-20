# AquaSmart frontend

Next.js App Router di depan backend PHP AquaSmart (`01_AquaSmart/01_Aplikasi-Web/server/`).
Backend tidak diubah; frontend ini hanya klien.

## Menjalankan

```bash
npm install
AQUASMART_API_URL=http://127.0.0.1:8080 npm run dev
```

`AQUASMART_API_URL` wajib ada, juga saat `next build`. Tanpa variabel ini build
sengaja gagal, supaya deploy tidak diam-diam mengarah ke host yang salah.

| Perintah | Isi |
|---|---|
| `npm run lint` | Biome |
| `npm test` | Skema Zod diuji terhadap respons asli PHP di `lib/api/fixtures.json` |
| `python scripts/capture-api-fixtures.py` | Rekam ulang fixture dari backend lokal yang di-seed |

## Alur data

- Browser hanya bicara ke `/api/*` di origin yang sama. `app/api/[...path]/route.ts`
  meneruskan ke PHP beserta cookie sesi dan header CSRF.
- Server Component membaca PHP langsung lewat `lib/api/server.ts` dan hanya
  meneruskan cookie `aquasmart_session`.
- Skema respons diturunkan dari `server/API.md` dan diperiksa terhadap respons nyata.

## Batasan yang diketahui

- **Rate limit login dan register terbagi.** `RateLimiter.php` membuat bucket per
  `REMOTE_ADDR`. Di belakang BFF, semua permintaan browser tiba dari IP server
  Vercel, sehingga batas login (30 per menit) dan register (10 per menit) berlaku
  untuk semua pengguna bersama, bukan per pengguna. Perbaikannya ada di backend dan
  belum dikerjakan karena backend dibekukan.
- **Kontrol aerator dan feeder adalah SIMULASI.** Perintah tercatat di server, tetapi
  aktuasi fisik lewat ESP32 belum diverifikasi.
