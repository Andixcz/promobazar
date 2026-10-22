import { DASHBOARD_HOME_PATH } from "@/lib/dashboard-routes";

/** Role volitelná při registraci (bez „buyer“ — ten přijde z objednávky). */
export type AuthRegisterRole = "creator" | "brand";

export function isAuthRegisterRole(
  value: string | null | undefined,
): value is AuthRegisterRole {
  return value === "creator" || value === "brand";
}

/** Po registraci vždy dashboard — proxy nastaví `pb_dashboard_role` z query. */
export function buildRegisterCallbackUrl(role: AuthRegisterRole): string {
  return `${DASHBOARD_HOME_PATH}?role=${role}`;
}
