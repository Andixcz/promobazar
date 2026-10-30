import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";

import { categoryLabel } from "@/lib/dashboard/categories";
import { initialsFromName } from "@/lib/dashboard/slug";
import { db } from "@/lib/db";
import {
  creatorPackage,
  memberProfile,
  type CreatorPackageStatus,
} from "@/lib/db/schema";
import type { MarketplaceCreator } from "@/lib/marketplace";

export type PublicCreatorProfile = {
  userId: string;
  slug: string;
  displayName: string;
  bio: string;
  category: string;
  categoryLabel: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  initials: string;
};

export type PublicPackageRow = {
  id: string;
  name: string;
  format: string;
  deliveryDays: number;
  revisions: number;
  licenseDays: string;
  priceCzk: number;
  description: string;
  showcaseUrls: string[];
  bannerUrl: string | null;
  previewVideoUrl: string | null;
  status: CreatorPackageStatus;
  sortOrder: number;
};

export async function getPublicCreatorBySlug(slug: string) {
  const [row] = await db
    .select({
      userId: memberProfile.userId,
      slug: memberProfile.slug,
      displayName: memberProfile.displayName,
      bio: memberProfile.bio,
      category: memberProfile.category,
      avatarUrl: memberProfile.avatarUrl,
      bannerUrl: memberProfile.bannerUrl,
      role: memberProfile.role,
    })
    .from(memberProfile)
    .where(eq(memberProfile.slug, slug))
    .limit(1);

  if (!row || row.role !== "creator") return null;

  const name = row.displayName?.trim() || row.slug;
  return {
    userId: row.userId,
    slug: row.slug,
    displayName: name,
    bio: row.bio?.trim() ?? "",
    category: row.category ?? "fitness",
    categoryLabel: categoryLabel(row.category ?? "fitness"),
    avatarUrl: row.avatarUrl,
    bannerUrl: row.bannerUrl,
    initials: initialsFromName(name, row.slug),
  } satisfies PublicCreatorProfile;
}

export async function listCreatorPackagesForProfile(
  creatorUserId: string,
  options: { includeDraftsForUserId?: string | null },
) {
  const viewerId = options.includeDraftsForUserId;
  const statusFilter =
    viewerId === creatorUserId
      ? inArray(creatorPackage.status, ["draft", "published", "private"])
      : eq(creatorPackage.status, "published");

  return db
    .select({
      id: creatorPackage.id,
      name: creatorPackage.name,
      format: creatorPackage.format,
      deliveryDays: creatorPackage.deliveryDays,
      revisions: creatorPackage.revisions,
      licenseDays: creatorPackage.licenseDays,
      priceCzk: creatorPackage.priceCzk,
      description: creatorPackage.description,
      showcaseUrls: creatorPackage.showcaseUrls,
      bannerUrl: creatorPackage.bannerUrl,
      previewVideoUrl: creatorPackage.previewVideoUrl,
      status: creatorPackage.status,
      sortOrder: creatorPackage.sortOrder,
    })
    .from(creatorPackage)
    .where(and(eq(creatorPackage.userId, creatorUserId), statusFilter))
    .orderBy(asc(creatorPackage.sortOrder), asc(creatorPackage.createdAt));
}

export async function getPublicPackageGig(
  creatorSlug: string,
  packageId: string,
  viewerUserId?: string | null,
) {
  const creator = await getPublicCreatorBySlug(creatorSlug);
  if (!creator) return null;

  const [pkg] = await db
    .select()
    .from(creatorPackage)
    .where(
      and(
        eq(creatorPackage.id, packageId),
        eq(creatorPackage.userId, creator.userId),
      ),
    )
    .limit(1);
  if (!pkg) return null;

  const ownerCanView =
    viewerUserId === creator.userId &&
    (pkg.status === "draft" || pkg.status === "private");
  if (pkg.status !== "published" && !ownerCanView) return null;

  return { creator, pkg };
}

function formatFollowersPlaceholder() {
  return "-";
}

export async function listMarketplaceCreatorsFromDb(): Promise<
  MarketplaceCreator[]
> {
  const profiles = await db
    .select({
      slug: memberProfile.slug,
      displayName: memberProfile.displayName,
      category: memberProfile.category,
      avatarUrl: memberProfile.avatarUrl,
      userId: memberProfile.userId,
    })
    .from(memberProfile)
    .where(eq(memberProfile.role, "creator"));

  if (!profiles.length) return [];

  const userIds = profiles.map((p) => p.userId);
  const packages = await db
    .select({
      userId: creatorPackage.userId,
      id: creatorPackage.id,
      name: creatorPackage.name,
      priceCzk: creatorPackage.priceCzk,
      licenseDays: creatorPackage.licenseDays,
      format: creatorPackage.format,
      bannerUrl: creatorPackage.bannerUrl,
      showcaseUrls: creatorPackage.showcaseUrls,
    })
    .from(creatorPackage)
    .where(
      and(
        inArray(creatorPackage.userId, userIds),
        eq(creatorPackage.status, "published"),
      ),
    )
    .orderBy(asc(creatorPackage.sortOrder), asc(creatorPackage.createdAt));

  const byUser = new Map<string, typeof packages>();
  for (const pkg of packages) {
    const list = byUser.get(pkg.userId) ?? [];
    list.push(pkg);
    byUser.set(pkg.userId, list);
  }

  const creators: MarketplaceCreator[] = [];
  for (const profile of profiles) {
    const userPackages = byUser.get(profile.userId);
    if (!userPackages?.length) continue;

    const name = profile.displayName?.trim() || profile.slug;
    const platforms = [
      ...new Set(userPackages.map((p) => p.format).filter(Boolean)),
    ];

    creators.push({
      slug: profile.slug,
      name,
      initials: initialsFromName(name, profile.slug),
      category: profile.category ?? "fitness",
      categoryLabel: categoryLabel(profile.category ?? "fitness"),
      followers: formatFollowersPlaceholder(),
      reach: formatFollowersPlaceholder(),
      audienceAge: "18-34",
      platforms,
      packages: userPackages.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.priceCzk,
        license: p.licenseDays,
        format: p.format,
        bannerUrl: p.bannerUrl,
        showcaseUrls: p.showcaseUrls ?? [],
      })),
      avatarUrl: profile.avatarUrl,
    });
  }

  return creators;
}
