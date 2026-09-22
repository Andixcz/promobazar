/** Veřejné landing routy (App Router). */

export const LANDING_FIRMS_PATH = "/";
export const LANDING_CREATORS_PATH = "/pro-tvurce";

export function isCreatorsLandingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === LANDING_CREATORS_PATH ||
    pathname.startsWith(`${LANDING_CREATORS_PATH}/`)
  );
}

export function landingHref(
  view: "firms" | "creators",
  sectionId?: string,
): string {
  const base =
    view === "creators" ? LANDING_CREATORS_PATH : LANDING_FIRMS_PATH;
  return sectionId ? `${base}#${sectionId}` : base;
}
