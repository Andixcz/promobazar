"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import {
  dropdownOption,
  dropdownPanel,
  fieldSelectTrigger,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

export type FieldSelectOption = {
  value: string;
  label: string;
};

type FieldSelectProps = {
  name: string;
  id?: string;
  options: readonly FieldSelectOption[] | FieldSelectOption[];
  defaultValue?: string | number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
  onValueChange?: (value: string) => void;
};

function FieldSelect({
  name,
  id,
  options,
  defaultValue,
  required,
  disabled,
  className,
  "aria-invalid": ariaInvalid,
  onValueChange,
}: FieldSelectProps) {
  const initial =
    defaultValue !== undefined
      ? String(defaultValue)
      : (options[0]?.value ?? "");

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initial);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  const selected =
    options.find((o) => o.value === value) ?? options[0] ?? null;

  return (
    <div
      ref={rootRef}
      className={cn(
        "dd relative",
        open && "open z-[200]",
        className,
      )}
      data-value={value}
    >
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        className={fieldSelectTrigger}
        onClick={(event) => {
          event.stopPropagation();
          if (!disabled) setOpen((wasOpen) => !wasOpen);
        }}
      >
        <span className="dd-value truncate">
          {selected?.label ?? "—"}
        </span>
        <ChevronDown
          className={cn(
            "dd-chevron size-3.5 shrink-0 text-mist transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        role="listbox"
        className={cn(dropdownPanel, open && "open")}
      >
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isActive}
              className={cn(
                dropdownOption,
                "w-full text-left",
                isActive && "active",
              )}
              onClick={(event) => {
                event.stopPropagation();
                setValue(option.value);
                onValueChange?.(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { FieldSelect };
