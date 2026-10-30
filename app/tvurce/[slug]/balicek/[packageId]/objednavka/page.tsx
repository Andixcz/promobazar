import { notFound, redirect } from "next/navigation";

import { PackageOrderView } from "@/components/marketplace/package-order-view";
import { SiteShell } from "@/components/shared/site-shell";
import { getServerSession } from "@/lib/auth-session";
import { packagePublicPath } from "@/lib/marketplace/public-routes";
import { getPublicPackageGig } from "@/lib/marketplace/public-server";

type PageProps = {
  params: Promise<{ slug: string; packageId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug, packageId } = await params;
  const session = await getServerSession();
  const gig = await getPublicPackageGig(
    slug,
    packageId,
    session?.user?.id ?? null,
  );
  if (!gig) return { title: "Objednávka" };
  return {
    title: `Objednávka · ${gig.pkg.name}`,
    description: `Zadání a platba balíčku ${gig.pkg.name}`,
  };
}

export default async function PackageOrderPage({ params }: PageProps) {
  const { slug, packageId } = await params;
  const session = await getServerSession();
  const viewerId = session?.user?.id ?? null;

  const gig = await getPublicPackageGig(slug, packageId, viewerId);
  if (!gig) notFound();

  const isOwner = viewerId === gig.creator.userId;

  if (gig.pkg.status !== "published") {
    if (gig.pkg.status === "draft" || gig.pkg.status === "private") {
      if (isOwner) {
        redirect(packagePublicPath(slug, packageId));
      }
    }
    notFound();
  }

  return (
    <SiteShell>
      <PackageOrderView creator={gig.creator} pkg={gig.pkg} />
    </SiteShell>
  );
}
