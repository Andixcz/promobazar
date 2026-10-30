import { ClipboardList, Receipt, UserRound } from "lucide-react";

import { DashboardSectionLink } from "@/components/dashboard/dashboard-section-link";
import { DashboardStat } from "@/components/dashboard/dashboard-stat";
import { dashboardPath } from "@/lib/dashboard-routes";
import type { DashboardOrderStats } from "@/lib/dashboard/orders-server";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";

export function BrandOverview({
  profile,
  jobCount,
  orderStats,
}: {
  profile: MemberProfileRow;
  jobCount: number;
  orderStats: DashboardOrderStats;
}) {
  return (
    <div className="space-y-10">
      <div className="grid gap-2 sm:grid-cols-3">
        <DashboardStat label="Aktivní poptávky" value={String(jobCount)} />
        <DashboardStat
          label="Aktivní objednávky"
          value={String(orderStats.active)}
        />
        <DashboardStat
          label="Dokončené spolupráce"
          value={String(orderStats.completed)}
        />
      </div>

      <div>
        <h2 className="mb-3 font-body text-[11px] font-medium uppercase tracking-wide text-mist">
          Další sekce
        </h2>
        <div className="grid gap-2 md:grid-cols-2">
          <DashboardSectionLink
            href={dashboardPath("objednavky")}
            icon={Receipt}
            title="Objednávky"
            description="Vše založené na platformě. U každé vidíš tvůrce, stav a částku."
          />
          <DashboardSectionLink
            href={dashboardPath("poptavky")}
            icon={ClipboardList}
            title="Moje poptávky"
            description="Publikuj novou zakázku, uprav rozpočet a popis. Tvůrci ji uvidí v tržišti na hlavní stránce."
          />
          <DashboardSectionLink
            href={dashboardPath("profil")}
            icon={UserRound}
            title="Profil"
            description="Jméno, bio, banner a média veřejného profilu značky."
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
