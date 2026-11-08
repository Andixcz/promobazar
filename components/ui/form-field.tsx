import type { ReactNode } from "react"
import { cn } from "cn"

import { Label } from "@/components/ui/label"

type FormFieldProps = {
  label: ReactNode
  htmlFor?: string
  hint?: ReactNode
  required?: boolean
  children: ReactNode
  className?: string
}

/** Label + control: stejné rozestupy jako na auth / dashboard formulářích. */
function FormField({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label htmlFor={htmlFor} className="inline-flex items-baseline gap-0.5">
        <span>{label}</span>
        {required ? (
          <>
            <span className="text-danger" aria-hidden="true">
              *
            </span>
            <span className="sr-only">, povinné</span>
          </>
        ) : null}
      </Label>
      {hint ? (
        <p className="-mt-0.5 mb-2 text-xs leading-relaxed text-mist">{hint}</p>
      ) : null}
      {children}
    </div>
  )
}

export { FormField }
