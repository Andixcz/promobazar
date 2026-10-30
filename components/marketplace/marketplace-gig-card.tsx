import Link from "next/link";

import { MarketplaceCardCarousel } from "@/components/marketplace/marketplace-card-carousel";
import { formatPackagePrice } from "@/lib/dashboard/package-display";
import type { MarketplaceCreator } from "@/lib/marketplace";
import { platformLabel } from "@/lib/marketplace";
import {
  creatorPublicPath,
  packagePublicPath,
} from "@/lib/marketplace/public-routes";
import { avatarPlaceholder, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

export type MarketplaceGigListing = {
  creator: MarketplaceCreator;
  pkg: MarketplaceCreator["packages"][number];
};

export function packageListingGalleryUrls(
  pkg: Pick<
    MarketplaceCreator["packages"][number],
    "bannerUrl" | "showcaseUrls"
  >,
): string[] {
  const showcase = pkg.showcaseUrls ?? [];
  const urls = [
    ...(pkg.bannerUrl ? [pkg.bannerUrl] : []),
    ...showcase.filter((url) => url !== pkg.bannerUrl),
  ];
  return urls;
}

export function flattenCreatorGigs(
  creators: MarketplaceCreator[],
): MarketplaceGigListing[] {
  return creators.flatMap((creator) =>
    creator.packages.map((pkg) => ({ creator, pkg })),
  );
}

type MarketplaceGigCardProps = {
  listing: MarketplaceGigListing;
};

export function MarketplaceGigCard({ listing }: MarketplaceGigCardProps) {
  const { creator, pkg } = listing;
  const href = packagePublicPath(creator.slug, pkg.id);
  const profileHref = creatorPublicPath(creator.slug);
  const gallery = packageListingGalleryUrls(pkg);
  const formatKey = pkg.format ?? creator.platforms[0];
  const formatLabel = formatKey ? platformLabel(formatKey) : null;

  return (
    <article
      className={cn(
        surface,
        "group flex flex-col overflow-hidden p-0 transition-colors hover:border-cyan/35",
        creator.isPro && "border-cyan/30",
      )}
    >
      <Link href={href} className="block">
        <MarketplaceCardCarousel urls={gallery} />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5 pt-3">
        <Link
          href={profileHref}
          className="flex min-w-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
        >
          <div
            className={cn(
              "size-7 shrink-0 overflow-hidden rounded-full",
              !creator.avatarUrl && avatarPlaceholder,
            )}
          >
            {creator.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={creator.avatarUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-[10px] font-bold">
                {creator.initials}
              </span>
            )}
          </div>
          <span className="min-w-0 truncate text-xs font-medium text-zinc-200">
            {creator.name}
          </span>
          {creator.isPro ? (
            <span className="shrink-0 rounded-sm bg-cyan/15 px-1.5 py-0.5 text-[10px] font-medium text-cyan">
              PRO
            </span>
          ) : null}
        </Link>

        <Link href={href} className="block min-w-0 flex-1 outline-none">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white group-hover:text-cyan">
            {pkg.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="min-w-0">
            {formatLabel ? (
              <p className="truncate text-[11px] text-mist">{formatLabel}</p>
            ) : (
              <p className="truncate text-[11px] text-mist">
                {creator.categoryLabel}
              </p>
            )}
          </div>
          <p className="shrink-0 text-right">
            <span className="block text-[10px] uppercase tracking-wide text-mist">
              od
            </span>
            <span className="font-display text-base font-bold tabular-nums text-white">
              {formatPackagePrice(pkg.price)}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
