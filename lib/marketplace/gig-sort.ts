import type { MarketplaceGigListing } from "@/components/marketplace/marketplace-gig-card";

export const marketplaceGigSortValues = [
  "newest",
  "oldest",
  "price-desc",
  "price-asc",
  "name-asc",
] as const;

export type MarketplaceGigSort = (typeof marketplaceGigSortValues)[number];

export const defaultMarketplaceGigSort: MarketplaceGigSort = "newest";

export function sortMarketplaceGigs(
  gigs: MarketplaceGigListing[],
  sort: MarketplaceGigSort,
): MarketplaceGigListing[] {
  const list = [...gigs];
  switch (sort) {
    case "oldest":
      return list.sort(
        (a, b) =>
          new Date(a.pkg.createdAt).getTime() -
          new Date(b.pkg.createdAt).getTime(),
      );
    case "price-desc":
      return list.sort((a, b) => b.pkg.price - a.pkg.price);
    case "price-asc":
      return list.sort((a, b) => a.pkg.price - b.pkg.price);
    case "name-asc":
      return list.sort((a, b) =>
        a.pkg.name.localeCompare(b.pkg.name, "cs"),
      );
    case "newest":
    default:
      return list.sort(
        (a, b) =>
          new Date(b.pkg.createdAt).getTime() -
          new Date(a.pkg.createdAt).getTime(),
      );
  }
}
