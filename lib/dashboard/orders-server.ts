import "server-only";

import { and, count, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";

import { payoutCzk } from "@/lib/orders/money";
import {
  isActiveOrderStatus,
  type MarketplaceOrderStatus,
} from "@/lib/dashboard/marketplace-order";
import { db } from "@/lib/db";
import { creatorPackage, marketplaceOrder, memberProfile } from "@/lib/db/schema";

export type DashboardOrderListItem = {
  id: string;
  title: string;
  brief: string;
  amountCzk: number;
  payoutCzk: number;
  platformFeeBps: number;
  status: MarketplaceOrderStatus;
  createdAt: Date;
  creatorUserId: string;
  clientUserId: string;
  creatorName: string;
  clientName: string;
  viewerRole: "creator" | "client";
  deliverableUrl: string | null;
  acceptBy: Date | null;
  deliveryDueAt: Date | null;
  reviewDueAt: Date | null;
  revisionCount: number;
  revisionsAllowed: number;
};

export type OrderablePackage = {
  id: string;
  name: string;
  priceCzk: number;
  deliveryDays: number;
  creatorName: string;
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

export const ORDERS_PAGE_SIZE = 20;

export type OrderListFilter = {
  q?: string;
  status?: MarketplaceOrderStatus;
  page?: number;
};

export type OrderListPage = {
  items: DashboardOrderListItem[];
  total: number;
  page: number;
  pageCount: number;
};

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/** Hledá v názvu, briefu a jménu protistrany; stránkuje na serveru. */
export async function listOrdersPageForUser(
  userId: string,
  filter: OrderListFilter = {},
): Promise<OrderListPage> {
  const conditions: SQL[] = [
    or(
      eq(marketplaceOrder.creatorUserId, userId),
      eq(marketplaceOrder.clientUserId, userId),
    )!,
  ];
  if (filter.status) conditions.push(eq(marketplaceOrder.status, filter.status));
  const q = filter.q?.trim();
  if (q) {
    const pattern = `%${escapeLike(q)}%`;
    conditions.push(
      or(
        ilike(marketplaceOrder.title, pattern),
        ilike(marketplaceOrder.brief, pattern),
        sql`exists (select 1 from ${memberProfile} where ${memberProfile.userId} = case when ${marketplaceOrder.creatorUserId} = ${userId} then ${marketplaceOrder.clientUserId} else ${marketplaceOrder.creatorUserId} end and ${memberProfile.displayName} ilike ${pattern})`,
      )!,
    );
  }
  const where = and(...conditions);

  const [{ total }] = await db
    .select({ total: count() })
    .from(marketplaceOrder)
    .where(where);
  const pageCount = Math.max(1, Math.ceil(total / ORDERS_PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.floor(filter.page ?? 1)), pageCount);

  const orders = await db
    .select()
    .from(marketplaceOrder)
    .where(where)
    .orderBy(desc(marketplaceOrder.createdAt), desc(marketplaceOrder.id))
    .limit(ORDERS_PAGE_SIZE)
    .offset((page - 1) * ORDERS_PAGE_SIZE);

  return { items: await toListItems(orders, userId), total, page, pageCount };
}

/** Tvůrce má zaplacené zakázky, které čekají na výplatní účet. */
export async function creatorHasPaidOrders(userId: string) {
  const [row] = await db
    .select({ id: marketplaceOrder.id })
    .from(marketplaceOrder)
    .where(
      and(
        eq(marketplaceOrder.creatorUserId, userId),
        inArray(marketplaceOrder.status, [
          "awaiting_acceptance",
          "in_progress",
          "delivered",
          "revision_requested",
          "payout_pending",
          "completed",
          "disputed",
        ]),
      ),
    )
    .limit(1);
  return Boolean(row);
}

async function toListItems(
  orders: (typeof marketplaceOrder.$inferSelect)[],
  userId: string,
): Promise<DashboardOrderListItem[]> {
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
      brief: order.brief,
      amountCzk: order.amountCzk,
      payoutCzk: payoutCzk(order.amountCzk, order.platformFeeBps),
      platformFeeBps: order.platformFeeBps,
      status: order.status,
      createdAt: order.createdAt,
      creatorUserId: order.creatorUserId,
      clientUserId: order.clientUserId,
      creatorName: displayName(byId.get(order.creatorUserId), "Tvůrce"),
      clientName: displayName(byId.get(order.clientUserId), "Zákazník"),
      viewerRole: asCreator ? "creator" : "client",
      deliverableUrl: order.deliverableUrl,
      acceptBy: order.acceptBy,
      deliveryDueAt: order.deliveryDueAt,
      reviewDueAt: order.reviewDueAt,
      revisionCount: order.revisionCount,
      revisionsAllowed: order.revisionsAllowed,
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
      platformFeeBps: marketplaceOrder.platformFeeBps,
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
        totalEarnedCzk += payoutCzk(order.amountCzk, order.platformFeeBps);
      }
      if (order.clientUserId === userId) {
        totalSpentCzk += order.amountCzk;
      }
    }
  }

  return { active, completed, totalSpentCzk, totalEarnedCzk };
}

export async function listOrderablePackages(): Promise<OrderablePackage[]> {
  const rows = await db
    .select({
      id: creatorPackage.id,
      name: creatorPackage.name,
      priceCzk: creatorPackage.priceCzk,
      deliveryDays: creatorPackage.deliveryDays,
      creatorName: memberProfile.displayName,
    })
    .from(creatorPackage)
    .innerJoin(memberProfile, eq(creatorPackage.userId, memberProfile.userId))
    .orderBy(desc(creatorPackage.createdAt));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    priceCzk: row.priceCzk,
    deliveryDays: row.deliveryDays,
    creatorName: row.creatorName?.trim() || "Tvůrce",
  }));
}
