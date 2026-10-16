import Link from "next/link";

import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import { buttonVariants } from "@/components/ui/button";

const COPY: Record<string, string> = {
  active: "Výplatní účet je propojený.",
  pending: "Ověření ještě není hotové.",
  restricted: "Doplň údaje k výplatám.",
  none: "Aby ti chodily peníze za zakázky, propoj výplatní účet.",
};

export function StripePayoutCard({
  status,
  notice,
}: {
  status: "pending" | "active" | "restricted" | null;
  notice?: string;
}) {
  const problem =
    notice === "odkaz_selhal" ||
    notice === "neni_nastavene" ||
    notice === "chybi_ucet"
      ? "Výplaty se nepodařilo otevřít."
      : notice === "jen_tvurce"
        ? "Výplaty si nastavuje tvůrce."
        : null;

  return (
    <ProfileSettingsSection title="Výplaty" description={COPY[status ?? "none"]}>
      {problem ? (
        <p className="text-sm text-destructive" role="alert">
          {problem}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {status === "active" ? (
          <Link
            href="/api/stripe/connect/login"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Otevřít výplaty
          </Link>
        ) : (
          <Link
            href="/api/stripe/connect"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            {status ? "Dokončit ověření" : "Propojit výplaty"}
          </Link>
        )}
      </div>
    </ProfileSettingsSection>
  );
}
