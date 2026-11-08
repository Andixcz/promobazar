"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import type { AuthRegisterRole } from "@/lib/auth-register";
import { cn } from "@/lib/utils";

const options: { id: AuthRegisterRole; label: string }[] = [
  { id: "creator", label: "Tvůrce" },
  { id: "brand", label: "Značka / E-shop" },
];

type RegisterRoleFieldProps = {
  value: AuthRegisterRole;
  onChange: (role: AuthRegisterRole) => void;
  disabled?: boolean;
};

export function RegisterRoleField({
  value,
  onChange,
  disabled,
}: RegisterRoleFieldProps) {
  return (
    <FormField label="Typ účtu">
      <div
        role="radiogroup"
        aria-label="Typ účtu"
        className="flex gap-1 rounded-lg border border-white/[0.09] bg-panel p-1"
      >
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <Button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              variant={selected ? "default" : "ghost"}
              onClick={() => onChange(opt.id)}
              className={cn(
                "h-auto min-h-[2.75rem] flex-1 px-2 py-2.5 text-xs sm:px-3 sm:text-sm",
                !selected &&
                  "text-white/85 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    </FormField>
  );
}
