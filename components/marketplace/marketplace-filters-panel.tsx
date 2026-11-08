"use client";

import { MarketplaceFilterFields } from "@/components/marketplace/marketplace-filter-fields";
import { Button } from "@/components/ui/button";
import type { MarketplaceFilters } from "@/lib/marketplace";
import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type MarketplaceFiltersPanelProps = {
  filters: MarketplaceFilters;
  onFiltersChange: (patch: Partial<MarketplaceFilters>) => void;
  onSubmit?: () => void;
  submitLabel?: string;
  className?: string;
};

/** Hero vyhledávání na homepage. */
export function MarketplaceFiltersPanel({
  filters,
  onFiltersChange,
  onSubmit,
  submitLabel = "Vyhledat promo",
  className,
}: MarketplaceFiltersPanelProps) {
  return (
    <div className={cn(surface, "p-4 md:p-5", className)}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-6">
        <div className="min-w-0 flex-1">
          <MarketplaceFilterFields
            filters={filters}
            onFiltersChange={onFiltersChange}
            layout="stack"
          />
        </div>
        {onSubmit ? (
          <Button
            type="button"
            size="lg"
            className="w-full shrink-0 lg:w-[11.5rem]"
            onClick={onSubmit}
          >
            {submitLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
