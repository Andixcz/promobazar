"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  boxClassName?: string;
  labelClassName?: string;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      className,
      boxClassName,
      labelClassName,
      id,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "flex w-full min-w-0 cursor-pointer items-start gap-2.5",
          disabled && "cursor-not-allowed opacity-55",
          className,
        )}
      >
        <span className="relative mt-0.5 shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              "flex size-4 items-center justify-center rounded border border-white/[0.14] bg-white/[0.04] transition-[background-color,border-color,box-shadow]",
              "peer-focus-visible:ring-3 peer-focus-visible:ring-cyan/35 peer-focus-visible:ring-offset-0",
              "peer-checked:border-cyan peer-checked:bg-cyan",
              "peer-disabled:opacity-50",
              boxClassName,
            )}
            aria-hidden
          />
          <Check
            className="pointer-events-none absolute inset-0 m-auto size-3 text-void opacity-0 transition-opacity peer-checked:opacity-100"
            strokeWidth={3}
            aria-hidden
          />
        </span>
        {children ? (
          <span
            className={cn(
              "min-w-0 flex-1 text-xs leading-snug break-words text-zinc-200",
              labelClassName,
            )}
          >
            {children}
          </span>
        ) : null}
      </label>
    );
  },
);
