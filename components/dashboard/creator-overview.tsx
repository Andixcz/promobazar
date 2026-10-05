import { Package, Receipt, UserRound } from "lucide-react";

import { DashboardSectionLink } from "@/components/dashboard/dashboard-section-link";
import { DashboardStat } from "@/components/dashboard/dashboard-stat";
import { dashboardPath } from "@/lib/dashboard-routes";
import type { DashboardOrderStats } from "@/lib/dashboard/orders-server";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";

function formatCzk(amount: number) {
  return `${amount.toLocaleString("cs-CZ")} Kč`;
}

export function CreatorOverview({
  profile,
  orderStats,
}: {
  profile: MemberProfileRow;
  orderStats: DashboardOrderStats;
}) {
  const stats = [
    {
      label: "Celkový výdělek",
      value: formatCzk(orderStats.totalEarnedCzk),
      hint:
        orderStats.completed === 0
          ? "zatím žádné dokončené objednávky"
          : `z ${orderStats.completed} dokončených zakázek`,
      accent: true,
    },
    {
      label: "Aktivní objednávky",
      value: String(orderStats.active),
      hint: "čekají na práci, dodání nebo schválení",
    },
    {
      label: "Dokončené kampaně",
      value: String(orderStats.completed),
      hint: "za celou dobu na platformě",
    },
    {
      label: "Zobrazení profilu",
      value: String(profile.profileViews),
      hint: "v tržišti tvůrců",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {stats.map((s) => (
          <DashboardStat
            key={s.label}
            label={s.label}
            value={s.value}
            hint={s.hint}
            accent={s.accent}
          />
        ))}
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
            description="Stav zakázek od značek a nakupujících: platba, práce a schválení."
          />
          <DashboardSectionLink
            href={dashboardPath("balicky")}
            icon={Package}
            title="Balíčky"
            description="Nastav ceny, formáty a licence. Značky uvidí balíčky po rozkliknutí tvého profilu."
          />
          <DashboardSectionLink
            href={dashboardPath("profil")}
            icon={UserRound}
            title="Profil"
            description="Avatar, bio, sítě a portfolio ve veřejném profilu."
          />
        </div>
      </div>
    </div>
  );
}
