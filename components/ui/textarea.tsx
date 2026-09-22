import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { fieldControl } from "@/lib/ui-surfaces"

const textareaVariants = cva(
  cn(fieldControl, "resize-none"),
  {
    variants: {
      size: {
        default: "min-h-[96px] px-4 py-3",
        sm: "min-h-[72px] px-3 py-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

function Textarea({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"textarea">, "size"> &
  VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
