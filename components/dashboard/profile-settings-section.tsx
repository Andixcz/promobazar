import type { ReactNode } from "react";

import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type ProfileSettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ProfileSettingsSection({
  title,
  description,
  children,
  className,
}: ProfileSettingsSectionProps) {
  return (
    <section className={cn(surface, className)}>
      <div className="border-b border-white/[0.08] px-5 py-4 md:px-6">
        <h2 className="font-display text-base font-semibold text-white">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-mist">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4 px-5 py-5 md:px-6">{children}</div>
    </section>
  );
}
