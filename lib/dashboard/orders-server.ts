import "server-only";

import { desc, eq, inArray, or } from "drizzle-orm";

import {
  isActiveOrderStatus,
  type MarketplaceOrderStatus,
} from "@/lib/dashboard/marketplace-order";
import { db } from "@/lib/db";
import { marketplaceOrder, memberProfile } from "@/lib/db/schema";

export type DashboardOrderListItem = {
  id: string;
  title: string;
  amountCzk: number;
  status: MarketplaceOrderStatus;
  createdAt: Date;
  creatorUserId: string;
  clientUserId: string;
  creatorName: string;
  clientName: string;
  viewerRole: "creator" | "client";
};

export type DashboardOrderStats = {
  active: number;
  completed: number;
  totalSpentCzk: number;
  totalEarnedCzk: number;
};

function displayName(
  profile: { displayName: string | null } | undefined,
  fallback: string,
) {
  return profile?.displayName?.trim() || fallback;
}

export async function listOrdersForUser(
  userId: string,
): Promise<DashboardOrderListItem[]> {
  const orders = await db
    .select()
    .from(marketplaceOrder)
    .where(
      or(
        eq(marketplaceOrder.creatorUserId, userId),
        eq(marketplaceOrder.clientUserId, userId),
      ),
    )
    .orderBy(desc(marketplaceOrder.createdAt));

  if (orders.length === 0) return [];

  const profileIds = [
    ...new Set(
      orders.flatMap((o) => [o.creatorUserId, o.clientUserId]),
    ),
  ];
  const profiles = await db
    .select({
      userId: memberProfile.userId,
      displayName: memberProfile.displayName,
    })
    .from(memberProfile)
    .where(inArray(memberProfile.userId, profileIds));
  const byId = new Map(profiles.map((p) => [p.userId, p]));

  return orders.map((order) => {
    const asCreator = order.creatorUserId === userId;
    return {
      id: order.id,
      title: order.title,
      amountCzk: order.amountCzk,
      status: order.status,
      createdAt: order.createdAt,
      creatorUserId: order.creatorUserId,
      clientUserId: order.clientUserId,
      creatorName: displayName(byId.get(order.creatorUserId), "Tvůrce"),
      clientName: displayName(byId.get(order.clientUserId), "Zákazník"),
      viewerRole: asCreator ? "creator" : "client",
    };
  });
}

export async function getOrderStatsForUser(
  userId: string,
): Promise<DashboardOrderStats> {
  const orders = await db
    .select({
      status: marketplaceOrder.status,
      amountCzk: marketplaceOrder.amountCzk,
      creatorUserId: marketplaceOrder.creatorUserId,
      clientUserId: marketplaceOrder.clientUserId,
    })
    .from(marketplaceOrder)
    .where(
      or(
        eq(marketplaceOrder.creatorUserId, userId),
        eq(marketplaceOrder.clientUserId, userId),
      ),
    );

  let active = 0;
  let completed = 0;
  let totalSpentCzk = 0;
  let totalEarnedCzk = 0;

  for (const order of orders) {
    if (isActiveOrderStatus(order.status)) active += 1;
    if (order.status === "completed") {
      completed += 1;
      if (order.creatorUserId === userId) {
        totalEarnedCzk += order.amountCzk;
      }
      if (order.clientUserId === userId) {
        totalSpentCzk += order.amountCzk;
      }
    }
  }

  return { active, completed, totalSpentCzk, totalEarnedCzk };
}
