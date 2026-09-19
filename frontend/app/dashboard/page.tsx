// Kontrak D-01 menyebut tiga parameter: pH, suhu, kekeruhan. Kerangkanya
// disiapkan di sini, tetapi angkanya sengaja belum ditampilkan: lapisan data
// (proxy BFF ke backend PHP dan skema Zod dari server/API.md) baru dikerjakan
// pada blok berikutnya. Mengisi kartu ini dengan contoh angka akan terbaca
// sebagai pembacaan sensor yang sebenarnya.
const parameters = [
  { name: "pH", unit: "pH" },
  { name: "Suhu", unit: "derajat Celsius" },
  { name: "Kekeruhan", unit: "NTU" },
] as const

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-deep-current">Ringkasan</h1>
        <p className="mt-2 text-muted">
          Kerangka halaman sudah terpasang. Data perangkat belum tersambung.
        </p>
      </header>

      <section aria-labelledby="parameter-heading">
        <h2 id="parameter-heading" className="font-display text-xl font-semibold">
          Parameter kualitas air
        </h2>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parameters.map((parameter) => (
            <li
              key={parameter.name}
              className="rounded-panel border border-foam-line bg-surface-white p-6"
            >
              <p className="font-display text-sm font-semibold text-ink">{parameter.name}</p>
              <p className="mt-1 text-xs text-muted">Satuan: {parameter.unit}</p>
              <p className="mt-4 text-sm text-muted">Belum tersambung ke perangkat.</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-panel border border-foam-line bg-surface p-4 text-sm text-muted">
        Kontrol aerator dan pemberi pakan berjalan sebagai simulasi. Belum ada bukti aktuasi
        perangkat fisik.
      </p>
    </div>
  )
}
