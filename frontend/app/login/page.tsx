// Tujuan redirect middleware dan dashboard layout. Formulir login sebenarnya
// dikerjakan bersama lapisan data, karena butuh CSRF token dan sesi dari
// backend PHP. Rute ini ada lebih dulu supaya redirect tidak jatuh ke 404.
export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="font-display text-2xl font-bold text-deep-current">Masuk</h1>
      <p className="mt-4 text-sm text-muted">
        Formulir masuk belum tersedia. Halaman ini menunggu sambungan ke backend.
      </p>
    </main>
  )
}
