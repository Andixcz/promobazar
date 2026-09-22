import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-violet-400/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-55 disabled:transform-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-cyan text-void hover:bg-cyan/85",
        outline:
          "border-white/[0.14] bg-white/[0.04] text-white/85 hover:bg-white/[0.09] hover:border-white/[0.24]",
        ghost:
          "border-transparent bg-transparent text-white/80 hover:bg-white/[0.06] hover:text-white",
        destructive:
          "border-destructive/30 bg-destructive/15 text-error-soft hover:bg-destructive/25",
      },
      size: {
        default: "h-auto gap-1.5 px-4 py-2.5",
        sm: "h-auto gap-1 px-3.5 py-2 text-xs",
        lg: "h-auto gap-1.5 px-5 py-3 md:px-7 md:py-4",
        icon: "size-9 p-0",
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        size: "icon",
        class:
          "border-white/[0.09] bg-gradient-to-b from-white/[0.055] to-white/[0.02] hover:bg-white/10",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
