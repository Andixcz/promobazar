import type { ReactNode } from "react";

import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthPageShell({
  title,
  description,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-5 md:px-8 py-16 md:py-20 flex items-center justify-center">
      <div className="w-full max-w-md animate-fade-up">
        <div className={cn("p-8 md:p-10", surface)}>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-zinc-200 leading-relaxed">{description}</p>
          <div className="mt-8">{children}</div>
          {footer ? (
            <div className="mt-6 pt-6 border-t border-white/[0.09] text-sm text-zinc-200">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
