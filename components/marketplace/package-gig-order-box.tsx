"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { PackageOrderSummary } from "@/components/marketplace/package-order-summary";
import { Button } from "@/components/ui/button";
import { packageOrderPath } from "@/lib/marketplace/public-routes";
import { cn } from "@/lib/utils";

type PackageGigOrderBoxProps = {
  creatorSlug: string;
  packageId: string;
  name: string;
  priceCzk: number;
  deliveryDays: number;
  revisions: number;
  format: string;
  licenseDays: string;
  previewMode?: boolean;
  privateMode?: boolean;
  checkoutDisabled?: boolean;
  className?: string;
};

export function PackageGigOrderBox({
  creatorSlug,
  packageId,
  name,
  priceCzk,
  deliveryDays,
  revisions,
  format,
  licenseDays,
  previewMode,
  privateMode,
  checkoutDisabled,
  className,
}: PackageGigOrderBoxProps) {
  const orderHref = packageOrderPath(creatorSlug, packageId);
  const canOrder = !previewMode && !privateMode && !checkoutDisabled;

  return (
    <PackageOrderSummary
      heading="Objednat balíček"
      name={name}
      priceCzk={priceCzk}
      deliveryDays={deliveryDays}
      revisions={revisions}
      format={format}
      licenseDays={licenseDays}
      className={className}
      footer={
        previewMode ? (
          <div className="rounded-md border border-amber-400/25 bg-amber-400/[0.08] px-3.5 py-3 text-sm leading-relaxed text-amber-50">
            Náhled konceptu. Objednávka je vypnutá, dokud balíček nepublikuješ.
          </div>
        ) : privateMode ? (
          <div className="rounded-md border border-white/[0.1] bg-white/[0.03] px-3.5 py-3 text-sm leading-relaxed text-mist">
            Balíček je neaktivní. Objednávku zákazníci uvidí až po
            znovuaktivování.
          </div>
        ) : (
          <div className="space-y-3">
            {canOrder ? (
              <Button size="lg" className="w-full" asChild>
                <Link href={orderHref}>Pokračovat k objednávce</Link>
              </Button>
            ) : (
              <Button size="lg" className="w-full" disabled>
                Objednávka nedostupná
              </Button>
            )}
            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-mist">
              <ShieldCheck
                className="size-3.5 shrink-0 text-cyan/80"
                aria-hidden
              />
              Zadání a platba na další stránce
            </p>
          </div>
        )
      }
    />
  );
}

export function PackageGigTierTabs({
  packages,
  activeId,
  creatorSlug,
  preview,
}: {
  packages: { id: string; name: string; priceCzk: number }[];
  activeId: string;
  creatorSlug: string;
  preview?: boolean;
}) {
  if (packages.length <= 1) return null;

  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-white/[0.08] pb-px">
      {packages.map((pkg) => {
        const href = `/tvurce/${encodeURIComponent(creatorSlug)}/balicek/${encodeURIComponent(pkg.id)}${preview ? "?preview=1" : ""}`;
        const active = pkg.id === activeId;
        return (
          <Link
            key={pkg.id}
            href={href}
            className={cn(
              "relative shrink-0 px-4 py-2.5 text-sm font-medium transition-colors",
              active ? "text-white" : "text-mist hover:text-white",
            )}
          >
            <span className="line-clamp-1">{pkg.name}</span>
            <span
              className={cn(
                "mt-0.5 block text-xs tabular-nums",
                active ? "text-cyan" : "text-mist",
              )}
            >
              {pkg.priceCzk.toLocaleString("cs-CZ")} Kč
            </span>
            {active ? (
              <span
                className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-cyan"
                aria-hidden
              />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
