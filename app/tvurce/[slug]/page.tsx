import { notFound } from "next/navigation";

import { CreatorPublicView } from "@/components/marketplace/public-marketplace-views";
import { SiteShell } from "@/components/shared/site-shell";
import { getServerSession } from "@/lib/auth-session";
import {
  getPublicCreatorBySlug,
  listCreatorPackagesForProfile,
} from "@/lib/marketplace/public-server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const creator = await getPublicCreatorBySlug(slug);
  if (!creator) return { title: "Tvůrce" };
  return {
    title: `${creator.displayName} · balíčky`,
    description: creator.bio || `Balíčky tvůrce ${creator.displayName} na promobazar.cz`,
  };
}

export default async function CreatorPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const creator = await getPublicCreatorBySlug(slug);
  if (!creator) notFound();

  const session = await getServerSession();
  const viewerId = session?.user?.id ?? null;
  const packages = await listCreatorPackagesForProfile(creator.userId, {
    includeDraftsForUserId: viewerId,
  });

  const visible =
    viewerId === creator.userId
      ? packages
      : packages.filter((p) => p.status === "published");

  if (!visible.length && viewerId !== creator.userId) {
    notFound();
  }

  return (
    <SiteShell>
      <CreatorPublicView
        creator={creator}
        packages={visible}
        isOwnerView={viewerId === creator.userId}
      />
    </SiteShell>
  );
}
