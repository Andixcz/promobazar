import Image from "next/image";

import { cn } from "@/lib/utils";

const ILLUSTRATIONS = {
  Checkmark: { width: 18, height: 13 },
  Clock: { width: 22, height: 22 },
  Copyright: { width: 22, height: 22 },
  Email: { width: 22, height: 18 },
  Link: { width: 22, height: 22 },
  Message: { width: 22, height: 21 },
  Package: { width: 20, height: 22 },
  Revise: { width: 20, height: 20 },
  Star: { width: 22, height: 22 },
  Wallet: { width: 21, height: 20 },
} as const;

export type IllustrationIconName = keyof typeof ILLUSTRATIONS;

export function IllustrationIcon({
  name,
  className,
}: {
  name: IllustrationIconName;
  className?: string;
}) {
  const { width, height } = ILLUSTRATIONS[name];
  return (
    <Image
      src={`/illustrations/${name}.svg`}
      alt=""
      width={width}
      height={height}
      className={cn("h-auto w-auto shrink-0", className)}
      aria-hidden
    />
  );
}
