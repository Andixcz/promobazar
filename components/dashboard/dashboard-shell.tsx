import type { ReactNode } from "react";

type DashboardShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/** Hlavička stránky uvnitř dashboard layoutu (sidebar je v layout.tsx). */
export function DashboardShell({
  title,
  description,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-zinc-200">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
