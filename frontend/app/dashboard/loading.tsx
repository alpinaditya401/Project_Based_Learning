// Streaming SSR: Next.js menampilkan berkas ini sebagai fallback Suspense
// selagi page.tsx menunggu datanya, tanpa Suspense boundary manual.
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="skeleton h-9 w-1/3" />
        <div className="skeleton h-4 w-1/2" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["ph", "suhu", "kekeruhan"].map((parameter) => (
          <div
            key={parameter}
            className="rounded-panel border border-foam-line bg-surface-white p-6"
          >
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton mt-2 h-3 w-1/3" />
            <div className="skeleton mt-4 h-4 w-2/3" />
          </div>
        ))}
      </div>

      <div className="skeleton h-16 w-full" />
    </div>
  )
}
