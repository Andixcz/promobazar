import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IllustrationDigits } from "@/components/ui/illustration-digits";
import {
  emptyStateActions,
  emptyStateSubtitle,
  emptyStateTitle,
  htmlButtonCta,
  htmlButtonOutline,
  landingHeroTopPadding,
  sectionX,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

export type HttpStatusAction = {
  href: string;
  label: string;
  primary?: boolean;
};

type HttpStatusViewProps = {
  code: string;
  title: string;
  description: string;
  /** Velké SVG číslice z `/illustrations/` (např. 404). */
  codeDisplay?: "text" | "digits";
  actions?: HttpStatusAction[];
  onRetry?: () => void;
  retryLabel?: string;
};

export function HttpStatusView({
  code,
  title,
  description,
  codeDisplay = "text",
  actions,
  onRetry,
  retryLabel = "Zkusit znovu",
}: HttpStatusViewProps) {
  return (
    <main
      className={cn(
        "flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center pb-16 md:pb-20",
        sectionX,
        landingHeroTopPadding,
      )}
    >
      <div className="w-full max-w-lg text-center">
        {codeDisplay === "digits" ? (
          <IllustrationDigits
            value={code}
            accessibleLabel={`${code} ${title}`}
            className="justify-center"
            gapClassName="gap-2 sm:gap-2.5"
            digitClassName="h-20 w-auto sm:h-28 md:h-36"
          />
        ) : (
          <p className="font-body text-sm tabular-nums text-mist">{code}</p>
        )}
        <h1
          className={cn(
            emptyStateTitle,
            codeDisplay === "digits"
              ? "mt-6 text-base font-medium text-mist md:text-lg"
              : "mt-2",
          )}
        >
          {title}
        </h1>
        <p className={cn(emptyStateSubtitle, "mx-auto mt-2")}>{description}</p>
        <div className={emptyStateActions}>
          {onRetry ? (
            <Button type="button" size="lg" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
          {actions?.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className={
                action.primary && !onRetry
                  ? htmlButtonCta
                  : htmlButtonOutline
              }
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
