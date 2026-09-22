import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth-session";
import { AUTH_LOGIN_PATH } from "@/lib/auth-routes";
import { dashboardPath } from "@/lib/dashboard-routes";
import { ensureMemberProfile } from "@/lib/dashboard/profile-server";

export default async function DashboardSettingsShortcutPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`${AUTH_LOGIN_PATH}?callbackUrl=${encodeURIComponent("/dashboard/nastaveni")}`);
  }
  const profile = await ensureMemberProfile(
    session.user.id,
    session.user.name,
    session.user.email,
  );
  redirect(dashboardPath(profile.slug, "nastaveni"));
}
