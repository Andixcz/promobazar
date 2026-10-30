import Link from "next/link";

import { PackageGigOrderBox, PackageGigTierTabs } from "@/components/marketplace/package-gig-order-box";
import {
  PackageGigAboutSection,
  PackageGigSellerSection,
} from "@/components/marketplace/package-gig-detail-sections";
import { PackagePreviewVideo } from "@/components/marketplace/package-preview-video";
import { PackageShowcaseCarousel } from "@/components/marketplace/package-showcase-carousel";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/ui/markdown-content";
import {
  PACKAGE_META_CHIP,
  PACKAGE_META_CHIP_ACCENT,
  packagePreviewMeta,
} from "@/lib/dashboard/package-display";
import { avatarPlaceholder, profileBannerAspect, profileBannerPlaceholder, surface } from "@/lib/ui-surfaces";
import { creatorPublicPath } from "@/lib/marketplace/public-routes";
import {
  marketplaceGigAside,
  marketplaceGigGrid,
  marketplaceGigMain,
  marketplacePageShell,
} from "@/lib/marketplace/public-layout";
import type {
  PublicCreatorProfile,
  PublicPackageRow,
} from "@/lib/marketplace/public-server";
import { cn } from "@/lib/utils";

type CreatorPublicViewProps = {
  creator: PublicCreatorProfile;
  packages: PublicPackageRow[];
  isOwnerView?: boolean;
};

