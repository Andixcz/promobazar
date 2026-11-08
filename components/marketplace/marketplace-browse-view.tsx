"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MarketplaceFiltersToolbar } from "@/components/marketplace/marketplace-filters-toolbar";
import { MarketplaceGigResults } from "@/components/marketplace/marketplace-gig-results";
import {
  defaultMarketplaceFilters,
  marketplaceBrowsePageSize,
  type MarketplaceCreator,
} from "@/lib/marketplace";
import { marketplaceFiltersAreDefault } from "@/lib/marketplace/filter-helpers";
import {
  marketplaceBrowseHref,
  marketplaceFiltersToSearchParams,
  parseMarketplaceFiltersSearch,
} from "@/lib/marketplace/browse-url";
import { landingHeroTopPadding, sectionX } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type MarketplaceBrowseViewProps = {
  creators: MarketplaceCreator[];
  initialFilters: typeof defaultMarketplaceFilters;
};

export function MarketplaceBrowseView({
  creators,
  initialFilters,
}: MarketplaceBrowseViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFiltersState] = useState(initialFilters);

  useEffect(() => {
    setFiltersState(parseMarketplaceFiltersSearch(searchParams));
  }, [searchParams]);

  const pushFilters = useCallback(
    (next: typeof defaultMarketplaceFilters) => {
      const params = marketplaceFiltersToSearchParams(next);
      const q = params.toString();
      router.replace(q ? `/trziste?${q}` : "/trziste", { scroll: false });
    },
    [router],
  );

  const setFilters = useCallback(
    (patch: Partial<typeof defaultMarketplaceFilters>) => {
      setFiltersState((prev) => {
        const next = { ...prev, ...patch };
        pushFilters(next);
        return next;
      });
    },
    [pushFilters],
  );

  const resetFilters = useCallback(() => {
    setFiltersState(defaultMarketplaceFilters);
    router.replace(marketplaceBrowseHref(), { scroll: false });
  }, [router]);

  const filtersAreDefault = useMemo(
    () => marketplaceFiltersAreDefault(filters),
    [filters],
  );

  return (
    <main id="view-trziste">
      <div className={cn(landingHeroTopPadding, sectionX, "pb-16 md:pb-20")}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <h1 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl">
              Tržiště balíčků
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-200 md:text-base">
              {filtersAreDefault
                ? "Všechny nabídky tvůrců"
                : "Nabídky podle tvého výběru"}
              . Vyhledej, filtruj a otevři detail balíčku.
            </p>
          </div>

          <MarketplaceFiltersToolbar
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={resetFilters}
          />

          <div className="mt-6">
            <MarketplaceGigResults
              creators={creators}
              filters={filters}
              onResetFilters={resetFilters}
              pageSize={marketplaceBrowsePageSize}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
