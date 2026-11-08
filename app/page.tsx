import { Suspense } from "react";

import { ContactSection } from "@/components/pages/contact-section";
import { FirmsPage } from "@/components/pages/firms/firms-page";
import { SiteShell } from "@/components/shared/site-shell";
import { listMarketplaceCreatorsFromDb } from "@/lib/marketplace/public-server";

export default async function HomePage() {
  const creators = await listMarketplaceCreatorsFromDb();

  return (
    <SiteShell>
      <Suspense fallback={null}>
        <FirmsPage creators={creators} />
      </Suspense>
      <ContactSection />
    </SiteShell>
  );
}
