import type { Metadata } from "next";
import { Suspense } from "react";

import { MarketplaceBrowseView } from "@/components/marketplace/marketplace-browse-view";
import { SiteShell } from "@/components/shared/site-shell";
import { parseMarketplaceFiltersSearch } from "@/lib/marketplace/browse-url";
import { listMarketplaceCreatorsFromDb } from "@/lib/marketplace/public-server";

export const metadata: Metadata = {
  title: "Tržiště balíčků",
  description:
    "Prohlédni balíčky influencerů a UGC tvůrců. Filtruj podle platformy, oboru, licence a rozpočtu.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TrzistePage({ searchParams }: PageProps) {
  const creators = await listMarketplaceCreatorsFromDb();
  const sp = await searchParams;
  const initialFilters = parseMarketplaceFiltersSearch(sp);

  return (
    <SiteShell>
      <Suspense fallback={null}>
        <MarketplaceBrowseView
          creators={creators}
          initialFilters={initialFilters}
        />
      </Suspense>
    </SiteShell>
  );
}
