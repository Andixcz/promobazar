import {
  DELIVERY_OPTIONS,
  PACKAGE_FORMATS,
  PACKAGE_LICENSE_OPTIONS,
} from "@/lib/dashboard/categories";

export function revisionsLabel(count: number) {
  if (count === 0) return "Bez revize";
  if (count === 1) return "1 revize";
  if (count < 5) return `${count} revize`;
  return `${count} revizí`;
}

export function packageOptionLabel(
  options: readonly { value: string | number; label: string }[],
  value: string | number,
) {
  return options.find((o) => String(o.value) === String(value))?.label ?? String(value);
}

export type PackagePreviewFields = {
  name: string;
  format: string;
  deliveryDays: number;
  revisions: number;
  licenseDays: string;
  priceCzk: number;
  description: string;
  showcaseUrls: string[];
  bannerUrl: string | null;
  previewVideoUrl: string;
};

export function formatPackagePrice(priceCzk: number) {
  if (!Number.isFinite(priceCzk) || priceCzk <= 0) {
    return "Bez ceny";
  }
  return `${priceCzk.toLocaleString("cs-CZ")} Kč`;
}

export function packagePreviewMeta(fields: PackagePreviewFields) {
  return {
    format: packageOptionLabel(PACKAGE_FORMATS, fields.format),
    delivery: `Doručení ${packageOptionLabel(DELIVERY_OPTIONS, fields.deliveryDays)}`,
    revisions: revisionsLabel(fields.revisions),
    license: `Licence ${packageOptionLabel(PACKAGE_LICENSE_OPTIONS, fields.licenseDays)}`,
  };
}

export const PACKAGE_META_CHIP =
  "inline-flex items-center rounded-sm border border-white/[0.09] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-mist";

export const PACKAGE_META_CHIP_ACCENT =
  "inline-flex items-center rounded-sm border border-cyan/25 bg-cyan/[0.07] px-2 py-0.5 text-[11px] font-medium text-cyan";

import type { CreatorPackageStatus } from "@/lib/db/schema";

export function packageStatusLabel(status: CreatorPackageStatus) {
  if (status === "published") return "Aktivní";
  if (status === "private") return "Neaktivní";
  return "Koncept";
}

export const DEFAULT_PACKAGE_EDITOR_VALUES: PackagePreviewFields = {
  name: "",
  format: "reel",
  deliveryDays: 7,
  revisions: 1,
  licenseDays: "30",
  priceCzk: 0,
  description: "",
  showcaseUrls: [],
  bannerUrl: null,
  previewVideoUrl: "",
};
