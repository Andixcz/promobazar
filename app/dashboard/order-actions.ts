"use server";

import { revalidatePath } from "next/cache";

import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";
import {
  startCustomCheckout,
  startPackageCheckout,
  resumeCheckout,
} from "@/lib/orders/checkout";
import {
  acceptOrder,
  approveOrder,
  deliverOrder,
  refundOrder,
  requestRevision,
} from "@/lib/orders/lifecycle";

function refresh() {
  revalidatePath(dashboardPath());
  revalidatePath(dashboardPath("objednavky"));
  revalidatePath(dashboardPath("nastaveni"));
}

async function clientContext() {
  const { profile } = await requireDashboard(dashboardPath("objednavky"));
  if (profile.role === "creator") {
    return { ok: false as const, error: "Objednat může zákazník." };
  }
  return { ok: true as const, userId: profile.userId };
}

export async function payForPackage(input: { packageId: string; brief: string }) {
  const ctx = await clientContext();
  if (!ctx.ok) return ctx;
  const result = await startPackageCheckout({
    clientUserId: ctx.userId,
    packageId: input.packageId,
    brief: input.brief,
  });
  refresh();
  return result;
}

export async function payForCustomOffer(input: {
  creatorSlug: string;
  title: string;
  amountCzk: number;
  deliveryDays: number;
  brief: string;
}) {
  const ctx = await clientContext();
  if (!ctx.ok) return ctx;
  const result = await startCustomCheckout({
    clientUserId: ctx.userId,
    ...input,
  });
  refresh();
  return result;
}

export async function payPendingOrder(orderId: string) {
  const ctx = await clientContext();
  if (!ctx.ok) return ctx;
  return resumeCheckout(orderId, ctx.userId);
}

export async function acceptMarketplaceOrder(orderId: string) {
  const { profile } = await requireDashboard(dashboardPath("objednavky"));
  const result = await acceptOrder(orderId, profile.userId);
  refresh();
  return result;
}

export async function rejectMarketplaceOrder(orderId: string) {
  const { profile } = await requireDashboard(dashboardPath("objednavky"));
  const result = await refundOrder(orderId, profile.userId);
  refresh();
  return result;
}

export async function deliverMarketplaceOrder(orderId: string, deliverableUrl: string) {
  const { profile } = await requireDashboard(dashboardPath("objednavky"));
  const result = await deliverOrder(orderId, profile.userId, deliverableUrl);
  refresh();
  return result;
}

export async function approveMarketplaceOrder(orderId: string) {
  const { profile } = await requireDashboard(dashboardPath("objednavky"));
  const result = await approveOrder(orderId, profile.userId);
  refresh();
  return result;
}

export async function requestMarketplaceRevision(orderId: string) {
  const { profile } = await requireDashboard(dashboardPath("objednavky"));
  const result = await requestRevision(orderId, profile.userId);
  refresh();
  return result;
}
