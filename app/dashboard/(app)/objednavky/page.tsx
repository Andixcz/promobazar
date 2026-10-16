import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { NewOrderForm } from "@/components/dashboard/new-order-form";
import { OrdersFilters } from "@/components/dashboard/orders-filters";
import { OrdersPagination } from "@/components/dashboard/orders-pagination";
import { OrdersPanel } from "@/components/dashboard/orders-panel";
import {
  creatorHasPaidOrders,
  listOrderablePackages,
  listOrdersPageForUser,
} from "@/lib/dashboard/orders-server";
import { marketplaceOrderStatusValues } from "@/lib/db/schema";
import type { MarketplaceOrderStatus } from "@/lib/dashboard/marketplace-order";
import { dashboardPath } from "@/lib/dashboard-routes";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export default async function DashboardOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ platba?: string; q?: string; stav?: string; strana?: string }>;
}) {
  const { profile } = await requireDashboard(dashboardPath("objednavky"));
  const { platba, q, stav, strana } = await searchParams;
  const query = (q ?? "").trim().slice(0, 100);
  const status = (marketplaceOrderStatusValues as readonly string[]).includes(stav ?? "")
    ? (stav as MarketplaceOrderStatus)
    : undefined;
  const result = await listOrdersPageForUser(profile.userId, {
    q: query,
    status,
    page: Number.parseInt(strana ?? "1", 10) || 1,
  });
  const filtered = Boolean(query || status);
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
    (await creatorHasPaidOrders(profile.userId));

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
      <OrdersFilters q={query} status={status} />
      <OrdersPanel
        orders={result.items}
        total={result.total}
        filtered={filtered}
        memberRole={profile.role}
      />
      <OrdersPagination
        page={result.page}
        pageCount={result.pageCount}
        q={query}
        status={status}
      />
    </DashboardShell>
  );
}
