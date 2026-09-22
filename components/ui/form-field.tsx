import type { ReactNode } from "react"
import { cn } from "cn"

import { Label } from "@/components/ui/label"

type FormFieldProps = {
  label: ReactNode
  htmlFor?: string
  hint?: ReactNode
  children: ReactNode
  className?: string
}

/** Label + control — stejné rozestupy jako na auth / dashboard formulářích. */
function FormField({ label, htmlFor, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {hint ? (
        <p className="-mt-0.5 mb-2 text-xs leading-relaxed text-mist">{hint}</p>
      ) : null}
      {children}
    </div>
  )
}

export { FormField }
