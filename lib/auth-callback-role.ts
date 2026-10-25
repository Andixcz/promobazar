export type LandingRoleHint = "creator" | "brand";

/** Role z callbackUrl (např. `/dashboard?role=creator` nebo `/pro-tvurce`). */
export function landingRoleFromCallbackUrl(
  callbackUrl: string,
): LandingRoleHint | null {
  try {
    const url = callbackUrl.startsWith("http")
      ? new URL(callbackUrl)
      : new URL(callbackUrl, "https://promobazar.cz");
    const role = url.searchParams.get("role");
    if (role === "creator" || role === "brand") return role;
    if (url.pathname === "/pro-tvurce" || url.pathname.startsWith("/pro-tvurce/")) {
      return "creator";
    }
    return null;
  } catch {
    return null;
  }
}

export function persistLandingRoleHint(role: LandingRoleHint): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("pb_userRole", role);
  localStorage.setItem("pb_pending_role", role);
}
