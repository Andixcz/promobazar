import { Package, UserRound } from "lucide-react";

import { DashboardSectionLink } from "@/components/dashboard/dashboard-section-link";
import { DashboardStat } from "@/components/dashboard/dashboard-stat";
import { dashboardPath } from "@/lib/dashboard-routes";
import type { MemberProfileRow } from "@/lib/dashboard/profile-types";

export function CreatorOverview({ profile }: { profile: MemberProfileRow }) {
  const stats = [
    {
      label: "Celkový výdělek",
      value: "0 Kč",
      hint: "zatím žádné dokončené objednávky",
      accent: true,
    },
    {
      label: "Aktivní objednávky",
      value: "0",
      hint: "čekají na nahrání nebo schválení",
    },
    {
      label: "Dokončené kampaně",
      value: "0",
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
            href={dashboardPath(profile.slug, "balicky")}
            icon={Package}
            title="Balíčky"
            description="Nastav ceny, formáty a licence. Značky uvidí balíčky po rozkliknutí tvého profilu."
          />
          <DashboardSectionLink
            href={dashboardPath(profile.slug, "profil")}
            icon={UserRound}
            title="Profil"
            description="Avatar, bio, sítě a portfolio ve veřejném profilu."
          />
        </div>
      </div>
    </div>
  );
}
