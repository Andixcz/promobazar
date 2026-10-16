import {
  formatPackagePrice,
  PACKAGE_META_CHIP,
  PACKAGE_META_CHIP_ACCENT,
  packagePreviewMeta,
  type PackagePreviewFields,
} from "@/lib/dashboard/package-display";
import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type PackageCardPreviewProps = {
  fields: PackagePreviewFields;
  className?: string;
  /** Bez horní lišty — když je náhled vnořený v jiné sekci. */
  hideHeader?: boolean;
};

export function PackageCardPreview({
  fields,
  className,
  hideHeader,
}: PackageCardPreviewProps) {
  const meta = packagePreviewMeta(fields);
  const title = fields.name.trim() || "Název balíčku";
  const description = fields.description.trim() || "Popis balíčku";

  return (
    <div className={cn(surface, "overflow-hidden", className)}>
      {hideHeader ? null : (
        <p className="border-b border-white/[0.08] px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-mist">
          Náhled v tržišti
        </p>
      )}
      <div className="space-y-3 p-4 md:p-5">
        {fields.bannerUrl ? (
          <div className="aspect-[16/9] overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.03]">
            <img
              src={fields.bannerUrl}
              alt=""
              className="size-full object-cover"
            />
          </div>
        ) : null}
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 font-display text-base font-semibold leading-snug text-white">
            {title}
          </p>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-white">
            {formatPackagePrice(fields.priceCzk)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={PACKAGE_META_CHIP}>{meta.format}</span>
          <span className={PACKAGE_META_CHIP}>{meta.delivery}</span>
          <span className={PACKAGE_META_CHIP}>{meta.revisions}</span>
          <span className={PACKAGE_META_CHIP_ACCENT}>{meta.license}</span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">{description}</p>
      </div>
    </div>
  );
}
