import Link from "next/link";

import {
  parseYoutubeVideoId,
  youtubeEmbedUrl,
} from "@/lib/dashboard/package-video";
import { cn } from "@/lib/utils";

type PackagePreviewVideoProps = {
  url: string;
  className?: string;
};

export function PackagePreviewVideo({ url, className }: PackagePreviewVideoProps) {
  const trimmed = url.trim();
  const youtubeId = parseYoutubeVideoId(trimmed);

  if (youtubeId) {
    return (
      <div className={cn("space-y-2", className)}>
        <p className="text-[11px] font-medium uppercase tracking-wide text-mist">
          Ukázka videa
        </p>
        <div className="aspect-video overflow-hidden rounded-md border border-white/[0.09] bg-black">
          <iframe
            src={youtubeEmbedUrl(youtubeId)}
            title="Ukázka videa z YouTube"
            className="size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-mist">
        Ukázka videa
      </p>
      <Link
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-sm text-cyan hover:border-cyan/35 hover:bg-cyan/[0.06]"
      >
        Přehrát ukázku v novém okně
      </Link>
    </div>
  );
}
