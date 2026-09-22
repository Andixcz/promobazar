import "server-only";

import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth-session";
import { AUTH_LOGIN_PATH } from "@/lib/auth-routes";
import { DASHBOARD_HOME_PATH } from "@/lib/dashboard-routes";
import {
  assertProfileOwner,
  ensureMemberProfile,
} from "@/lib/dashboard/profile-server";
import type { MemberRole } from "@/lib/db/schema";

export async function requireDashboardProfile(slug: string) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(`${DASHBOARD_HOME_PATH}/${slug}`)}`);
  }

  const profile = await assertProfileOwner(session.user.id, slug);
  if (!profile) {
    const own = await ensureMemberProfile(
      session.user.id,
      session.user.name,
      session.user.email,
    );
    if (own.slug !== slug) {
      redirect(`/dashboard/${own.slug}`);
    }
    return { session, profile: own };
  }

  return { session, profile };
}

export async function redirectToOwnDashboard(preferredRole?: MemberRole) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent(DASHBOARD_HOME_PATH)}`);
  }
  const profile = await ensureMemberProfile(
    session.user.id,
    session.user.name,
    session.user.email,
    preferredRole,
  );
  redirect(`/dashboard/${profile.slug}`);
}
