"use client";

import { SideRays } from "@/components/ui/side-rays";

/** Ambient WebGL rays za marketingovým a auth obalem (SiteShell). */
export function SiteSideRays() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <SideRays
        rayColor1="#7c3aed"
        rayColor2="#7dbcff"
        origin="top-right"
        speed={2.5}
        intensity={1.75}
        spread={1.5}
        density={5}
        followMouse={false}
        blend={0.72}
        sharpness={0.42}
        tilt={1}
        falloff={1.35}
        glow={1.45}
        saturation={1.3}
        mouseInfluence={0.48}
        opacity={0.75}
      />
    </div>
  );
}
