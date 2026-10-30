"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardFeedbackFlashProps = {
  message?: string | null;
  error?: string | null;
  pending?: boolean;
  pendingLabel?: string;
  ariaLabel?: string;
};

export function DashboardFeedbackFlash({
  message,
  error,
  pending,
  pendingLabel = "Ukládám…",
  ariaLabel = "Stav akce",
}: DashboardFeedbackFlashProps) {
  const visible = Boolean(pending || message || error);
  if (!visible) return null;

  const tone = error ? "error" : message ? "success" : "pending";
  const text = error ?? message ?? pendingLabel;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-5 pt-3",
        "lg:pl-[248px] 2xl:pl-[280px]",
      )}
      role="region"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-3xl items-start gap-3 rounded-md border border-white/[0.12] bg-panel px-4 py-3",
          "shadow-[0_12px_48px_-12px_rgba(0,0,0,0.75)] sm:items-center",
        )}
      >
        {tone === "pending" ? (
          <Loader2
            className="mt-0.5 size-4 shrink-0 animate-spin text-cyan sm:mt-0"
            aria-hidden
          />
        ) : null}
        {tone === "success" ? (
          <CheckCircle2
            className="mt-0.5 size-4 shrink-0 text-cyan sm:mt-0"
            aria-hidden
          />
        ) : null}
        {tone === "error" ? (
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-error-soft sm:mt-0"
            aria-hidden
          />
        ) : null}
        <p
          className={cn(
            "min-w-0 flex-1 text-sm font-medium leading-snug",
            error ? "text-error-soft" : message ? "text-cyan" : "text-white",
          )}
          role={error ? "alert" : "status"}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
