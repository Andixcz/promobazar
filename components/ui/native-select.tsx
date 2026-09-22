import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { fieldControl } from "@/lib/ui-surfaces"

const nativeSelectVariants = cva(fieldControl, {
  variants: {
    size: {
      default: "h-auto px-4 py-3",
      sm: "h-auto px-3 py-2.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function NativeSelect({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"select">, "size"> &
  VariantProps<typeof nativeSelectVariants>) {
  return (
    <select
      data-slot="native-select"
      data-size={size}
      className={cn(nativeSelectVariants({ size }), className)}
      {...props}
    />
  )
}

export { NativeSelect, nativeSelectVariants }
