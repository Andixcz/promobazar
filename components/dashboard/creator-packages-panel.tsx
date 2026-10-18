"use client";

import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteCreatorPackage } from "@/app/dashboard/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  PACKAGE_META_CHIP,
  PACKAGE_META_CHIP_ACCENT,
  packageOptionLabel,
  revisionsLabel,
} from "@/lib/dashboard/package-display";
import {
  dashboardPackageEditPath,
  dashboardPackageNewPath,
} from "@/lib/dashboard/package-paths";
import {
  DELIVERY_OPTIONS,
  PACKAGE_FORMATS,
  PACKAGE_LICENSE_OPTIONS,
} from "@/lib/dashboard/categories";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import {
  emptyState,
  emptyStateIcon,
  resultCount,
  surface,
} from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";
import type { creatorPackage } from "@/lib/db/schema";

type PackageRow = typeof creatorPackage.$inferSelect;

function packagesCountLabel(count: number) {
  if (count === 0) return "Žádné balíčky";
  if (count === 1) return "1 balíček";
  if (count < 5) return `${count} balíčky`;
  return `${count} balíčků`;
}

export function CreatorPackagesPanel({
  packages,
}: {
  profile: MemberProfileRow;
  packages: PackageRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<PackageRow | null>(null);

  function onConfirmDelete() {
    if (!deleting) return;
    const id = deleting.id;
    startTransition(async () => {
      await deleteCreatorPackage(id);
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className={resultCount}>{packagesCountLabel(packages.length)}</span>
        {packages.length > 0 ? (
          <Link
            href={dashboardPackageNewPath()}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <Plus className="size-4" aria-hidden />
            Nový balíček
          </Link>
        ) : null}
      </div>

      <div className={cn(surface, "mt-5 overflow-hidden")}>
        {packages.length === 0 ? (
          <div className={emptyState}>
            <div className={emptyStateIcon}>
              <Package className="size-5" strokeWidth={1.5} aria-hidden />
            </div>
            <p className="font-display text-base font-semibold text-white">
              Zatím nemáš žádné balíčky
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
              Přidej nabídku s cenou a formátem. Značky ji uvidí na tvém profilu v tržišti.
            </p>
            <Link
              href={dashboardPackageNewPath()}
              className={cn(buttonVariants({ size: "sm" }), "mt-6")}
            >
              <Plus className="size-4" aria-hidden />
              Vytvořit balíček
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.08]">
            {packages.map((pkg) => (
              <li key={pkg.id} className="space-y-3 px-5 py-4 md:px-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="font-display text-base font-semibold text-white">
                      {pkg.name}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className={PACKAGE_META_CHIP}>
                        {packageOptionLabel(PACKAGE_FORMATS, pkg.format)}
                      </span>
                      <span className={PACKAGE_META_CHIP}>
                        Doručení {packageOptionLabel(DELIVERY_OPTIONS, pkg.deliveryDays)}
                      </span>
                      <span className={PACKAGE_META_CHIP}>
                        {revisionsLabel(pkg.revisions)}
                      </span>
                      <span className={PACKAGE_META_CHIP_ACCENT}>
                        Licence {packageOptionLabel(PACKAGE_LICENSE_OPTIONS, pkg.licenseDays)}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-zinc-300">
                      {pkg.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-white">
                    {pkg.priceCzk.toLocaleString("cs-CZ")} Kč
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={dashboardPackageEditPath(pkg.id)}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Upravit
                  </Link>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={pending}
                    onClick={() => setDeleting(pkg)}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Smazat
                  </Button>
                </div>
              </li>
            ))}
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
              variant="destructive"
              disabled={pending}
              onClick={onConfirmDelete}
            >
              {pending ? "Mažu…" : "Smazat"}
            </Button>
          </>
        }
      />
    </div>
  );
}
