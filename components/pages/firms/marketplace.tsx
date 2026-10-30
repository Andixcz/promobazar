"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Users } from "lucide-react";

import {
  flattenCreatorGigs,
  MarketplaceGigCard,
} from "@/components/marketplace/marketplace-gig-card";
import { Button } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/field-select";
import { Label } from "@/components/ui/label";
import { AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import {
  defaultMarketplaceFilters,
  filterMarketplaceCreators,
  marketplaceCategoryOptions,
  marketplaceGigPlural,
  marketplaceLicenseOptions,
  marketplacePlatformOptions,
  type MarketplaceFilters,
  type MarketplaceCreator,
} from "@/lib/marketplace";
import { landingHref } from "@/lib/landing-routes";
import { scrollToSection } from "@/lib/scroll-to-section";
import {
  emptyState,
  emptyStateActions,
  emptyStateIcon,
  emptyStateSubtitle,
  emptyStateTitle,
  htmlButtonOutline,
  landingHeroTopPadding,
  resultCount,
  section,
  sectionX,
  surface,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type MarketplaceFilterContextValue = {
  filters: MarketplaceFilters;
  setFilters: (patch: Partial<MarketplaceFilters>) => void;
  resetFilters: () => void;
  creators: MarketplaceCreator[];
};

const MarketplaceFilterContext =
  createContext<MarketplaceFilterContextValue | null>(null);

export function MarketplaceFilterProvider({
  children,
  creators,
}: {
  children: ReactNode;
  creators: MarketplaceCreator[];
}) {
  const [filters, setFiltersState] = useState(defaultMarketplaceFilters);

  const setFilters = useCallback((patch: Partial<MarketplaceFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultMarketplaceFilters);
  }, []);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters, creators }),
    [filters, setFilters, resetFilters, creators],
  );

  return (
    <MarketplaceFilterContext.Provider value={value}>
      {children}
    </MarketplaceFilterContext.Provider>
  );
}

export function useMarketplaceFilters() {
  const ctx = useContext(MarketplaceFilterContext);
  if (!ctx) {
    throw new Error("useMarketplaceFilters requires MarketplaceFilterProvider");
  }
  return ctx;
}



function syncBudgetRangeFill(el: HTMLInputElement) {
  const min = Number(el.min);
  const max = Number(el.max);
  const val = Number(el.value);
  el.style.setProperty(
    "--range-fill",
    `${((val - min) / (max - min)) * 100}%`,
  );
}

