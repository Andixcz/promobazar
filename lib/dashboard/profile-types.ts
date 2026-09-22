import type { memberProfile } from "@/lib/db/schema";

export type MemberProfileRow = typeof memberProfile.$inferSelect;

export type DashboardBadge = {
  id: string;
  label: string;
  earned: boolean;
  hint: string;
};
