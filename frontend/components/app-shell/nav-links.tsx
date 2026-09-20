"use client"

import {
  Bell,
  CalendarClock,
  FileBarChart,
  Gauge,
  Settings,
  SlidersHorizontal,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Order follows the contract weight of each feature. Icons are chosen for what the
// route holds (gauge: readings overview, sliders: actuators, calendar: feeding
// schedule, bell: alerts, chart: reports), not for a uniform library look.
const LINKS = [
  { href: "/dashboard", label: "Kualitas Air", icon: Gauge },
  { href: "/dashboard/control", label: "Kontrol Aktuator", icon: SlidersHorizontal },
  { href: "/dashboard/schedule", label: "Jadwal Pakan", icon: CalendarClock },
  { href: "/dashboard/alerts", label: "Peringatan", icon: Bell },
  { href: "/dashboard/reports", label: "Laporan", icon: FileBarChart },
  { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
  { href: "/dashboard/profile", label: "Profil", icon: UserRound },
] as const

export function NavLinks({
  unacknowledged,
  onNavigate,
}: {
  unacknowledged: number
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return (
    <ul className="space-y-1">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href)
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-crisp px-3 text-sm font-medium",
                active ? "bg-deep-current text-foam" : "text-ink hover:bg-bg-deep",
              )}
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <span className="flex-1">{label}</span>
              {href === "/dashboard/alerts" && unacknowledged > 0 ? (
                <span
                  className={cn(
                    "rounded-crisp px-2 py-0.5 font-data text-xs",
                    active ? "bg-foam text-ink" : "bg-alarm-coral-text text-white",
                  )}
                >
                  {unacknowledged}
                  <span className="sr-only"> peringatan belum ditangani</span>
                </span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
