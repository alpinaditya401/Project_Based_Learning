"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { describedBy, Field } from "@/components/ui/field"
import { button, input } from "@/components/ui/styles"
import { useClaimDevice } from "@/hooks/use-devices"
import { DeviceClaimInput } from "@/lib/api/schemas"
import { fieldErrors } from "@/lib/form"

const SERIAL_HINT = "Tertera pada label perangkat. Huruf kecil diubah otomatis jadi huruf besar."

export function ClaimDeviceForm() {
  const router = useRouter()
  const claim = useClaimDevice()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [claimed, setClaimed] = useState<string>()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const parsed = DeviceClaimInput.safeParse({
      serial_number: new FormData(form).get("serial_number"),
    })
    setClaimed(undefined)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    claim.mutate(parsed.data, {
      onSuccess: ({ device }) => {
        setClaimed(`${device.name} (${device.id}) masuk ke ruang budidaya ini.`)
        form.reset()
        router.refresh()
      },
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field
        id="serial-number"
        label="Serial perangkat"
        hint={SERIAL_HINT}
        error={errors.serial_number}
      >
        <input
          id="serial-number"
          name="serial_number"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className={`${input} font-data`}
          aria-invalid={Boolean(errors.serial_number)}
          aria-describedby={describedBy("serial-number", SERIAL_HINT, errors.serial_number)}
        />
      </Field>

      <button type="submit" disabled={claim.isPending} className={button()}>
        {claim.isPending ? "Menghubungkan..." : "Hubungkan perangkat"}
      </button>

      {claim.isError ? (
        <p role="alert" className="text-sm text-alarm-coral-text">
          {claim.error.message}
        </p>
      ) : null}
      {claimed && !claim.isPending ? (
        <p role="status" className="text-sm text-ink">
          {claimed}
        </p>
      ) : null}
    </form>
  )
}
