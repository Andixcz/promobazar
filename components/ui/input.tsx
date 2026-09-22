import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import {
  fieldControl,
  fieldControlSizeDefault,
  fieldControlSizeSm,
} from "@/lib/ui-surfaces"

const inputVariants = cva(fieldControl, {
  variants: {
    size: {
      default: fieldControlSizeDefault,
      sm: fieldControlSizeSm,
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
