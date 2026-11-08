import { defaultMarketplaceFilters, type MarketplaceFilters } from "@/lib/marketplace";
import { defaultMarketplaceGigSort } from "@/lib/marketplace/gig-sort";

/** Počet aktivních položek v dropdownu Filtry (bez hledání a řazení). */
export function countActiveMarketplaceFacets(filters: MarketplaceFilters): number {
  let count = 0;
  if (filters.platform !== defaultMarketplaceFilters.platform) count += 1;
  if (filters.category !== defaultMarketplaceFilters.category) count += 1;
  if (filters.license !== defaultMarketplaceFilters.license) count += 1;
  if (filters.budget !== defaultMarketplaceFilters.budget) count += 1;
  return count;
}

export function countActiveMarketplaceFilters(filters: MarketplaceFilters): number {
  return (
    countActiveMarketplaceFacets(filters) +
    (filters.query.trim() ? 1 : 0) +
    (filters.sort !== defaultMarketplaceGigSort ? 1 : 0)
  );
}

export function marketplaceFiltersAreDefault(filters: MarketplaceFilters): boolean {
  return countActiveMarketplaceFilters(filters) === 0;
}
