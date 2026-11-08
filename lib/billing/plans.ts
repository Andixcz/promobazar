import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import type { MemberRole } from "@/lib/db/schema";
import { PLATFORM_FEE_BPS } from "@/lib/orders/money";

export const subscriptionPlanIds = ["growth", "creator_pro"] as const;
export type SubscriptionPlanId = (typeof subscriptionPlanIds)[number];

export const billingPlanIds = [
  "starter",
  "growth",
  "scale",
  "creator_basic",
  "creator_pro",
] as const;
export type BillingPlanId = (typeof billingPlanIds)[number];

export const subscriptionStatusValues = [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "unpaid",
  "incomplete",
  "incomplete_expired",
  "paused",
] as const;
export type SubscriptionStatus = (typeof subscriptionStatusValues)[number];

/** ponytail: základ má „omezený počet“ bez čísla na webu — 3 aktivní gigi; PRO neomezeně */
export const CREATOR_BASIC_MAX_PUBLISHED_PACKAGES = 3;

const GROWTH_FEE_BPS = 700;

export function defaultBillingPlanForRole(role: MemberRole): BillingPlanId {
  return role === "creator" ? "creator_basic" : "starter";
}

export function subscriptionIsEntitled(
  status: MemberProfileRow["subscriptionStatus"],
): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export function effectiveBillingPlan(profile: MemberProfileRow): BillingPlanId {
  const stored = profile.billingPlan;
  if (
    stored &&
    subscriptionIsEntitled(profile.subscriptionStatus) &&
    (stored === "growth" || stored === "creator_pro")
  ) {
    return stored;
  }
  return defaultBillingPlanForRole(profile.role);
}

export function brandHasGrowth(profile: MemberProfileRow): boolean {
  return (
    (profile.role === "brand" || profile.role === "buyer") &&
    effectiveBillingPlan(profile) === "growth"
  );
}

export function creatorHasPro(profile: MemberProfileRow): boolean {
  return profile.role === "creator" && effectiveBillingPlan(profile) === "creator_pro";
}

export function platformFeeBpsForClient(profile: MemberProfileRow): number {
  if (brandHasGrowth(profile)) return GROWTH_FEE_BPS;
  return PLATFORM_FEE_BPS;
}

export function billingPlanForSubscriptionPlan(
  plan: SubscriptionPlanId,
): BillingPlanId {
  return plan === "growth" ? "growth" : "creator_pro";
}

export function canSubscribeToPlan(
  role: MemberProfileRow["role"],
  plan: SubscriptionPlanId,
): boolean {
  if (plan === "growth") {
    return role === "brand" || role === "buyer";
  }
  return role === "creator";
}

export function subscriptionPlanDeniedMessage(
  plan: SubscriptionPlanId,
): string {
  if (plan === "growth") {
    return "Growth je pro účet značky. Založ nebo se přihlas jako značka (ne tvůrce).";
  }
  return "Creator PRO je jen pro účet tvůrce.";
}
