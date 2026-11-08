import type { Metadata } from "next";

import { HttpStatusView } from "@/components/shared/http-status-view";
import { SiteShell } from "@/components/shared/site-shell";
import { LANDING_FIRMS_PATH } from "@/lib/landing-routes";
import { MARKETPLACE_BROWSE_PATH } from "@/lib/marketplace/browse-url";

export const metadata: Metadata = {
  title: "Stránka nenalezena",
  description: "Požadovaná adresa na promobazar.cz neexistuje.",
};

export default function NotFound() {
  return (
    <SiteShell>
      <HttpStatusView
        code="404"
        codeDisplay="digits"
        title="Stránka nenalezena"
        description="Adresa neexistuje nebo byla přesunuta."
        actions={[
          { href: LANDING_FIRMS_PATH, label: "Úvod", primary: true },
          { href: MARKETPLACE_BROWSE_PATH, label: "Tržiště" },
        ]}
      />
    </SiteShell>
  );
}