export function CreatorPublicView({
  creator,
  packages,
  isOwnerView,
}: CreatorPublicViewProps) {
  const published = packages.filter((p) => p.status === "published");
  const inactive = isOwnerView
    ? packages.filter((p) => p.status === "private")
    : [];
  const drafts = isOwnerView
    ? packages.filter((p) => p.status === "draft")
    : [];
  const publishedCount = published.length;

  return (
    <main className="px-5 md:px-8">
      <div className={marketplacePageShell}>
      <header className={cn(surface, "overflow-hidden")}>
        <div className={cn(profileBannerAspect, "relative overflow-hidden")}>
          {creator.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creator.bannerUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className={cn("absolute inset-0", profileBannerPlaceholder)} aria-hidden />
          )}
        </div>

        <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
          <div
            className={cn(
              "relative -mt-12 size-24 shrink-0 overflow-hidden rounded-full border-4 border-panel sm:-mt-14 sm:size-28",
              !creator.avatarUrl && avatarPlaceholder,
            )}
          >
            {creator.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={creator.avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center font-display text-xl font-bold">
                {creator.initials}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="break-words font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {creator.displayName}
              </h1>
              <p className="mt-2 text-base text-zinc-200">{creator.categoryLabel}</p>
              <p className="mt-3 text-sm text-mist">
                {publishedCount > 0 ? (
                  <>
                    <span className="font-semibold tabular-nums text-white">{publishedCount}</span>{" "}
                    {publishedCount === 1
                      ? "aktivní balíček k objednání"
                      : publishedCount < 5
                        ? "aktivní balíčky k objednání"
                        : "aktivních balíčků k objednání"}
                  </>
                ) : (
                  "Zatím žádný publikovaný balíček."
                )}
              </p>
            </div>
            {publishedCount > 0 ? (
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href="#balicky">Prohlédnout balíčky</a>
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mt-10 border-t border-white/[0.08] pt-8 md:mt-14 md:pt-10">
        <h2 className="font-display text-2xl font-semibold text-white">O tvůrci</h2>
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="text-xs font-medium text-mist">Kategorie</dt>
            <dd className="mt-1 text-sm font-semibold text-white">{creator.categoryLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-mist">Aktivní balíčky</dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums text-white">{publishedCount}</dd>
          </div>
        </dl>
        {creator.bio ? (
          <MarkdownContent content={creator.bio} className="mt-5 max-w-3xl sm:text-base" />
        ) : (
          <p className="mt-5 text-sm text-mist">Tvůrce zatím nepřidal popis profilu.</p>
        )}
      </section>

      <section id="balicky" className="mt-10 scroll-mt-32 border-t border-white/[0.08] pt-8 md:mt-14 md:pt-10">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-semibold text-white">Balíčky</h2>
          {publishedCount > 0 ? (
            <p className="mt-1 text-sm text-mist">Vyber si spolupráci, která ti vyhovuje.</p>
          ) : null}
        </div>

        <PackageTierGrid
          creatorSlug={creator.slug}
          items={published}
          emptyLabel="Zatím žádný aktivní balíček."
        />

        {inactive.length > 0 ? (
          <div className="mt-8 space-y-3 border-t border-white/[0.08] pt-8">
            <h3 className="text-sm font-medium text-zinc-300">
              Neaktivní (vidíš jen ty)
            </h3>
            <PackageTierGrid
              creatorSlug={creator.slug}
              items={inactive}
              emptyLabel=""
            />
          </div>
        ) : null}

        {drafts.length > 0 ? (
          <div className="mt-8 space-y-3 border-t border-white/[0.08] pt-8">
            <h3 className="text-sm font-medium text-amber-100/90">
              Koncepty (vidíš jen ty)
            </h3>
            <PackageTierGrid
              creatorSlug={creator.slug}
              items={drafts}
              preview
              emptyLabel=""
            />
          </div>
        ) : null}
      </section>
      </div>
    </main>
  );
}

function PackageTierGrid({
  creatorSlug,
  items,
  preview,
  emptyLabel,
}: {
  creatorSlug: string;
  items: PublicPackageRow[];
  preview?: boolean;
  emptyLabel: string;
}) {
  if (!items.length) {
    return emptyLabel ? (
      <p className="text-sm text-mist">{emptyLabel}</p>
    ) : null;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),22rem))] justify-start gap-2">
      {items.map((pkg) => {
        const meta = packagePreviewMeta({
          name: pkg.name,
          format: pkg.format,
          deliveryDays: pkg.deliveryDays,
          revisions: pkg.revisions,
          licenseDays: pkg.licenseDays,
          priceCzk: pkg.priceCzk,
          description: pkg.description,
          showcaseUrls: pkg.showcaseUrls,
          bannerUrl: pkg.bannerUrl,
          previewVideoUrl: pkg.previewVideoUrl ?? "",
        });
        const href = `/tvurce/${encodeURIComponent(creatorSlug)}/balicek/${encodeURIComponent(pkg.id)}${preview ? "?preview=1" : ""}`;
        const image = pkg.bannerUrl ?? pkg.showcaseUrls[0] ?? null;

        return (
          <Link
            key={pkg.id}
            href={href}
            className={cn(
              surface,
              "group flex flex-col overflow-hidden transition-colors hover:border-cyan/35",
            )}
          >
            <div className="aspect-video bg-white/[0.03]">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-xs text-mist">
                  Bez náhledu
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display font-semibold leading-snug text-white group-hover:text-cyan">
                  {pkg.name}
                </p>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {pkg.priceCzk.toLocaleString("cs-CZ")} Kč
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className={PACKAGE_META_CHIP}>{meta.format}</span>
                <span className={PACKAGE_META_CHIP_ACCENT}>{meta.delivery}</span>
              </div>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-200">
                {pkg.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

type PackageGigViewProps = {
  creator: PublicCreatorProfile;
  pkg: PublicPackageRow;
  siblingPackages: { id: string; name: string; priceCzk: number }[];
  otherPackages: PublicPackageRow[];
  previewMode: boolean;
  privateMode?: boolean;
};

export function PackageGigView({
  creator,
  pkg,
  siblingPackages,
  otherPackages,
  previewMode,
  privateMode,
}: PackageGigViewProps) {
  const meta = packagePreviewMeta({
    name: pkg.name,
    format: pkg.format,
    deliveryDays: pkg.deliveryDays,
    revisions: pkg.revisions,
    licenseDays: pkg.licenseDays,
    priceCzk: pkg.priceCzk,
    description: pkg.description,
    showcaseUrls: pkg.showcaseUrls,
    bannerUrl: pkg.bannerUrl,
    previewVideoUrl: pkg.previewVideoUrl ?? "",
  });
  const gallery = [
    ...(pkg.bannerUrl ? [pkg.bannerUrl] : []),
    ...pkg.showcaseUrls.filter((url) => url !== pkg.bannerUrl),
  ];

  return (
    <div className={marketplacePageShell}>
      {privateMode ? (
        <div className="mb-6 mx-3 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-zinc-200 md:mx-4">
          Balíček je neaktivní. Zákazníci ho v tržišti neuvidí, dokud ho znovu
          neaktivuješ.
        </div>
      ) : null}
      {previewMode ? (
        <div className="mb-6 mx-3 rounded-md border border-amber-400/30 bg-amber-400/[0.08] px-4 py-3 text-sm text-amber-50 md:mx-4">
          Živý náhled konceptu. Zákazníci tuto stránku neuvidí, dokud balíček
          nepublikuješ.
        </div>
      ) : null}

      <nav className="mb-6 text-sm text-mist md:mb-8">
        <Link href={creatorPublicPath(creator.slug)} className="hover:text-white">
          {creator.displayName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white">{pkg.name}</span>
      </nav>

      <header className="mb-2 space-y-4 pb-6">
        <PackageGigTierTabs
          packages={siblingPackages}
          activeId={pkg.id}
          creatorSlug={creator.slug}
          preview={previewMode}
        />
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-[1.75rem] lg:text-3xl">
            {pkg.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className={PACKAGE_META_CHIP}>{meta.format}</span>
            <span className={PACKAGE_META_CHIP}>{meta.delivery}</span>
            <span className={PACKAGE_META_CHIP}>{meta.revisions}</span>
            <span className={PACKAGE_META_CHIP_ACCENT}>{meta.license}</span>
          </div>
        </div>
      </header>

      <div className={marketplaceGigGrid}>
        <div className={marketplaceGigMain}>
          {gallery.length > 0 ? (
            <PackageShowcaseCarousel urls={gallery} />
          ) : null}

          {pkg.previewVideoUrl ? (
            <PackagePreviewVideo url={pkg.previewVideoUrl} />
          ) : null}

          <PackageGigAboutSection description={pkg.description} />

          <PackageGigSellerSection creator={creator} />
        </div>

        <aside className={marketplaceGigAside}>
          <PackageGigOrderBox
            creatorSlug={creator.slug}
            packageId={pkg.id}
            name={pkg.name}
            priceCzk={pkg.priceCzk}
            deliveryDays={pkg.deliveryDays}
            revisions={pkg.revisions}
            format={pkg.format}
            licenseDays={pkg.licenseDays}
            previewMode={previewMode}
            privateMode={privateMode}
            checkoutDisabled={
              previewMode || !!privateMode || pkg.status !== "published"
            }
          />
        </aside>
      </div>

      {otherPackages.length > 0 ? (
        <section className="mt-12 border-t border-white/[0.08] pt-10 md:mt-14 md:pt-12">
          <h2 className="font-display text-xl font-semibold text-white">
            Další balíčky tvůrce
          </h2>
          <PackageTierGrid
            creatorSlug={creator.slug}
            items={otherPackages}
            preview={previewMode}
            emptyLabel=""
          />
        </section>
      ) : null}
    </div>
  );
}
