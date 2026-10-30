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
import { Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldSelect } from "@/components/ui/field-select";
import { Label } from "@/components/ui/label";
import { AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import {
  bestLicenseLabel,
  defaultMarketplaceFilters,
  filterMarketplaceCreators,
  marketplaceCategoryOptions,
  marketplaceCreatorPlural,
  marketplaceCreators,
  marketplaceLicenseOptions,
  marketplacePlatformOptions,
  minCreatorPrice,
  packagesSummary,
  platformLabel,
  type MarketplaceFilters,
} from "@/lib/marketplace";
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
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type MarketplaceFilterContextValue = {
  filters: MarketplaceFilters;
  setFilters: (patch: Partial<MarketplaceFilters>) => void;
  resetFilters: () => void;
};

const MarketplaceFilterContext =
  createContext<MarketplaceFilterContextValue | null>(null);

export function MarketplaceFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState(defaultMarketplaceFilters);

  const setFilters = useCallback((patch: Partial<MarketplaceFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultMarketplaceFilters);
  }, []);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters }),
    [filters, setFilters, resetFilters],
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
      <div className="mx-auto max-w-7xl animate-fade-up text-center">
        <h1 className="font-display text-[2.35rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.2rem]">
          Vyber si influencera.
          <br />
          Nastav rozpočet.
          <br />
          <span className="text-cyan">Získej prodeje.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-200 md:text-lg">
          Víš, že potřebuješ promo, ale ne vždy víš, komu napsat a jestli tomu můžeš
          věřit. Tady porovnáš tvůrce na jednom místě a oslovíš jen toho, kdo ti sedí.
        </p>
      </div>

      <div
        className="mx-auto mt-11 max-w-7xl animate-fade-up"
        style={{ animationDelay: ".1s" }}
      >
        <div className="relative rounded-2xl border border-white/[0.05] bg-panel p-2.5 md:p-3">
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



function CreatorCard({
  creator,
  index,
}: {
  creator: (typeof marketplaceCreators)[number];
  index: number;
}) {
  const initials =
    creator.initials ||
    creator.name.slice(0, 2).toUpperCase();

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-white/[0.05] bg-panel p-6 transition-colors duration-300 hover:border-cyan/40",
        creator.isPro && "border-cyan/45",
      )}
      style={{ animationDelay: `${(index % 8) * 0.04}s` }}
    >
      {creator.isPro ? (
        <span className="mb-3 inline-flex self-start rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-white bg-gradient-to-r from-indigo-500 to-violet-500">
          PRO tvůrce
        </span>
      ) : null}
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-gradient-to-br from-violet via-magenta to-cyan p-[2.5px] shrink-0">
          {creator.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creator.avatarUrl}
              alt=""
              className="size-14 rounded-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-full font-display text-sm font-bold text-white",
                creator.grad ?? "bg-gradient-to-br from-violet-500 to-fuchsia-500",
              )}
            >
              {initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">{creator.name}</p>
          <p className="truncate text-xs text-zinc-200">{creator.categoryLabel}</p>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-wide text-mist">
        <span>
          <span className="font-semibold text-white">{creator.followers}</span>{" "}
          sledujících
        </span>
        <span>
          <span className="font-semibold text-white">{creator.reach}</span>{" "}
          dosah/30 dní
        </span>
      </div>
      <p className="mb-3 font-mono text-[11px] tracking-wide text-zinc-200">
        Publikum {creator.audienceAge}
      </p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {creator.platforms.map((p) => (
          <span
            key={p}
            className="rounded-md border border-white/[0.09] bg-white/[0.04] px-2 py-1 font-mono text-[10px] tracking-wide text-cyan/85"
          >
            {platformLabel(p)}
          </span>
        ))}
      </div>
      <span className="mb-3 inline-flex self-start rounded-md border border-white/[0.09] bg-white/[0.04] px-2 py-1 font-mono text-[10px] tracking-wide text-cyan/85">
        Licence od {bestLicenseLabel(creator)}
      </span>
      <p className="mb-4 text-sm text-zinc-200">{packagesSummary(creator)}</p>
      <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-zinc-200">
            od
          </p>
          <p className="font-display text-lg font-bold bg-gradient-to-r from-accent-soft via-magenta to-cyan bg-clip-text text-transparent">
            {minCreatorPrice(creator).toLocaleString("cs-CZ")} Kč
          </p>
        </div>
        <Button type="button" size="sm" variant="default">
          Detail a balíčky
        </Button>
      </div>
    </article>
  );
}

function MarketplaceGrid() {
  const { filters, resetFilters } = useMarketplaceFilters();
  const filtered = filterMarketplaceCreators(marketplaceCreators, filters);
  const totalCreators = marketplaceCreators.length;
  const emptyCatalog = totalCreators === 0;

  return (
    <section id="marketplace" className={section}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Tržiště tvůrců
            </h2>
            <p className="mt-2 max-w-xl text-zinc-200">
              Nastav platformu, obor a rozpočet. Seznam tvůrců se hned přizpůsobí,
              abys rychle našel ty, kteří sedí tvé značce i kampani.
            </p>
          </div>
          <div className={resultCount} aria-live="polite">
            {filtered.length} {marketplaceCreatorPlural(filtered.length)} odpovídá
            filtru
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((creator, index) => (
              <CreatorCard key={`${creator.name}-${index}`} creator={creator} index={index} />
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

export function FirmsMarketplace() {
  return (
    <MarketplaceFilterProvider>
      <FirmsHeroSection />
      <MarketplaceGrid />
    </MarketplaceFilterProvider>
  );
}
