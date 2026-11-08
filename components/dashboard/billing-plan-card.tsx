import Link from "next/link";
import { Check, CreditCard } from "lucide-react";

import { effectiveBillingPlan, subscriptionIsEntitled } from "@/lib/billing/plans";
import { subscriptionCheckoutHref } from "@/lib/billing/subscription-checkout-url";
import { Button } from "@/components/ui/button";
import { ProfileSettingsSection } from "@/components/dashboard/profile-settings-section";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { cn } from "@/lib/utils";

const PLAN_LABEL: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  creator_basic: "Základ",
  creator_pro: "Creator PRO",
  scale: "Scale",
};

function formatSubscriptionDate(value: Date) {
  return value.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function subscriptionStatusLabel(
  status: MemberProfileRow["subscriptionStatus"],
): string | null {
  if (status === "active") return "Aktivní";
  if (status === "trialing") return "Zkušební";
  if (status === "past_due") return "Po splatnosti";
  return null;
}

export function BillingPlanCard({
  profile,
  activeSince,
}: {
  profile: MemberProfileRow;
  activeSince?: Date | null;
}) {
  const plan = effectiveBillingPlan(profile);
  const label = PLAN_LABEL[plan] ?? plan;
  const entitled = subscriptionIsEntitled(profile.subscriptionStatus);
  const statusLabel = entitled ? subscriptionStatusLabel(profile.subscriptionStatus) : null;
  const pastDue = entitled && profile.subscriptionStatus === "past_due";
  const canUpgrade =
    (profile.role === "brand" && plan !== "growth") ||
    (profile.role === "creator" && plan !== "creator_pro");

  const upgradeHref =
    profile.role === "brand"
      ? subscriptionCheckoutHref("growth")
      : subscriptionCheckoutHref("creator_pro");

  const rowState = pastDue ? "past_due" : entitled ? "active" : "free";

  const subtitle =
    entitled && activeSince ? (
      <>
        Aktivní od{" "}
        <time dateTime={activeSince.toISOString()}>
          {formatSubscriptionDate(activeSince)}
        </time>
      </>
    ) : entitled ? (
      "Placené předplatné"
    ) : (
      "Bez placeného předplatného"
    );

  return (
    <ProfileSettingsSection
      title="Předplatné"
      description={
        pastDue
          ? "Platba selhala. Doplň kartu ve Stripe."
          : "Předplatné a faktury ve Stripe."
      }
    >
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
          rowState === "active" && "border-cyan/30 bg-cyan/[0.06]",
          rowState === "past_due" && "border-rose/30 bg-rose/[0.06]",
          rowState === "free" && "border-white/[0.08] bg-white/[0.02]",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              rowState === "past_due"
                ? "bg-rose/15 text-rose"
                : rowState === "active"
                  ? "bg-cyan/15 text-cyan"
                  : "bg-white/[0.06] text-white",
            )}
            aria-hidden
          >
            <CreditCard className="size-[18px]" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-white">{label}</p>
              {statusLabel ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    pastDue
                      ? "bg-rose/15 text-rose"
                      : "bg-cyan/15 text-cyan",
                  )}
                >
                  {!pastDue ? (
                    <Check className="size-3" strokeWidth={2.5} aria-hidden />
                  ) : null}
                  {statusLabel}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-zinc-200">{subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pl-2">
          {canUpgrade ? (
            <Button asChild size="sm">
              <a href={upgradeHref}>
                {profile.role === "brand"
                  ? "Přejít na Growth"
                  : "Zapnout Creator PRO"}
              </a>
            </Button>
          ) : null}
          {profile.stripeCustomerId ? (
            <Button asChild size="sm" variant="outline">
              <a href="/api/stripe/billing/portal">Spravovat</a>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link
                href={
                  profile.role === "brand" ? "/#cenik" : "/pro-tvurce#creator-pro"
                }
              >
                Ceník
              </Link>
            </Button>
          )}
        </div>
      </div>
    </ProfileSettingsSection>
  );
}
