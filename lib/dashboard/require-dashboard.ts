import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { getServerSession } from "@/lib/auth-session";
import { AUTH_LOGIN_PATH } from "@/lib/auth-routes";
import { DASHBOARD_HOME_PATH } from "@/lib/dashboard-routes";
import { ensureMemberProfile } from "@/lib/dashboard/profile-server";
import type { MemberRole } from "@/lib/db/schema";

const ROLE_COOKIE = "pb_dashboard_role";

function preferredRoleFromCookie(
  value: string | undefined,
): MemberRole | undefined {
  if (value === "creator" || value === "brand" || value === "buyer") {
    return value;
  }
  return undefined;
}

export const requireDashboard = cache(async (callbackPath = DASHBOARD_HOME_PATH) => {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(
      `${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(callbackPath)}`,
    );
  }

  const cookieStore = await cookies();
  const roleCookie = cookieStore.get(ROLE_COOKIE)?.value;
  const preferredRole = preferredRoleFromCookie(roleCookie);
  if (preferredRole) {
    cookieStore.delete(ROLE_COOKIE);
  }

  const profile = await ensureMemberProfile(
    session.user.id,
    session.user.name,
    session.user.email,
    preferredRole,
  );

  return { session, profile };
});
