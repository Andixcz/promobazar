"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type PackageShowcaseCarouselProps = {
  urls: string[];
  className?: string;
};

export function PackageShowcaseCarousel({
  urls,
  className,
}: PackageShowcaseCarouselProps) {
  const count = urls.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [urls]);

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, go]);

  if (!count) return null;

  const activeUrl = urls[index] ?? urls[0];

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="group relative aspect-video overflow-hidden rounded-lg border border-white/[0.08] bg-[#0a0910]"
        aria-roledescription="carousel"
        aria-label="Ukázky balíčku"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeUrl}
          src={activeUrl}
          alt=""
          className="size-full object-cover"
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Předchozí ukázka"
              className={cn(
                "absolute top-1/2 left-2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full",
                "border border-white/25 bg-white/95 text-void transition-opacity",
                "opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
              )}
              onClick={() => go(-1)}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Další ukázka"
              className={cn(
                "absolute top-1/2 right-2 z-10 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full",
                "border border-white/25 bg-white/95 text-void transition-opacity",
                "opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
              )}
              onClick={() => go(1)}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <span className="absolute right-3 bottom-3 rounded-sm bg-void/85 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white">
              {index + 1} / {count}
            </span>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-0.5 md:grid md:w-full md:overflow-visible md:pb-0"
          style={{
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
          }}
          role="tablist"
          aria-label="Náhledy ukázek"
        >
          {urls.map((url, thumbIndex) => {
            const selected = thumbIndex === index;
            return (
              <button
                key={url}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Ukázka ${thumbIndex + 1}`}
                className={cn(
                  "relative aspect-video h-[4.25rem] shrink-0 overflow-hidden rounded-md border-2 transition-all sm:h-[4.75rem]",
                  "md:h-auto md:w-full md:min-w-0 md:shrink",
                  selected
                    ? "border-cyan opacity-100"
                    : "border-white/10 opacity-65 hover:border-white/25 hover:opacity-100",
                )}
                onClick={() => setIndex(thumbIndex)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="size-full object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
