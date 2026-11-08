import {
  defaultMarketplaceFilters,
  marketplaceCategoryOptions,
  marketplaceLicenseOptions,
  marketplacePlatformOptions,
  type MarketplaceFilters,
} from "@/lib/marketplace";
import {
  defaultMarketplaceGigSort,
  marketplaceGigSortValues,
  type MarketplaceGigSort,
} from "@/lib/marketplace/gig-sort";

export const MARKETPLACE_BROWSE_PATH = "/trziste";

const platformValues = new Set(
  marketplacePlatformOptions.map((o) => o.value),
);
const categoryValues = new Set(
  marketplaceCategoryOptions.map((o) => o.value),
);
const licenseValues = new Set(marketplaceLicenseOptions.map((o) => o.value));

function parseBudget(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1000 || n > 30_000) return null;
  return Math.round(n / 500) * 500;
}

export function marketplaceBrowseHref(
  filters: Partial<MarketplaceFilters> = {},
): string {
  const merged: MarketplaceFilters = {
    ...defaultMarketplaceFilters,
    ...filters,
  };
  const params = new URLSearchParams();
  if (merged.platform !== defaultMarketplaceFilters.platform) {
    params.set("platform", merged.platform);
  }
  if (merged.category !== defaultMarketplaceFilters.category) {
    params.set("category", merged.category);
  }
  if (merged.license !== defaultMarketplaceFilters.license) {
    params.set("license", merged.license);
  }
  if (merged.budget !== defaultMarketplaceFilters.budget) {
    params.set("budget", String(merged.budget));
  }
  const query = merged.query.trim();
  if (query) {
    params.set("q", query);
  }
  if (merged.sort !== defaultMarketplaceGigSort) {
    params.set("sort", merged.sort);
  }
  const qs = params.toString();
  return qs ? `${MARKETPLACE_BROWSE_PATH}?${qs}` : MARKETPLACE_BROWSE_PATH;
}

export function parseMarketplaceFiltersSearch(
  input: Record<string, string | string[] | undefined> | URLSearchParams,
): MarketplaceFilters {
  const get = (key: string): string | undefined => {
    if (input instanceof URLSearchParams) {
      return input.get(key) ?? undefined;
    }
    const raw = input[key];
    if (Array.isArray(raw)) return raw[0];
    return raw;
  };

  const platform = get("platform");
  const category = get("category");
  const license = get("license");
  const budget = parseBudget(get("budget"));

  const query = get("q")?.trim() ?? "";
  const sortRaw = get("sort");
  const sort = marketplaceGigSortValues.includes(sortRaw as MarketplaceGigSort)
    ? (sortRaw as MarketplaceGigSort)
    : defaultMarketplaceGigSort;

  return {
    platform:
      platform && platformValues.has(platform) ? platform : "all",
    category:
      category && categoryValues.has(category) ? category : "all",
    license: license && licenseValues.has(license) ? license : "all",
    budget: budget ?? defaultMarketplaceFilters.budget,
    query,
    sort,
  };
}

export function marketplaceFiltersToSearchParams(
  filters: MarketplaceFilters,
): URLSearchParams {
  return new URLSearchParams(
    marketplaceBrowseHref(filters).split("?")[1] ?? "",
  );
}
