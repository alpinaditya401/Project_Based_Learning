# AquaSmart AIoT

Sistem pemantauan kualitas air untuk akuakultur: pH, suhu, dan kekeruhan.
Proyek Akhir Front-End, D3 Teknik Informatika, Sekolah Vokasi UNS.

Pembimbing: Darmawan Lahru Riatma, S.Kom., M.MT.

## Status

Aplikasi web berjalan dan teruji secara lokal. Yang perlu dibaca apa adanya:

- **Kontrol aerator dan pemberi pakan masih SIMULASI.** Perintah tersimpan,
  berpindah status, dan tercatat di audit log, tetapi belum ada bukti aktuasi
  perangkat fisik. Respons API hardware selalu memuat
  `physical_actuation_verified=false`.
- **Pembacaan sensor belum terkalibrasi.** Label `simulation=false` adalah
  deklarasi pengirim, bukan bukti sensor fisik. Sensor pH yang ada berstatus
  placeholder tanah, bukan pH air terkalibrasi.
- **Profil FPS perangkat fisik dan audit WCAG menyeluruh belum dijalankan.**
- Kontrak menyebut MySQL/MariaDB, kode memakai SQLite. Perbedaan ini diajukan
  lewat Change Request, bukan ditutupi.

## Isi repo

| Jalur | Isi |
| --- | --- |
| `01_AquaSmart/01_Aplikasi-Web/server/` | REST API PHP 8 tanpa dependency, SQLite, 104 test |
| `01_AquaSmart/01_Aplikasi-Web/web/` | SPA/PWA JavaScript native, tanpa build step |
| `01_AquaSmart/01_Aplikasi-Web/deploy/` | Dockerfile Apache dan mod_php untuk backend |
| `01_AquaSmart/01_Aplikasi-Web/firmware/` | Sketsa ESP32 |
| `01_AquaSmart/01_Aplikasi-Web/docs/` | Catatan perhitungan dan rujukan SKPL |
| `frontend/` | Frontend Next.js 16 App Router, masih kerangka |

Struktur folder sengaja dipertahankan seperti di ruang kerja aslinya supaya
perintah pada dokumen dan jalur di dalam test tetap berlaku tanpa penyesuaian.

## Menjalankan secara lokal

Butuh PHP 8.2 atau lebih baru dan Python 3.11. Dari `01_AquaSmart/01_Aplikasi-Web`:

```bash
python server/run_local.py
```

Aplikasi terbuka di `http://127.0.0.1:8080`. Kredensial runtime, seed, dan kunci
per-perangkat dijelaskan di `LOCAL_GUIDE.md`.

## Gerbang verifikasi

Dari `01_AquaSmart/01_Aplikasi-Web`:

```bash
python server/tests/run_verified_suite.py
```

Lulus berarti keluaran JSON-nya memuat `"passed": true` dengan `failures`,
`errors`, dan `skipped` bernilai nol, serta `tests_run` sama dengan
`planned_tests`. Runner ini juga menjalankan `php -l` pada seluruh berkas PHP.

Frontend Next.js diperiksa dari `frontend/`:

```bash
npm install && npm run build
```

## Dokumen

`DESIGN.md` adalah catatan keputusan desain yang mengikat, bukan draft.
`server/API.md` adalah sumber kebenaran kontrak API. `REVIEW_REPORT.md` dan
`CHECKPOINT.md` memuat status dan bukti terbaru.

## Catatan publikasi

Repo ini adalah bagian deliverable dari ruang kerja yang lebih besar. Materi
kursus pihak ketiga, modul praktikum milik kampus, dan dokumen yang memuat data
pribadi orang lain tidak disertakan.
