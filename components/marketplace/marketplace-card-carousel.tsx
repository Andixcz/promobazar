"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

type MarketplaceCardCarouselProps = {
  urls: string[];
  className?: string;
};

export function MarketplaceCardCarousel({
  urls,
  className,
}: MarketplaceCardCarouselProps) {
  const count = urls.length;
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

  if (!count) {
    return (
      <div
        className={cn(
          "flex aspect-[16/10] items-center justify-center bg-white/[0.04] text-xs text-mist",
          className,
        )}
      >
        Bez náhledu
      </div>
    );
  }

  const activeUrl = urls[index] ?? urls[0];

  return (
    <div
      className={cn(
        "group/carousel relative aspect-[16/10] overflow-hidden bg-[#0a0910]",
        className,
      )}
      onMouseLeave={() => setIndex(0)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={activeUrl}
        alt=""
        className="size-full object-cover transition-opacity duration-200"
      />

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Předchozí foto"
            className={cn(
              "absolute top-1/2 left-1.5 z-10 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full",
              "border border-white/20 bg-white/95 text-void",
              "opacity-0 transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100",
            )}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              go(-1);
            }}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Další foto"
            className={cn(
              "absolute top-1/2 right-1.5 z-10 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full",
              "border border-white/20 bg-white/95 text-void",
              "opacity-0 transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100",
            )}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              go(1);
            }}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <div
            className="absolute inset-x-0 bottom-2 flex justify-center gap-1"
            aria-hidden
          >
            {urls.map((url, dotIndex) => (
              <span
                key={url}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  dotIndex === index ? "bg-white" : "bg-white/45",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
