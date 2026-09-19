// Ikon dipilih per makna rutenya (gauge = ringkasan, thermometer = pembacaan
// sensor, bell = alert, sliders = aktuator, calendar = jadwal, settings =
// pengaturan), bukan karena satu set ikon terlihat modern.
import { Bell, CalendarClock, Gauge, Settings, SlidersHorizontal, Thermometer } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

const SESSION_COOKIE = "aquasmart_session"

// Rute yang halamannya belum dibuat tidak diberi href. Tautan ke halaman yang
// belum ada hanya menghasilkan 404 dan menyesatkan saat penilaian.
const navigation = [
  { label: "Ringkasan", href: "/dashboard", icon: Gauge },
  { label: "Data sensor", href: null, icon: Thermometer },
  { label: "Alert", href: null, icon: Bell },
  { label: "Kontrol aktuator", href: null, icon: SlidersHorizontal },
  { label: "Jadwal pakan", href: null, icon: CalendarClock },
  { label: "Pengaturan", href: null, icon: Settings },
] as const

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Lapis kedua setelah middleware. Keberadaan cookie bukan bukti sesi sah;
  // backend PHP yang memutuskan, dan permintaan API tetap bisa dibalas 401.
  const cookieStore = await cookies()
  if (!cookieStore.has(SESSION_COOKIE)) {
    redirect("/login?redirect=/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-foam-line bg-surface-white">
        <div className="border-b border-foam-line p-6">
          <p className="font-display text-lg font-bold text-deep-current">AquaSmart</p>
          <p className="mt-1 text-xs text-muted">Pemantauan kualitas air</p>
        </div>

        <nav aria-label="Navigasi utama" className="space-y-1 p-4">
          {navigation.map(({ label, href, icon: Icon }) =>
            href ? (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-crisp px-3 py-2 text-sm font-medium text-ink hover:bg-bg-deep"
              >
                <Icon aria-hidden="true" className="size-5" />
                {label}
              </Link>
            ) : (
              <p
                key={label}
                className="flex items-center gap-3 rounded-crisp px-3 py-2 text-sm text-muted"
              >
                <Icon aria-hidden="true" className="size-5" />
                {label}
                <span className="ml-auto text-xs">belum tersedia</span>
              </p>
            ),
          )}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  )
}
