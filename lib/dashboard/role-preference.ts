import type { MemberRole } from "@/lib/db/schema";

export const DASHBOARD_ROLE_COOKIE = "pb_dashboard_role";

/** Předané z `proxy.ts` po jednorázovém přečtení cookie (smazání jen v proxy). */
export const DASHBOARD_ROLE_HEADER = "x-pb-dashboard-role";

/** Aktuální dashboard URL pro `callbackUrl` při redirectu na přihlášení. */
export const DASHBOARD_CALLBACK_HEADER = "x-pb-dashboard-callback";

export function parseDashboardRole(
  value: string | null | undefined,
): MemberRole | undefined {
  if (value === "creator" || value === "brand" || value === "buyer") {
    return value;
  }
  return undefined;
}
