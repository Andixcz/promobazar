"use client";

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
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200",
              "border-white/[0.09] bg-gradient-to-b from-white/[0.055] to-white/[0.02] backdrop-blur-[10px]",
              "hover:bg-white/[0.08] disabled:opacity-55",
              value === opt.id &&
                "border-transparent bg-gradient-to-r from-violet via-magenta to-cyan text-white",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </FormField>
  );
}
