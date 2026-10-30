import Image from "next/image";

import { stepIllustration } from "@/lib/ui-surfaces";

const STEP_SVG = {
  1: { width: 5, height: 11 },
  2: { width: 5, height: 11 },
  3: { width: 5, height: 11 },
  4: { width: 7, height: 11 },
} as const;

export function StepIllustration({ step }: { step: keyof typeof STEP_SVG }) {
  const { width, height } = STEP_SVG[step];
  return (
    <Image
      src={`/illustrations/${step}.svg`}
      alt=""
      width={width}
      height={height}
      className={stepIllustration}
      aria-hidden
    />
  );
}
