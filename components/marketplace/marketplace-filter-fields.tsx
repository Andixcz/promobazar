"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { FieldSelect } from "@/components/ui/field-select";
import { Label } from "@/components/ui/label";
import {
  marketplaceCategoryOptions,
  marketplaceLicenseOptions,
  marketplacePlatformOptions,
  type MarketplaceFilters,
} from "@/lib/marketplace";
import { countActiveMarketplaceFacets } from "@/lib/marketplace/filter-helpers";
import { cn } from "@/lib/utils";

const filterResetLink =
  "text-left text-xs font-medium text-mist transition-colors hover:text-white";

const BUDGET_DEBOUNCE_MS = 320;

function syncBudgetRangeFill(el: HTMLInputElement) {
  const min = Number(el.min);
  const max = Number(el.max);
  const val = Number(el.value);
  el.style.setProperty(
    "--range-fill",
    `${((val - min) / (max - min)) * 100}%`,
  );
}

export type MarketplaceFilterSectionId =
  | "platform"
  | "category"
  | "license"
  | "budget";

export const marketplaceFilterSections: {
  id: MarketplaceFilterSectionId;
  label: string;
}[] = [
  { id: "platform", label: "Formát" },
  { id: "category", label: "Obor" },
  { id: "license", label: "Licence" },
  { id: "budget", label: "Rozpočet" },
];

type MarketplaceFilterFieldsProps = {
  filters: MarketplaceFilters;
  onFiltersChange: (patch: Partial<MarketplaceFilters>) => void;
  onResetFilters?: () => void;
  layout?: "stack" | "sidebar";
};

function BudgetRange({
  budget,
  onDebouncedBudgetChange,
}: {
  budget: number;
  onDebouncedBudgetChange: (budget: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draft, setDraft] = useState(budget);

  useEffect(() => {
    setDraft(budget);
  }, [budget]);

  useEffect(() => {
    if (inputRef.current) syncBudgetRangeFill(inputRef.current);
  }, [draft]);

  const flushBudget = useCallback(
    (value: number) => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (value !== budget) onDebouncedBudgetChange(value);
    },
    [budget, onDebouncedBudgetChange],
  );

  useEffect(() => {
    if (draft === budget) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
      onDebouncedBudgetChange(draft);
    }, BUDGET_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [draft, budget, onDebouncedBudgetChange]);

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-3">
        <Label className="mb-0">Rozpočet do</Label>
        <span className="font-body text-xs font-semibold tabular-nums tracking-wide text-cyan">
          {draft.toLocaleString("cs-CZ")} Kč
        </span>
      </div>
      <input
        ref={inputRef}
        type="range"
        min={1000}
        max={30000}
        step={500}
        value={draft}
        className="pb-range"
        aria-valuemin={1000}
        aria-valuemax={30000}
        aria-valuenow={draft}
        onChange={(e) => setDraft(Number(e.currentTarget.value))}
        onPointerUp={() => flushBudget(draft)}
      />
    </>
  );
}

export function MarketplaceFilterFields({
  filters,
  onFiltersChange,
  onResetFilters,
  layout = "stack",
}: MarketplaceFilterFieldsProps) {
  const activeFacetCount = countActiveMarketplaceFacets(filters);
  const showReset = onResetFilters != null && activeFacetCount > 0;
  const [activeSection, setActiveSection] =
    useState<MarketplaceFilterSectionId>("platform");

  const onDebouncedBudgetChange = useCallback(
    (budget: number) => onFiltersChange({ budget }),
    [onFiltersChange],
  );

  if (layout === "stack") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <Label>Kde chceš promo?</Label>
          <FieldSelect
            name="platform"
            options={marketplacePlatformOptions}
            value={filters.platform}
            onValueChange={(platform) => onFiltersChange({ platform })}
          />
        </div>
        <div>
          <Label>Kdo má promo dělat?</Label>
          <FieldSelect
            name="category"
            options={marketplaceCategoryOptions}
            value={filters.category}
            onValueChange={(category) => onFiltersChange({ category })}
          />
        </div>
        <div>
          <Label>Délka licence na reklamu</Label>
          <FieldSelect
            name="license"
            options={marketplaceLicenseOptions}
            value={filters.license}
            onValueChange={(license) => onFiltersChange({ license })}
          />
        </div>
        <div>
          <BudgetRange
            budget={filters.budget}
            onDebouncedBudgetChange={onDebouncedBudgetChange}
          />
        </div>
        {showReset ? (
          <button
            type="button"
            className={cn(filterResetLink, "self-start")}
            onClick={onResetFilters}
          >
            Resetovat filtry
          </button>
        ) : null}
      </div>
    );
  }

  const activeLabel =
    marketplaceFilterSections.find((s) => s.id === activeSection)?.label ?? "";

  const sectionPanel = (() => {
    switch (activeSection) {
      case "platform":
        return (
          <FieldSelect
            name="platform"
            options={marketplacePlatformOptions}
            value={filters.platform}
            onValueChange={(platform) => onFiltersChange({ platform })}
          />
        );
      case "category":
        return (
          <FieldSelect
            name="category"
            options={marketplaceCategoryOptions}
            value={filters.category}
            onValueChange={(category) => onFiltersChange({ category })}
          />
        );
      case "license":
        return (
          <FieldSelect
            name="license"
            options={marketplaceLicenseOptions}
            value={filters.license}
            onValueChange={(license) => onFiltersChange({ license })}
          />
        );
      case "budget":
        return (
          <BudgetRange
            budget={filters.budget}
            onDebouncedBudgetChange={onDebouncedBudgetChange}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className="flex min-h-[17rem] max-h-[min(70vh,22rem)]">
      <nav
        className="flex w-[7.5rem] shrink-0 flex-col gap-0.5 border-r border-white/[0.09] p-2"
        aria-label="Kategorie filtrů"
      >
        {marketplaceFilterSections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={
              activeSection === section.id
                ? "rounded-lg bg-white/[0.1] px-2.5 py-2 text-left text-xs font-medium text-white"
                : "rounded-lg px-2.5 py-2 text-left text-xs font-medium text-mist transition-colors hover:bg-white/[0.06] hover:text-white"
            }
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
        {showReset ? (
          <button
            type="button"
            className={cn(filterResetLink, "mt-auto px-2.5 py-2")}
            onClick={onResetFilters}
          >
            Resetovat
          </button>
        ) : null}
      </nav>
      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        <Label className="mb-3 block">{activeLabel}</Label>
        {sectionPanel}
      </div>
    </div>
  );
}
