"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";

import {
  flattenCreatorGigs,
  MarketplaceGigCard,
} from "@/components/marketplace/marketplace-gig-card";
import { Button } from "@/components/ui/button";
import { AUTH_REGISTER_PATH } from "@/lib/auth-routes";
import {
  filterMarketplaceCreators,
  sortMarketplaceGigs,
  type MarketplaceCreator,
  type MarketplaceFilters,
} from "@/lib/marketplace";
import { filterMarketplaceGigsByQuery } from "@/lib/marketplace/gig-search";
import {
  emptyState,
  emptyStateActions,
  emptyStateIcon,
  emptyStateSubtitle,
  emptyStateTitle,
  htmlButtonOutline,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type MarketplaceGigResultsProps = {
  creators: MarketplaceCreator[];
  filters: MarketplaceFilters;
  onResetFilters: () => void;
  /** Homepage náhled — pevný strop. */
  limit?: number;
  /** Dávkové načítání (scroll / tlačítko). */
  pageSize?: number;
};

export function MarketplaceGigResults({
  creators,
  filters,
  onResetFilters,
  limit,
  pageSize,
}: MarketplaceGigResultsProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  const [visibleCount, setVisibleCount] = useState(
    () => pageSize ?? Number.POSITIVE_INFINITY,
  );

  const gigs = useMemo(() => {
    const filtered = filterMarketplaceCreators(creators, filters);
    let list = flattenCreatorGigs(filtered);
    if (filters.query.trim()) {
      list = filterMarketplaceGigsByQuery(list, filters.query);
    }
    return sortMarketplaceGigs(list, filters.sort);
  }, [creators, filters]);

  useEffect(() => {
    if (pageSize != null) {
      setVisibleCount(pageSize);
    }
  }, [filterKey, pageSize]);

  const visibleGigs = useMemo(() => {
    if (limit != null) return gigs.slice(0, limit);
    if (pageSize != null) return gigs.slice(0, visibleCount);
    return gigs;
  }, [gigs, limit, pageSize, visibleCount]);

  const hasMore =
    pageSize != null && visibleGigs.length < gigs.length && limit == null;

  const loadMore = useCallback(() => {
    if (pageSize == null) return;
    setVisibleCount((prev) => Math.min(prev + pageSize, gigs.length));
  }, [gigs.length, pageSize]);

  useEffect(() => {
    if (!hasMore) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, visibleGigs.length]);

  const hasQuery = filters.query.trim().length > 0;
  const totalCreators = creators.length;
  const emptyCatalog = totalCreators === 0;

  return (
    <>
      {gigs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleGigs.map((listing) => (
              <MarketplaceGigCard
                key={`${listing.creator.slug}-${listing.pkg.id}`}
                listing={listing}
              />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              <Button type="button" variant="outline" onClick={loadMore}>
                Načíst další · zbývá {gigs.length - visibleGigs.length}
              </Button>
              <div ref={loadMoreRef} className="h-px w-full" aria-hidden />
            </div>
          ) : null}
        </>
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
              : hasQuery
                ? "Na tohle hledání nic nemáme"
                : "Žádná nabídka neodpovídá filtru"}
          </h3>
          <p className={emptyStateSubtitle}>
            {emptyCatalog
              ? "Jsi influencer nebo UGC tvůrce? Vytvoř si profil a buď mezi prvními na tržišti."
              : hasQuery
                ? "Zkus jiné slovo, kratší dotaz, nebo uprav filtry vedle."
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
              <Button type="button" variant="outline" onClick={onResetFilters}>
                Resetovat filtry
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
