import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { NewOrderForm } from "@/components/dashboard/new-order-form";
import { OrdersPanel } from "@/components/dashboard/orders-panel";
import {
  listOrderablePackages,
  listOrdersForUser,
} from "@/lib/dashboard/orders-server";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export default async function DashboardOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ platba?: string }>;
}) {
  const { profile } = await requireDashboard(dashboardPath("objednavky"));
  const { platba } = await searchParams;
  const orders = await listOrdersForUser(profile.userId);
  const packages =
    profile.role === "creator" ? [] : await listOrderablePackages();
  const notice =
    platba === "ok"
      ? "Platba proběhla."
      : platba === "zruseno"
        ? "Platba neproběhla."
        : null;
  const heldForCreator =
    profile.role === "creator" &&
    profile.stripeTransfersStatus !== "active" &&
    orders.some(
      (order) =>
        order.status !== "pending_payment" &&
        order.status !== "refunded" &&
        order.status !== "cancelled",
    );

  return (
    <DashboardShell
      title="Objednávky"
      description="Zakázky a jejich stav."
    >
      {notice ? <p className="mb-5 text-sm text-zinc-200">{notice}</p> : null}
      {heldForCreator ? (
        <p className="mb-5 text-sm text-zinc-200">
          Máš tu peníze.{" "}
          <Link href="/api/stripe/connect" className="text-cyan hover:underline">
            Zadej číslo účtu
          </Link>
          , ať ti je můžeme poslat.
        </p>
      ) : null}
      {profile.role === "creator" ? null : (
        <div className="mb-8">
          <NewOrderForm packages={packages} />
        </div>
      )}
      <OrdersPanel orders={orders} memberRole={profile.role} />
    </DashboardShell>
  );
}
