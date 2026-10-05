import { Suspense } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfilePlatformLinking } from "@/components/dashboard/profile-platform-linking";
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";
import { listConfiguredCreatorPlatforms } from "@/lib/dashboard/platform-linking-env";
import { listCreatorPlatformConnections } from "@/lib/dashboard/platform-linking-connections";
import { canUsePlatformLinking } from "@/lib/dashboard/member-role";
import { computeBadges } from "@/lib/dashboard/profile-server";
import { requireDashboard } from "@/lib/dashboard/require-dashboard";

export default async function DashboardProfilePage() {
  const { session, profile } = await requireDashboard();
  const badges = await computeBadges(profile);
  const linkingEnabled = canUsePlatformLinking(profile.role);
  const configuredPlatforms = linkingEnabled
    ? listConfiguredCreatorPlatforms()
    : [];
  const platformConnections = linkingEnabled
    ? await listCreatorPlatformConnections(profile.userId)
    : [];

  return (
    <DashboardShell title="Profil" description="Veřejný profil v tržišti.">
      <ProfileSettingsForm
        profile={profile}
        email={session.user.email}
        badges={badges}
        platformLinkingSlot={
          linkingEnabled ? (
            <Suspense fallback={null}>
              <ProfilePlatformLinking
                configuredPlatforms={configuredPlatforms}
                connections={platformConnections}
              />
            </Suspense>
          ) : null
        }
      />
    </DashboardShell>
  );
}
