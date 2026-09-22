import { Check, Lock, Trophy } from "lucide-react";

import type { DashboardBadge } from "@/lib/dashboard/profile-types";
import { cn } from "@/lib/utils";
import { surface } from "@/lib/ui-surfaces";

function BadgeIcon({ id }: { id: string }) {
  if (id.includes("top") || id.includes("earner")) {
    return <Trophy className="size-5 text-cyan" aria-hidden />;
  }
  if (id.includes("verified")) {
    return <Check className="size-5 text-cyan" aria-hidden />;
  }
  return <Lock className="size-5 text-mist" aria-hidden />;
}

export function ProfileBadges({ badges }: { badges: DashboardBadge[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          title={badge.hint}
          className={cn(
            surface,
            "flex items-center gap-3 p-4 transition-opacity",
            !badge.earned && "opacity-45",
          )}
        >
          <BadgeIcon id={badge.id} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {badge.label}
            </p>
            <p className="text-[11px] text-zinc-200">
              {badge.earned ? "Získáno" : "Zamčeno"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
