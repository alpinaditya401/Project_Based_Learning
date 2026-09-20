"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { describedBy, Field } from "@/components/ui/field"
import { button, input } from "@/components/ui/styles"
import { useControlActuator } from "@/hooks/use-control"
import { ControlInput } from "@/lib/api/schemas"

// API.md: feeder duration is 1 to 30 seconds and the server defaults to 8.
const DEFAULT_SECONDS = 8
const HINT = "1 sampai 30 detik."

export function FeedNowForm({ deviceId }: { deviceId: string }) {
  const router = useRouter()
  const control = useControlActuator(deviceId)
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const raw = new FormData(event.currentTarget).get("duration")
    const parsed = ControlInput.safeParse({
      actuator: "feeder",
      value: true,
      duration: raw === "" ? Number.NaN : Number(raw),
      request_id: crypto.randomUUID(),
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message)
      return
    }
    setError(undefined)
    setSent(false)
    control.mutate(parsed.data, {
      onSuccess: () => {
        setSent(true)
        router.refresh()
      },
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <Field id="feed-duration" label="Durasi pakan (detik)" hint={HINT} error={error}>
        <input
          id="feed-duration"
          name="duration"
          type="number"
          inputMode="numeric"
          min={1}
          max={30}
          defaultValue={DEFAULT_SECONDS}
          className={input}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy("feed-duration", HINT, error)}
        />
      </Field>
      <button
        type="submit"
        disabled={control.isPending}
        className={button({ className: "w-full" })}
      >
        {control.isPending ? "Mengirim perintah..." : "Beri pakan sekarang"}
      </button>
      {control.isError ? (
        <p role="alert" className="text-sm text-alarm-coral-text">
          {control.error.message}
        </p>
      ) : null}
      {sent && !control.isPending ? (
        <p role="status" className="text-sm text-ink">
          Perintah pakan tercatat. Statusnya ada di riwayat perintah di bawah.
        </p>
      ) : null}
    </form>
  )
}
