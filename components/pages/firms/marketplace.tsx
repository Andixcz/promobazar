"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { MarketplaceFiltersPanel } from "@/components/marketplace/marketplace-filters-panel";
import { MarketplaceGigResults } from "@/components/marketplace/marketplace-gig-results";
import { Button } from "@/components/ui/button";
import {
  defaultMarketplaceFilters,
  marketplacePreviewGigLimit,
  type MarketplaceCreator,
  type MarketplaceFilters,
} from "@/lib/marketplace";
import { marketplaceBrowseHref } from "@/lib/marketplace/browse-url";
import { landingHref } from "@/lib/landing-routes";
import {
  landingHeroTopPadding,
  section,
  sectionX,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

function FirmsHeroSection({
  filters,
  setFilters,
  onSearch,
}: {
  filters: MarketplaceFilters;
  setFilters: (patch: Partial<MarketplaceFilters>) => void;
  onSearch: () => void;
}) {
  return (
    <section
      id="top"
      className={cn("relative pb-8", landingHeroTopPadding, sectionX)}
    >
      <div className="mx-auto max-w-5xl animate-fade-up py-8 text-center sm:py-12 lg:py-16">
        <h1 className="font-display text-[2.75rem] font-bold leading-[1.04] tracking-tighter sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <span className="inline-flex items-center justify-center gap-[0.12em] sm:gap-[0.15em]">
            <Image
              src="/illustrations/Companies.svg"
              alt=""
              width={22}
              height={21}
              className="h-[0.7em] w-auto shrink-0"
              aria-hidden
            />
            Značky
          </span>
          <span className="inline-block px-[0.1em]">a</span>
          <span className="ml-[0.15em] inline-flex items-center justify-center gap-[0.12em] sm:gap-[0.15em]">
            <Image
              src="/illustrations/Influencers.svg"
              alt=""
              width={18}
              height={20}
              className="h-[0.7em] w-auto shrink-0"
              aria-hidden
            />
            tvůrci.
          </span>
          <br />
          <span className="text-cyan">Spolu jim to sedne.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-200 md:mt-8 md:text-lg">
          Místo, kde značky najdou tvůrce pro své promo a tvůrci získají
          spolupráce, které jim dávají smysl.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-10">
          <Button asChild size="lg">
            <a href="#hledat-promo">Jsem značka</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={landingHref("creators", "top")}>Jsem tvůrce</Link>
          </Button>
        </div>
      </div>

      <div
        id="hledat-promo"
        className="mx-auto mt-6 max-w-7xl scroll-mt-28 animate-fade-up"
        style={{ animationDelay: ".1s" }}
      >
        <MarketplaceFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          onSubmit={onSearch}
        />
      </div>
    </section>
  );
}

function MarketplacePreview({ creators }: { creators: MarketplaceCreator[] }) {
  return (
    <section id="marketplace" className={section}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Nejnovější nabídky
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-200">
              Vybrali jsme ti pár nabídek, které by se ti mohly líbit.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full shrink-0 md:w-auto"
          >
            <Link href={marketplaceBrowseHref()}>Otevřít celé tržiště</Link>
          </Button>
        </div>

        <MarketplaceGigResults
          creators={creators}
          filters={defaultMarketplaceFilters}
          onResetFilters={() => {}}
          limit={marketplacePreviewGigLimit}
        />
      </div>
    </section>
  );
}

export function FirmsMarketplace({
  creators,
}: {
  creators: MarketplaceCreator[];
}) {
  const [filters, setFiltersState] = useState(defaultMarketplaceFilters);

  const setFilters = (patch: Partial<MarketplaceFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  };

  const goToBrowse = () => {
    window.location.assign(marketplaceBrowseHref(filters));
  };

  return (
    <>
      <FirmsHeroSection
        filters={filters}
        setFilters={setFilters}
        onSearch={goToBrowse}
      />
      <MarketplacePreview creators={creators} />
    </>
  );
}
