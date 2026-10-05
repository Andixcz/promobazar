import { Receipt, ShoppingBag, UserRound } from "lucide-react";

import { DashboardSectionLink } from "@/components/dashboard/dashboard-section-link";
import { DashboardStat } from "@/components/dashboard/dashboard-stat";
import { dashboardPath } from "@/lib/dashboard-routes";
import type { DashboardOrderStats } from "@/lib/dashboard/orders-server";

function formatCzk(amount: number) {
  return `${amount.toLocaleString("cs-CZ")} Kč`;
}

export function BuyerOverview({
  orderStats,
}: {
  orderStats: DashboardOrderStats;
}) {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3 md:gap-5">
        <DashboardStat
          label="Aktivní objednávky"
          value={String(orderStats.active)}
        />
        <DashboardStat
          label="Dokončené"
          value={String(orderStats.completed)}
        />
        <DashboardStat
          label="Utraceno celkem"
          value={formatCzk(orderStats.totalSpentCzk)}
        />
      </div>

      <div>
        <h2 className="mb-3 font-body text-[11px] font-medium uppercase tracking-wide text-mist">
          Další sekce
        </h2>
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <DashboardSectionLink
            href={dashboardPath("objednavky")}
            icon={Receipt}
            title="Objednávky"
            description="Přehled všech zakázek: stav práce tvůrce a schvalování obsahu."
          />
          <DashboardSectionLink
            href="/"
            icon={ShoppingBag}
            title="Tržiště"
            description="Najdi tvůrce a balíček podle oboru a rozpočtu."
          />
          <DashboardSectionLink
            href={dashboardPath("profil")}
            icon={UserRound}
            title="Profil"
            description="Kontaktní údaje pro objednávky a komunikaci."
          />
        </div>
      </div>
    </div>
  );
}
