import { notFound } from "next/navigation";

import { PackageGigView } from "@/components/marketplace/public-marketplace-views";
import { SiteShell } from "@/components/shared/site-shell";
import { getServerSession } from "@/lib/auth-session";
import {
  getPublicPackageGig,
  listCreatorPackagesForProfile,
} from "@/lib/marketplace/public-server";

type PageProps = {
  params: Promise<{ slug: string; packageId: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug, packageId } = await params;
  const session = await getServerSession();
  const gig = await getPublicPackageGig(
    slug,
    packageId,
    session?.user?.id ?? null,
  );
  if (!gig) return { title: "Balíček" };
  return {
    title: `${gig.pkg.name} · ${gig.creator.displayName}`,
    description: gig.pkg.description.slice(0, 160),
  };
}

export default async function PackageGigPage({ params, searchParams }: PageProps) {
  const { slug, packageId } = await params;
  const { preview } = await searchParams;
  const session = await getServerSession();
  const viewerId = session?.user?.id ?? null;

  const gig = await getPublicPackageGig(slug, packageId, viewerId);
  if (!gig) notFound();

  const isOwner = viewerId === gig.creator.userId;

  const previewMode =
    preview === "1" && gig.pkg.status === "draft" && isOwner;

  if (gig.pkg.status === "draft" && !previewMode) {
    notFound();
  }

  if (gig.pkg.status === "private" && !isOwner) {
    notFound();
  }

  const privateMode = gig.pkg.status === "private" && isOwner;

  const siblings = await listCreatorPackagesForProfile(gig.creator.userId, {
    includeDraftsForUserId: isOwner ? viewerId : null,
  });

  const tierList = siblings
    .filter((p) => {
      if (previewMode) return p.status === "draft";
      if (privateMode) return p.status === "private";
      return p.status === "published";
    })
    .map((p) => ({ id: p.id, name: p.name, priceCzk: p.priceCzk }));

  const otherPackages = siblings.filter((p) => {
    if (p.id === gig.pkg.id) return false;
    if (previewMode) return p.status === "draft";
    if (privateMode) return p.status === "private";
    return p.status === "published";
  });

  return (
    <SiteShell>
      <PackageGigView
        creator={gig.creator}
        pkg={gig.pkg}
        siblingPackages={tierList}
        otherPackages={otherPackages}
        previewMode={previewMode}
        privateMode={privateMode}
      />
    </SiteShell>
  );
}
