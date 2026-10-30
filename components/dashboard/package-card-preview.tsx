import { ImageIcon, Play } from "lucide-react";

import {
  formatPackagePrice,
  PACKAGE_META_CHIP,
  PACKAGE_META_CHIP_ACCENT,
  packageOptionLabel,
  packagePreviewMeta,
  revisionsLabel,
  type PackagePreviewFields,
} from "@/lib/dashboard/package-display";
import {
  DELIVERY_OPTIONS,
  PACKAGE_FORMATS,
  PACKAGE_LICENSE_OPTIONS,
} from "@/lib/dashboard/categories";
import { parseYoutubeVideoId } from "@/lib/dashboard/package-video";
import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type PackageCardPreviewProps = {
  fields: PackagePreviewFields;
  className?: string;
  /** Bez horní lišty: když je náhled vnořený v jiné sekci. */
  hideHeader?: boolean;
  /** Spodní nápověda k živému náhledu (sidebar editoru). */
  showLivePreviewHint?: boolean;
};

export function PackageCardPreview({
  fields,
  className,
  hideHeader,
  showLivePreviewHint,
}: PackageCardPreviewProps) {
  const meta = packagePreviewMeta(fields);
  const title = fields.name.trim() || "Název balíčku";
  const description = fields.description.trim() || "Krátký popis balíčku se zobrazí tady.";
  const hero =
    fields.bannerUrl ??
    fields.showcaseUrls.find((url) => url !== fields.bannerUrl) ??
    fields.showcaseUrls[0] ??
    null;
  const photoCount = fields.showcaseUrls.length;
  const hasVideo = Boolean(fields.previewVideoUrl.trim());
  const hasYoutube = hasVideo && parseYoutubeVideoId(fields.previewVideoUrl);
  const priceLabel = formatPackagePrice(fields.priceCzk);
  const deliveryShort = packageOptionLabel(
    DELIVERY_OPTIONS,
    fields.deliveryDays,
  );
  const licenseShort = packageOptionLabel(
    PACKAGE_LICENSE_OPTIONS,
    fields.licenseDays,
  );

  return (
    <div
      className={cn(
        surface,
        "flex flex-col overflow-hidden transition-colors hover:border-white/[0.14]",
        className,
      )}
    >
      {hideHeader ? null : (
        <p className="border-b border-white/[0.08] px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-mist">
          Náhled v tržišti
        </p>
      )}

      <div className="relative aspect-video w-full shrink-0 bg-[#0a0910]">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-mist">
            <ImageIcon className="size-8 opacity-40" strokeWidth={1.25} aria-hidden />
            <span className="text-xs">Náhled 16:9</span>
          </div>
        )}

        {hasVideo ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-sm bg-void/90 px-2 py-0.5 text-[10px] font-medium text-white">
            <Play className="size-3 fill-white text-white" aria-hidden />
            {hasYoutube ? "YouTube" : "Video"}
          </span>
        ) : null}

        {photoCount > 1 ? (
          <span className="absolute bottom-2 right-2 rounded-sm bg-void/90 px-2 py-0.5 text-[10px] font-medium text-mist">
            {photoCount} fotek
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-white">
          {title}
        </p>

        <div className="flex items-baseline justify-between gap-2 border-b border-white/[0.08] pb-2.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-mist">
            Cena balíčku
          </span>
          <span className="font-display text-lg font-bold tabular-nums leading-none text-white">
            {priceLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          <span className={PACKAGE_META_CHIP}>{meta.format}</span>
          <span className={PACKAGE_META_CHIP}>{deliveryShort}</span>
          <span className={PACKAGE_META_CHIP}>{revisionsLabel(fields.revisions)}</span>
          <span className={PACKAGE_META_CHIP_ACCENT}>{licenseShort}</span>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-zinc-200">
          {description}
        </p>
      </div>

      {showLivePreviewHint && !hideHeader ? (
        <p className="border-t border-white/[0.08] px-4 py-2.5 text-[11px] leading-relaxed text-mist">
          Takhle vypadá karta v profilu. Layout celé stránky gigu ověř tlačítkem{" "}
          <span className="font-medium text-white">Živý náhled</span>.
        </p>
      ) : null}
    </div>
  );
}
