"use client";

import {
  Eye,
  Package,
  Pause,
  Pencil,
  Play,
  Plus,
  Rocket,
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
  surface,
  switcherActive,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";
import type { creatorPackage, CreatorPackageStatus } from "@/lib/db/schema";

type PackageRow = typeof creatorPackage.$inferSelect;

type FilterTab = "all" | "published" | "draft" | "private";

const packageCardActionClass =
  "size-8 text-mist hover:bg-white/[0.06] hover:text-white";

const tabEmptyCopy: Record<
  Exclude<FilterTab, "all">,
  { title: string; hint: string }
> = {
  published: {
    title: "Žádné aktivní balíčky",
    hint: "Aktivní balíčky vidí značky v tržišti. Publikuj koncept nebo znovu zapni neaktivní.",
  },
  private: {
    title: "Žádné neaktivní balíčky",
    hint: "Tady jsou balíčky mimo tržiště. Kdykoli je můžeš znovu aktivovat.",
  },
  draft: {
    title: "Žádné koncepty",
    hint: "Koncept uložíš bez publikace. Doladíš náhled a teprve pak ho pustíš ven.",
  },
};

export function CreatorNewPackageLink({ stripeReady }: { stripeReady: boolean }) {
  return (
    <Link
      href={dashboardPackageNewPath()}
      className={cn(
        buttonVariants({ size: "sm" }),
        !stripeReady && "pointer-events-none opacity-40",
      )}
    >
      <Plus className="size-4" aria-hidden />
      Nový balíček
    </Link>
  );
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
      <div className={cn(!stripeReady && "pointer-events-none select-none opacity-40")}>
        {packages.length > 0 ? (
          <div
            role="tablist"
            aria-label="Filtr balíčků"
            className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-white/[0.09] bg-panel p-1"
          >
            {(
              [
                ["all", "Vše", null],
                ["published", "Aktivní", publishedCount],
                ["private", "Neaktivní", privateCount],
                ["draft", "Koncepty", draftCount],
              ] as const
            ).map(([value, label, count]) => {
              const selected = tab === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-cyan/35 sm:text-sm",
                    selected
                      ? switcherActive
                      : "text-white/75 hover:bg-white/[0.06] hover:text-white",
                  )}
                  onClick={() => setTab(value)}
                >
                  {label}
                  {count !== null ? (
                    <span
                      className={cn(
                        "min-w-[1.25rem] rounded px-1 text-center text-[11px] font-normal tabular-nums sm:text-xs",
                        selected
                          ? "bg-void/15 text-void"
                          : "bg-white/[0.06] text-mist",
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                </button>
              );
            })}
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
        ) : filtered.length === 0 && tab !== "all" ? (
          <div className={cn(emptyState, "mt-6 px-6 py-10 md:py-12")}>
            <Package
              className={cn(emptyStateAccentIcon, "mb-4 size-8")}
              strokeWidth={1.5}
              aria-hidden
            />
            <p className={cn(emptyStateTitle, "text-base md:text-lg")}>
              {tabEmptyCopy[tab].title}
            </p>
            <p className={cn(emptyStateSubtitle, "mt-2 max-w-sm text-zinc-300")}>
              {tabEmptyCopy[tab].hint}
            </p>
            <div className={emptyStateActions}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTab("all")}
              >
                Zobrazit vše
              </Button>
              {tab === "draft" ? (
                <Link
                  href={dashboardPackageNewPath()}
                  className={buttonVariants({ size: "sm" })}
                >
                  <Plus className="size-4" aria-hidden />
                  Nový balíček
                </Link>
              ) : null}
            </div>
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
              const statusActionLabel = isPublished
                ? "Deaktivovat"
                : isPrivate
                  ? "Aktivovat"
                  : "Publikovat";
              const StatusIcon = isPublished ? Pause : isPrivate ? Play : Rocket;

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
                        <span className={PACKAGE_META_CHIP}>
                          {revisionsLabel(pkg.revisions)}
                        </span>
                      </div>
                      <p className="font-display text-lg font-bold tabular-nums text-white">
                        {formatPackagePrice(pkg.priceCzk)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] px-2 py-1.5">
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={packageCardActionClass}
                          asChild
                        >
                          <Link
                            href={dashboardPackageEditPath(pkg.id)}
                            title="Upravit"
                            aria-label="Upravit balíček"
                          >
                            <Pencil className="size-4" strokeWidth={1.75} aria-hidden />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={packageCardActionClass}
                          asChild
                        >
                          <Link
                            href={previewHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Náhled"
                            aria-label="Náhled balíčku"
                          >
                            <Eye className="size-4" strokeWidth={1.75} aria-hidden />
                          </Link>
                        </Button>
                      </div>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={pending}
                          title={statusActionLabel}
                          aria-label={statusActionLabel}
                          className={cn(
                            packageCardActionClass,
                            !isPublished &&
                              "text-cyan hover:bg-cyan/10 hover:text-cyan",
                          )}
                          onClick={() =>
                            setPackageStatus(
                              pkg,
                              isPublished ? "private" : "published",
                            )
                          }
                        >
                          <StatusIcon className="size-4" strokeWidth={1.75} aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={pending}
                          title="Smazat"
                          aria-label="Smazat balíček"
                          className={cn(
                            packageCardActionClass,
                            "hover:bg-rose/10 hover:text-rose",
                          )}
                          onClick={() => setDeleting(pkg)}
                        >
                          <Trash2 className="size-4" strokeWidth={1.75} aria-hidden />
                        </Button>
                      </div>
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleting(null)}
            >
              Zrušit
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={pending}
              onClick={onConfirmDelete}
            >
              <Trash2 className="size-4" aria-hidden />
              {pending ? "Mažu…" : "Smazat"}
            </Button>
          </>
        }
      />
    </>
  );
}
