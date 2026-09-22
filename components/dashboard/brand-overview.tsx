import { ClipboardList, UserRound } from "lucide-react";

import { DashboardSectionLink } from "@/components/dashboard/dashboard-section-link";
import { DashboardStat } from "@/components/dashboard/dashboard-stat";
import { dashboardPath } from "@/lib/dashboard-routes";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";

export function BrandOverview({
  profile,
  jobCount,
}: {
  profile: MemberProfileRow;
  jobCount: number;
}) {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3 md:gap-5">
        <DashboardStat label="Aktivní poptávky" value={String(jobCount)} />
        <DashboardStat label="Odpovědi tvůrců" value="0" />
        <DashboardStat label="Probíhající spolupráce" value="0" />
      </div>

      <div>
        <h2 className="mb-3 font-body text-[11px] font-medium uppercase tracking-wide text-mist">
          Další sekce
        </h2>
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <DashboardSectionLink
            href={dashboardPath(profile.slug, "poptavky")}
            icon={ClipboardList}
            title="Moje poptávky"
            description="Publikuj novou zakázku, uprav rozpočet a popis. Tvůrci ji uvidí v tržišti na hlavní stránce."
          />
          <DashboardSectionLink
            href={dashboardPath(profile.slug, "profil")}
            icon={UserRound}
            title="Profil"
            description="Jméno, bio, banner a média veřejného profilu značky."
          />
        </div>
      </div>
    </div>
  );
}
