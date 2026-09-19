import Link from "next/link"

// Landing page dikerjakan paling akhir sesuai urutan bobot. Halaman ini baru
// menjadi penanda bahwa pipeline deployment hidup.
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-4xl font-bold text-deep-current">AquaSmart AIoT</h1>
      <p className="mt-4 text-muted">
        Pemantauan kualitas air akuakultur: pH, suhu, dan kekeruhan.
      </p>
      <p className="mt-2 text-sm text-muted">
        Kerangka aplikasi. Halaman dan lapisan data belum dikerjakan.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 inline-block rounded-crisp bg-deep-current px-5 py-2.5 font-medium text-foam"
      >
        Buka dashboard
      </Link>
    </main>
  )
}
