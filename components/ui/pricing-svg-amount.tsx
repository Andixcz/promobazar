import Image from "next/image";

import { cn } from "@/lib/utils";

const DIGIT_SIZE = {
  "0": { width: 5, height: 11 },
  "1": { width: 5, height: 11 },
  "2": { width: 5, height: 11 },
  "3": { width: 5, height: 11 },
  "4": { width: 7, height: 11 },
  "5": { width: 5, height: 11 },
  "6": { width: 5, height: 11 },
  "7": { width: 5, height: 11 },
  "8": { width: 5, height: 11 },
  "9": { width: 5, height: 11 },
} as const;

type Digit = keyof typeof DIGIT_SIZE;

function parsePriceDisplay(value: string) {
  const parts: Array<{ kind: "digit"; digit: Digit } | { kind: "space" }> = [];
  let needSpace = false;

  for (const segment of value.split(" ")) {
    if (!segment) continue;
    if (needSpace) parts.push({ kind: "space" });
    needSpace = true;

    for (const char of segment) {
      if (char in DIGIT_SIZE) {
        parts.push({ kind: "digit", digit: char as Digit });
      }
    }
  }

  return parts;
}

type PricingSvgAmountProps = {
  /** Číslice a mezery, např. `0`, `2 990`, `99`. */
  value: string;
  className?: string;
  period?: string;
};

export function PricingSvgAmount({
  value,
  className,
  period = "/ měsíc",
}: PricingSvgAmountProps) {
  const parts = parsePriceDisplay(value);
  const label = `${value} Kč${period ? ` ${period}` : ""}`;

  return (
    <p className={cn("mt-7 flex flex-wrap items-end gap-x-0.5", className)}>
      <span className="sr-only">{label}</span>
      <span className="flex items-end gap-0.5" aria-hidden>
        {parts.map((part, index) =>
          part.kind === "space" ? (
            <span key={`space-${index}`} className="w-2 shrink-0" />
          ) : (
            <Image
              key={`${part.digit}-${index}`}
              src={`/illustrations/${part.digit}.svg`}
              alt=""
              width={DIGIT_SIZE[part.digit].width}
              height={DIGIT_SIZE[part.digit].height}
              className="h-11 w-auto"
            />
          ),
        )}
      </span>
      <span
        className="mb-0.5 ml-1 font-display text-2xl font-semibold text-white"
        aria-hidden
      >
        Kč
      </span>
      {period ? (
        <span className="mb-1 text-sm font-normal text-mist" aria-hidden>
          {period}
        </span>
      ) : null}
    </p>
  );
}
