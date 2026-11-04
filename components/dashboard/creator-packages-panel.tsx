"use client";

import {
  Eye,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  deleteCreatorPackage,
  setCreatorPackageStatus,
} from "@/app/dashboard/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  PackageStatusBadge,
  packagePublicPreviewQuery,
} from "@/components/dashboard/package-status-badge";
import { StripeConnectRequiredModal } from "@/components/dashboard/stripe-connect-required-modal";
import {
  formatPackagePrice,
  packageOptionLabel,
  PACKAGE_META_CHIP,
  revisionsLabel,
} from "@/lib/dashboard/package-display";
import {
  dashboardPackageEditPath,
  dashboardPackageNewPath,
  packagePublicPath,
} from "@/lib/dashboard/package-paths";
import { creatorPublicPath } from "@/lib/marketplace/public-routes";
import {
  DELIVERY_OPTIONS,
  PACKAGE_FORMATS,
} from "@/lib/dashboard/categories";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import {
  emptyState,
  emptyStateActions,
  emptyStateAccentIcon,
  emptyStateSubtitle,
  emptyStateTitle,
  htmlButtonPill,
  resultCount,
  surface,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";
import type { creatorPackage, CreatorPackageStatus } from "@/lib/db/schema";

type PackageRow = typeof creatorPackage.$inferSelect;

type FilterTab = "all" | "published" | "draft" | "private";

function packagesCountLabel(count: number, tab: FilterTab) {
  if (tab === "published") {
    if (count === 0) return "Žádné aktivní balíčky";
    if (count === 1) return "1 aktivní balíček";
    return `${count} aktivních balíčků`;
  }
  if (tab === "draft") {
    if (count === 0) return "Žádné koncepty";
    if (count === 1) return "1 koncept";
    return `${count} konceptů`;
  }
  if (tab === "private") {
    if (count === 0) return "Žádné neaktivní balíčky";
    if (count === 1) return "1 neaktivní balíček";
    return `${count} neaktivních balíčků`;
  }
  if (count === 0) return "Žádné balíčky";
  if (count === 1) return "1 balíček";
  if (count < 5) return `${count} balíčky`;
  return `${count} balíčků`;
}

export function CreatorPackagesPanel({
  profile,
  packages,
}: {
  profile: MemberProfileRow;
  packages: PackageRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<PackageRow | null>(null);
  const [tab, setTab] = useState<FilterTab>("all");
  const stripeReady = profile.stripeTransfersStatus === "active";

  const filtered = useMemo(() => {
    if (tab === "published") {
      return packages.filter((p) => p.status === "published");
    }
    if (tab === "draft") {
      return packages.filter((p) => p.status === "draft");
    }
    if (tab === "private") {
      return packages.filter((p) => p.status === "private");
    }
    return packages;
  }, [packages, tab]);

  const publishedCount = packages.filter((p) => p.status === "published").length;
  const draftCount = packages.filter((p) => p.status === "draft").length;
  const privateCount = packages.filter((p) => p.status === "private").length;

  function onConfirmDelete() {
    if (!deleting) return;
    const id = deleting.id;
    startTransition(async () => {
      await deleteCreatorPackage(id);
      setDeleting(null);
      router.refresh();
    });
  }

  function setPackageStatus(pkg: PackageRow, next: CreatorPackageStatus) {
    startTransition(async () => {
      await setCreatorPackageStatus(pkg.id, next);
      router.refresh();
    });
  }

  return (
    <>
      <StripeConnectRequiredModal stripeTransfersStatus={profile.stripeTransfersStatus} />

      <div className={cn(!stripeReady && "pointer-events-none select-none opacity-40")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <span className={resultCount}>
              {packagesCountLabel(filtered.length, tab)}
            </span>
            <p className="max-w-lg text-sm leading-relaxed text-mist">
              Spravuj gigy jako na Fiverru: koncept, náhled, publikace na{" "}
              <Link
                href={creatorPublicPath(profile.slug)}
                className="text-cyan hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                veřejném profilu
              </Link>
              .
            </p>
          </div>
          <Link
            href={dashboardPackageNewPath()}
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="size-4" aria-hidden />
            Nový balíček
          </Link>
        </div>

        {packages.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {(
              [
                ["all", "Vše"],
                ["published", `Aktivní (${publishedCount})`],
                ["private", `Neaktivní (${privateCount})`],
                ["draft", `Koncepty (${draftCount})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={cn(htmlButtonPill, tab === value && "active")}
                onClick={() => setTab(value)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {packages.length === 0 ? (
          <div className={cn(emptyState, "mt-6")}>
            <Package className={emptyStateAccentIcon} strokeWidth={1.5} aria-hidden />
            <p className={emptyStateTitle}>Zatím nemáš žádné balíčky</p>
            <p className={emptyStateSubtitle}>
              Vytvoř první gig. Uloží se jako koncept, zkontroluj živý náhled a
              teprve pak ho publikuj.
            </p>
            <div className={emptyStateActions}>
              <Link
                href={dashboardPackageNewPath()}
                className={buttonVariants({ size: "sm" })}
              >
                <Plus className="size-4" aria-hidden />
                Vytvořit balíček
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className={cn(surface, "mt-6 px-6 py-12 text-center text-sm text-mist")}>
            V této záložce nic není.
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((pkg) => {
              const previewHref = packagePublicPath(
                profile.slug,
                pkg.id,
                packagePublicPreviewQuery(pkg.status),
              );
              const thumb = pkg.bannerUrl ?? pkg.showcaseUrls?.[0] ?? null;
              const isPublished = pkg.status === "published";
              const isPrivate = pkg.status === "private";

              return (
                <li key={pkg.id}>
                  <article
                    className={cn(
                      surface,
                      "flex h-full flex-col overflow-hidden p-0 transition-colors hover:border-cyan/30",
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06] bg-white/[0.03]">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-xs text-mist">
                          Bez náhledu
                        </div>
                      )}
                      <PackageStatusBadge
                        status={pkg.status}
                        className="absolute top-2.5 left-2.5"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                      <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-white">
                        {pkg.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        <span className={PACKAGE_META_CHIP}>
                          {packageOptionLabel(PACKAGE_FORMATS, pkg.format)}
                        </span>
                        <span className={PACKAGE_META_CHIP}>
                          {packageOptionLabel(DELIVERY_OPTIONS, pkg.deliveryDays)}
                        </span>
                      </div>
                      <p className="font-display text-lg font-bold tabular-nums text-white">
                        {formatPackagePrice(pkg.priceCzk)}
                      </p>
                      <p className="line-clamp-2 text-xs leading-relaxed text-mist">
                        {revisionsLabel(pkg.revisions)} · {pkg.description}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/[0.08] px-4 py-3">
                      <Link
                        href={dashboardPackageEditPath(pkg.id)}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                        Upravit
                      </Link>
                      <Button type="button" variant="outline" size="sm" asChild>
                        <Link
                          href={previewHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="size-3.5" aria-hidden />
                          Náhled
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant={isPublished ? "ghost" : "default"}
                        size="sm"
                        disabled={pending}
                        className="ml-auto"
                        onClick={() =>
                          setPackageStatus(
                            pkg,
                            isPublished ? "private" : "published",
                          )
                        }
                      >
                        <MoreHorizontal className="size-3.5" aria-hidden />
                        {isPublished
                          ? "Deaktivovat"
                          : isPrivate
                            ? "Aktivovat"
                            : "Publikovat"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        className="border-rose/30 text-rose hover:border-rose/45 hover:bg-rose/10"
                        onClick={() => setDeleting(pkg)}
                        aria-label="Smazat balíček"
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                      </Button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Smazat balíček?"
        description={
          deleting
            ? `Balíček „${deleting.name}“ zmizí z profilu. Existující objednávky zůstanou beze změny.`
            : undefined
        }
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setDeleting(null)}>
              Zrušit
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              className="border-rose/40 text-rose hover:bg-rose/10"
              onClick={onConfirmDelete}
            >
              {pending ? "Mažu…" : "Smazat"}
            </Button>
          </>
        }
      />
    </>
  );
}
