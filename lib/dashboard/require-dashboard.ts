import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { getServerSession } from "@/lib/auth-session";
import { AUTH_LOGIN_PATH } from "@/lib/auth-routes";
import { DASHBOARD_HOME_PATH } from "@/lib/dashboard-routes";
import { ensureMemberProfile } from "@/lib/dashboard/profile-server";
import {
  DASHBOARD_ROLE_COOKIE,
  DASHBOARD_ROLE_HEADER,
  parseDashboardRole,
} from "@/lib/dashboard/role-preference";

export const requireDashboard = cache(async (callbackPath = DASHBOARD_HOME_PATH) => {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(
      `${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(callbackPath)}`,
    );
  }

  const headerStore = await headers();
  const roleFromProxy = parseDashboardRole(
    headerStore.get(DASHBOARD_ROLE_HEADER),
  );
  const cookieStore = await cookies();
  const roleFromCookie = parseDashboardRole(
    cookieStore.get(DASHBOARD_ROLE_COOKIE)?.value,
  );
  const preferredRole = roleFromProxy ?? roleFromCookie;

  const profile = await ensureMemberProfile(
    session.user.id,
    session.user.name,
    session.user.email,
    preferredRole,
  );

  return { session, profile };
});
