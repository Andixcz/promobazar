import type { ReactNode } from "react";

import {
  IllustrationIcon,
  type IllustrationIconName,
} from "@/components/ui/illustration-icon";
import {
  formatPackagePrice,
  packagePreviewMeta,
  revisionsLabel,
} from "@/lib/dashboard/package-display";
import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

function SpecRow({
  icon,
  label,
  value,
}: {
  icon: IllustrationIconName;
  label: string;
  value: string;
}) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0 py-4">
      <IllustrationIcon
        name={icon}
        className="row-span-2 h-7 w-auto self-center"
      />
      <p className="text-xs font-medium text-mist">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </li>
  );
}

export type PackageOrderSummaryProps = {
  name: string;
  priceCzk: number;
  deliveryDays: number;
  revisions: number;
  format: string;
  licenseDays: string;
  heading?: string;
  footer?: ReactNode;
  className?: string;
};

export function PackageOrderSummary({
  name,
  priceCzk,
  deliveryDays,
  revisions,
  format,
  licenseDays,
  heading = "Souhrn",
  footer,
  className,
}: PackageOrderSummaryProps) {
  const meta = packagePreviewMeta({
    name,
    format,
    deliveryDays,
    revisions,
    licenseDays,
    priceCzk,
    description: "",
    showcaseUrls: [],
    bannerUrl: null,
    previewVideoUrl: "",
  });

  const deliveryValue = meta.delivery.replace(/^Doručení /, "");
  const licenseValue = meta.license.replace(/^Licence /, "");

  return (
    <div
      className={cn(surface, "overflow-hidden p-0", className)}
    >
      <div className="border-b border-white/[0.08] px-5 py-5">
        <p className="font-display text-base font-semibold text-white">
          {heading}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-snug text-zinc-200">
          {name}
        </p>
        <p className="mt-4 font-display text-3xl font-bold tracking-tight tabular-nums text-cyan">
          {formatPackagePrice(priceCzk)}
        </p>
      </div>

      <ul className="divide-y divide-white/[0.08] px-5">
        <SpecRow icon="Clock" label="Doručení" value={deliveryValue} />
        <SpecRow
          icon="Revise"
          label="Revize"
          value={revisionsLabel(revisions)}
        />
        <SpecRow
          icon="Copyright"
          label="Licence pro reklamu"
          value={licenseValue}
        />
      </ul>

      {footer ? (
        <div className="border-t border-white/[0.08] px-5 py-5">{footer}</div>
      ) : null}
    </div>
  );
}
