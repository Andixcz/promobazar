export type DashboardSection =
  | "profil"
  | "nastaveni"
  | "balicky"
  | "poptavky"
  | "objednavky";

const RESERVED_SEGMENTS = new Set<DashboardSection>([
  "profil",
  "nastaveni",
  "balicky",
  "poptavky",
  "objednavky",
]);
export function isReservedDashboardSegment(segment: string): boolean {
  return RESERVED_SEGMENTS.has(segment as DashboardSection);
}

export function dashboardPath(section?: DashboardSection): string {
  if (!section) return DASHBOARD_HOME_PATH;
  return `${DASHBOARD_HOME_PATH}/${section}`;
}

export const DASHBOARD_HOME_PATH = "/dashboard";
