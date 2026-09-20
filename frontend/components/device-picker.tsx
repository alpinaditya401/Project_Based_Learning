import Link from "next/link"
import { cn } from "@/lib/utils"

// Plain links, so switching device is a navigation the server renders; no client
// JavaScript is needed to pick a device.
export function DevicePicker({
  devices,
  selectedId,
  basePath,
}: {
  devices: { id: string; name: string }[]
  selectedId: string
  basePath: string
}) {
  if (devices.length < 2) return null
  return (
    <nav aria-label="Pilih perangkat">
      <ul className="flex flex-wrap gap-2">
        {devices.map((device) => {
          const selected = device.id === selectedId
          return (
            <li key={device.id}>
              <Link
                href={`${basePath}?device=${encodeURIComponent(device.id)}`}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-crisp border px-3 text-sm",
                  selected
                    ? "border-deep-current bg-deep-current text-foam"
                    : "border-muted bg-surface-white text-ink hover:bg-bg-deep",
                )}
              >
                {device.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
