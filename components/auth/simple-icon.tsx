import type { SimpleIcon as SimpleIconData } from "simple-icons";

import { cn } from "@/lib/utils";

type SimpleIconProps = {
  icon: SimpleIconData;
  className?: string;
  title?: string;
};

export function SimpleIcon({ icon, className, title }: SimpleIconProps) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4 shrink-0", className)}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}
