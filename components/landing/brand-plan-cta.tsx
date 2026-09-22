"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { callAppHandler } from "@/lib/app-global";
import { htmlButtonCta } from "@/lib/ui-surfaces";

export type BrandPlanId = "starter" | "growth";

const BRAND_PLAN_STORAGE_KEY = "pb_brand_plan";

const activePlanButtonClass =
  "mt-8 flex w-full cursor-default items-center justify-center gap-2 rounded-sm border border-white/[0.08] bg-white/[0.04] py-3.5 text-sm font-semibold text-mist";

function readBrandPlan(): BrandPlanId {
  if (typeof window === "undefined") return "starter";
  return localStorage.getItem(BRAND_PLAN_STORAGE_KEY) === "growth" ? "growth" : "starter";
}

export function BrandPlanCta({ plan }: { plan: BrandPlanId }) {
  const [currentPlan, setCurrentPlan] = useState<BrandPlanId>("starter");

  useEffect(() => {
    setCurrentPlan(readBrandPlan());
    const sync = () => setCurrentPlan(readBrandPlan());
    window.addEventListener("pb-brand-plan-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pb-brand-plan-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isCurrent = currentPlan === plan;

  if (isCurrent) {
    return (
      <button type="button" disabled className={activePlanButtonClass}>
        <Check className="size-4 shrink-0" aria-hidden />
        Aktivní plán
      </button>
    );
  }

  if (plan === "starter") {
    return <div className="mt-8 h-12" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={() => callAppHandler("handleCheckout", "growth")}
      className={`${htmlButtonCta} w-full mt-8`}
    >
      Vybrat Growth
    </button>
  );
}
