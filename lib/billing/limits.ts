import "server-only";

import { and, count, eq, inArray } from "drizzle-orm";

import {
  brandHasGrowth,
  CREATOR_BASIC_MAX_PUBLISHED_PACKAGES,
  creatorHasPro,
  effectiveBillingPlan,
} from "@/lib/billing/plans";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";
import { db } from "@/lib/db";
import { creatorPackage, marketplaceOrder } from "@/lib/db/schema";

const OPEN_ORDER_STATUSES = [
  "pending_payment",
  "awaiting_acceptance",
  "in_progress",
  "delivered",
  "revision_requested",
  "payout_pending",
] as const;

export async function clientOpenOrderCount(clientUserId: string) {
  const [row] = await db
    .select({ total: count() })
    .from(marketplaceOrder)
    .where(
      and(
        eq(marketplaceOrder.clientUserId, clientUserId),
        inArray(marketplaceOrder.status, [...OPEN_ORDER_STATUSES]),
      ),
    );
  return row?.total ?? 0;
}

export async function starterOrderLimitError(
  profile: MemberProfileRow,
  clientUserId: string,
): Promise<string | null> {
  if (profile.role !== "brand" && profile.role !== "buyer") return null;
  if (brandHasGrowth(profile)) return null;
  if (effectiveBillingPlan(profile) !== "starter") return null;
  const open = await clientOpenOrderCount(clientUserId);
  if (open >= 1) {
    return "Ve Starter plánu jde naráz jen jedna aktivní objednávka. Dokonči ji, nebo přejdi na Growth.";
  }
  return null;
}

export async function creatorPublishedPackageCount(creatorUserId: string) {
  const [row] = await db
    .select({ total: count() })
    .from(creatorPackage)
    .where(
      and(
        eq(creatorPackage.userId, creatorUserId),
        eq(creatorPackage.status, "published"),
      ),
    );
  return row?.total ?? 0;
}

export async function creatorPublishLimitError(
  profile: MemberProfileRow,
): Promise<string | null> {
  if (profile.role !== "creator") return null;
  if (creatorHasPro(profile)) return null;
  const published = await creatorPublishedPackageCount(profile.userId);
  if (published >= CREATOR_BASIC_MAX_PUBLISHED_PACKAGES) {
    return `V základním plánu můžeš mít najednou ${CREATOR_BASIC_MAX_PUBLISHED_PACKAGES} aktivní balíčky. Přejdi na Creator PRO, nebo nějaký deaktivuj.`;
  }
  return null;
}
