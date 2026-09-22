"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

import { fieldLabel } from "@/lib/ui-surfaces"

const labelVariants = cva(fieldLabel, {
  variants: {
    size: {
      default: "mb-1.5",
      sm: "mb-1.5 text-[10px]",
      lg: "mb-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Label({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-size={size}
      className={cn(labelVariants({ size }), className)}
      {...props}
    />
  )
}

export { Label, labelVariants }
