"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { MarketplaceFilterFields } from "@/components/marketplace/marketplace-filter-fields";
import { MarketplaceSearchField } from "@/components/marketplace/marketplace-search-field";
import { FieldSelect } from "@/components/ui/field-select";
import { FormField } from "@/components/ui/form-field";
import {
  marketplaceSortOptions,
  type MarketplaceFilters,
} from "@/lib/marketplace";
import { countActiveMarketplaceFacets } from "@/lib/marketplace/filter-helpers";
import { dropdownPanelNav, fieldSelectTrigger } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

const toolbarControlWidth = "w-full min-w-[10.5rem] sm:w-[11.5rem]";

type MarketplaceFiltersToolbarProps = {
  filters: MarketplaceFilters;
  onFiltersChange: (patch: Partial<MarketplaceFilters>) => void;
  onResetFilters: () => void;
  className?: string;
};

export function MarketplaceFiltersToolbar({
  filters,
  onFiltersChange,
  onResetFilters,
  className,
}: MarketplaceFiltersToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const activeFilterCount = countActiveMarketplaceFacets(filters);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!filtersRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    }
    if (!filtersOpen) return;
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [filtersOpen]);

  const resetFiltersInPanel = () => {
    onResetFilters();
    setFiltersOpen(false);
  };

  return (
    <div id="trziste-filtry" className={cn("scroll-mt-28", className)}>
      <div className="flex flex-col gap-1 lg:flex-row lg:flex-wrap lg:items-end lg:gap-1">
        <div className="min-w-0 flex-1 lg:min-w-[12rem]">
          <MarketplaceSearchField
            value={filters.query}
            onDebouncedChange={(query) => onFiltersChange({ query })}
          />
        </div>

        <FormField label="Filtry" className={toolbarControlWidth}>
          <div
              ref={filtersRef}
              className={cn(
                "dd relative overflow-visible",
                filtersOpen && "open z-[200]",
              )}
            >
              <button
                type="button"
                className={fieldSelectTrigger}
                aria-expanded={filtersOpen}
                aria-haspopup="dialog"
                onClick={(e) => {
                  e.stopPropagation();
                  setFiltersOpen((open) => !open);
                }}
              >
                <span className="dd-value flex min-w-0 flex-1 items-center gap-2 truncate font-medium">
                  <SlidersHorizontal
                    className="size-4 shrink-0 text-mist"
                    aria-hidden
                  />
                  <span className="truncate">
                    {activeFilterCount > 0
                      ? `${activeFilterCount} aktivní`
                      : "Vše"}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "dd-chevron size-3.5 shrink-0 text-mist transition-transform duration-200",
                    filtersOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>

            <div
              className={cn(
                dropdownPanelNav,
                "left-0 min-w-[min(calc(100vw-2.5rem),22rem)] max-w-[calc(100vw-2.5rem)] overflow-hidden p-0 sm:min-w-[24rem]",
                filtersOpen && "open z-[200]",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hidden sm:block">
                <MarketplaceFilterFields
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  onResetFilters={resetFiltersInPanel}
                  layout="sidebar"
                />
              </div>
              <div className="p-4 sm:hidden">
                <MarketplaceFilterFields
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  onResetFilters={resetFiltersInPanel}
                  layout="stack"
                />
              </div>
            </div>
          </div>
        </FormField>

        <FormField label="Řazení" className={toolbarControlWidth}>
          <FieldSelect
              name="marketplace-sort"
              options={marketplaceSortOptions}
              value={filters.sort}
              onValueChange={(sort) =>
                onFiltersChange({
                  sort: sort as MarketplaceFilters["sort"],
                })
              }
          />
        </FormField>
      </div>
    </div>
  );
}