function FirmsHeroSection() {
  const { filters, setFilters } = useMarketplaceFilters();
  const budgetRef = useRef<HTMLInputElement>(null);
  const [budgetLabel, setBudgetLabel] = useState(
    `${filters.budget.toLocaleString("cs-CZ")} Kč`,
  );

  useEffect(() => {
    if (budgetRef.current) {
      budgetRef.current.value = String(filters.budget);
      syncBudgetRangeFill(budgetRef.current);
    }
  }, [filters.budget]);

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
          Místo, kde značky najdou tvůrce pro své promo a tvůrci získají spolupráce, které jim dávají smysl.
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
        <div className={cn(surface, "p-2.5 md:p-3")}>
          <div className="flex flex-col items-stretch lg:flex-row">
            <div className="relative flex-1 px-5 py-3.5 lg:py-3">
              <Label>Kde chceš promo?</Label>
              <FieldSelect
                name="platform"
                options={marketplacePlatformOptions}
                value={filters.platform}
                onValueChange={(platform) => setFilters({ platform })}
              />
            </div>
            <div className="h-px w-full bg-white/[0.09] lg:h-auto lg:w-px" />
            <div className="relative flex-1 px-5 py-3.5 lg:py-3">
              <Label>Kdo má promo dělat?</Label>
              <FieldSelect
                name="category"
                options={marketplaceCategoryOptions}
                value={filters.category}
                onValueChange={(category) => setFilters({ category })}
              />
            </div>
            <div className="h-px w-full bg-white/[0.09] lg:h-auto lg:w-px" />
            <div className="relative flex-1 px-5 py-3.5 lg:py-3">
              <Label>Délka licence na reklamu</Label>
              <FieldSelect
                name="license"
                options={marketplaceLicenseOptions}
                value={filters.license}
                onValueChange={(license) => setFilters({ license })}
              />
            </div>
          </div>
          <div className="h-px w-full bg-white/[0.09]" />
          <div className="flex flex-col gap-4 px-4 py-3.5 md:px-5 lg:flex-row lg:items-end lg:gap-5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <Label className="mb-0">Rozpočet do</Label>
                <span className="font-body text-xs font-semibold tabular-nums tracking-wide text-cyan">
                  {budgetLabel}
                </span>
              </div>
              <input
                ref={budgetRef}
                type="range"
                min={1000}
                max={30000}
                step={500}
                defaultValue={filters.budget}
                className="pb-range"
                onInput={(e) => {
                  const value = Number(e.currentTarget.value);
                  setBudgetLabel(`${value.toLocaleString("cs-CZ")} Kč`);
                  syncBudgetRangeFill(e.currentTarget);
                  setFilters({ budget: value });
                }}
              />
            </div>
            <Button
              type="button"
              size="lg"
              className="w-full shrink-0 lg:w-[11.5rem]"
              onClick={() => scrollToSection("marketplace")}
            >
              Vyhledat promo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}



function MarketplaceGrid() {
  const { filters, resetFilters, creators } = useMarketplaceFilters();
  const filtered = filterMarketplaceCreators(creators, filters);
  const gigs = flattenCreatorGigs(filtered);
  const totalCreators = creators.length;
  const emptyCatalog = totalCreators === 0;

  return (
    <section id="marketplace" className={section}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Tržiště balíčků
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-200">
              Každá karta je konkrétní nabídka tvůrce. Najdi formát, obor a cenu,
              pak otevři detail balíčku.
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className={resultCount} aria-live="polite">
            {gigs.length} {marketplaceGigPlural(gigs.length)} odpovídá filtru
          </div>
          <p className="text-xs text-mist">Řazení: doporučené</p>
        </div>

        {gigs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gigs.map((listing) => (
              <MarketplaceGigCard
                key={`${listing.creator.slug}-${listing.pkg.id}`}
                listing={listing}
              />
            ))}
          </div>
        ) : (
          <div className={emptyState} role="status" aria-live="polite">
            <div className={emptyStateIcon} aria-hidden>
              {emptyCatalog ? (
                <Users className="size-6" strokeWidth={1.5} />
              ) : (
                <Search className="size-6" strokeWidth={1.5} />
              )}
            </div>
            <h3 className={emptyStateTitle}>
              {emptyCatalog
                ? "Zatím tu nejsou žádní tvůrci"
                : "Žádný tvůrce neodpovídá filtru"}
            </h3>
            <p className={emptyStateSubtitle}>
              {emptyCatalog
                ? "Jsi influencer nebo UGC tvůrce? Vytvoř si profil a buď mezi prvními na tržišti."
                : "Zkus zvýšit rozpočet nebo změnit platformu, obor nebo licenci."}
            </p>
            <div className={emptyStateActions}>
              {emptyCatalog ? (
                <Link
                  href={`${AUTH_REGISTER_PATH}?role=creator`}
                  className={cn(htmlButtonOutline, "inline-flex")}
                >
                  Vytvořit profil tvůrce
                </Link>
              ) : (
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Resetovat filtry
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function FirmsMarketplace({
  creators,
}: {
  creators: MarketplaceCreator[];
}) {
  return (
    <MarketplaceFilterProvider creators={creators}>
      <FirmsHeroSection />
      <MarketplaceGrid />
    </MarketplaceFilterProvider>
  );
}
