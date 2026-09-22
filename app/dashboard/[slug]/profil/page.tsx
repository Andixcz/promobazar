import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";
import { computeBadges } from "@/lib/dashboard/profile-server";
import { requireDashboardProfile } from "@/lib/dashboard/require-dashboard";

type PageProps = { params: Promise<{ slug: string }> };

export default async function DashboardProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const { session, profile } = await requireDashboardProfile(slug);
  const badges = await computeBadges(profile);

  return (
    <DashboardShell title="Profil" description="Veřejný profil v tržišti.">
      <ProfileSettingsForm
        profile={profile}
        email={session.user.email}
        badges={badges}
      />
    </DashboardShell>
  );
}
