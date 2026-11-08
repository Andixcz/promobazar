import fuzzysort from "fuzzysort";

import type { MarketplaceGigListing } from "@/components/marketplace/marketplace-gig-card";
import { platformLabel } from "@/lib/marketplace";

export function normalizeMarketplaceSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function gigSearchBlob(listing: MarketplaceGigListing): string {
  const format = listing.pkg.format
    ? platformLabel(listing.pkg.format)
    : "";
  return normalizeMarketplaceSearchText(
    [
      listing.pkg.name,
      listing.creator.name,
      listing.creator.categoryLabel,
      listing.creator.category,
      format,
    ].join(" "),
  );
}

type SearchRow = {
  listing: MarketplaceGigListing;
  blob: string;
};

/** Fuzzy fulltext nad balíčky (název, tvůrce, obor, formát). */
export function filterMarketplaceGigsByQuery(
  gigs: MarketplaceGigListing[],
  rawQuery: string,
): MarketplaceGigListing[] {
  const query = rawQuery.trim();
  if (!query) return gigs;

  const rows: SearchRow[] = gigs.map((listing) => ({
    listing,
    blob: gigSearchBlob(listing),
  }));

  const normalizedQuery = normalizeMarketplaceSearchText(query);
  const results = fuzzysort.go(normalizedQuery, rows, {
    key: "blob",
    threshold: 0.15,
    limit: 0,
  });

  return results.map((r) => r.obj.listing);
}
