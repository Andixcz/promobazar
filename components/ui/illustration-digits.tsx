import Image from "next/image";

import { cn } from "@/lib/utils";

export const ILLUSTRATION_DIGIT_SIZE = {
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

export type IllustrationDigit = keyof typeof ILLUSTRATION_DIGIT_SIZE;

function isIllustrationDigit(char: string): char is IllustrationDigit {
  return char in ILLUSTRATION_DIGIT_SIZE;
}

type IllustrationDigitsProps = {
  /** Posloupnost číslic, např. `404`, `2990`. */
  value: string;
  className?: string;
  digitClassName?: string;
  gapClassName?: string;
  accessibleLabel?: string;
};

export function IllustrationDigits({
  value,
  className,
  digitClassName = "h-11 w-auto",
  gapClassName = "gap-0.5",
  accessibleLabel,
}: IllustrationDigitsProps) {
  const digits = value.split("").filter(isIllustrationDigit);
  const label = accessibleLabel ?? value;

  return (
    <>
      <span className="sr-only">{label}</span>
      <span
        className={cn("flex items-end", gapClassName, className)}
        aria-hidden
      >
        {digits.map((digit, index) => (
          <Image
            key={`${digit}-${index}`}
            src={`/illustrations/${digit}.svg`}
            alt=""
            width={ILLUSTRATION_DIGIT_SIZE[digit].width}
            height={ILLUSTRATION_DIGIT_SIZE[digit].height}
            className={digitClassName}
            priority
          />
        ))}
      </span>
    </>
  );
}
