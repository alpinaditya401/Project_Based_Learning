"use client"

import { useRouter } from "next/navigation"
import { button } from "@/components/ui/styles"
import { useControlActuator } from "@/hooks/use-control"

// An action button rather than a switch: a switch leaves the farmer guessing whether
// it shows the current state or the one it will change to. The current state is
// printed by the Server Component above this button.
export function ActuatorToggle({
  deviceId,
  actuator,
  label,
  on,
}: {
  deviceId: string
  actuator: "aerator" | "auto"
  label: string
  on: boolean
}) {
  const router = useRouter()
  const control = useControlActuator(deviceId)

  function send() {
    control.mutate(
      { actuator, value: !on, request_id: crypto.randomUUID() },
      { onSuccess: () => router.refresh() },
    )
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={send}
        disabled={control.isPending}
        className={button({ tone: on ? "secondary" : "primary", className: "w-full" })}
      >
        {control.isPending ? "Mengirim perintah..." : `${on ? "Matikan" : "Nyalakan"} ${label}`}
      </button>
      {control.isError ? (
        <p role="alert" className="text-sm text-alarm-coral-text">
          {control.error.message}
        </p>
      ) : null}
    </div>
  )
}
