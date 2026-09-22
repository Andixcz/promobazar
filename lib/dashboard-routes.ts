export type DashboardSection = "profil" | "nastaveni" | "balicky" | "poptavky";

export function dashboardPath(
  slug: string,
  section?: DashboardSection,
): string {
  const base = `/dashboard/${slug}`;
  if (!section) return base;
  return `${base}/${section}`;
}

export const DASHBOARD_HOME_PATH = "/dashboard";
