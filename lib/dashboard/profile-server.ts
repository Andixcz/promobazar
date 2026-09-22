import "server-only";

import { count, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  brandJobPost,
  creatorPackage,
  memberProfile,
  type MemberRole,
} from "@/lib/db/schema";
import { slugifyBase } from "@/lib/dashboard/slug";
import type {
  DashboardBadge,
  MemberProfileRow,
} from "@/lib/dashboard/profile-types";

export type { DashboardBadge, MemberProfileRow };

export async function getProfileBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(memberProfile)
    .where(eq(memberProfile.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getProfileByUserId(userId: string) {
  const [row] = await db
    .select()
    .from(memberProfile)
    .where(eq(memberProfile.userId, userId))
    .limit(1);
  return row ?? null;
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let n = 2;
  while (true) {
    const existing = await getProfileBySlug(candidate);
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

export async function ensureMemberProfile(
  userId: string,
  name: string,
  email: string,
  preferredRole?: MemberRole,
): Promise<MemberProfileRow> {
  const existing = await getProfileByUserId(userId);
  if (existing) return existing;

  const slug = await uniqueSlug(slugifyBase(name || email.split("@")[0]));
  const role: MemberRole =
    preferredRole === "creator" || preferredRole === "brand"
      ? preferredRole
      : "brand";

  const [created] = await db
    .insert(memberProfile)
    .values({
      userId,
      slug,
      role,
      displayName: name.trim() || email,
      category: "fitness",
      portfolioUrls: [],
    })
    .returning();

  return created;
}

export async function assertProfileOwner(
  userId: string,
  slug: string,
): Promise<MemberProfileRow | null> {
  const profile = await getProfileBySlug(slug);
  if (!profile || profile.userId !== userId) return null;
  return profile;
}

export async function computeBadges(
  profile: MemberProfileRow,
): Promise<DashboardBadge[]> {
  if (profile.role === "creator") {
    const [pkgRow] = await db
      .select({ total: count() })
      .from(creatorPackage)
      .where(eq(creatorPackage.userId, profile.userId));
    const pkgCount = pkgRow?.total ?? 0;
    const hasProfile =
      Boolean(profile.displayName?.trim()) && Boolean(profile.bio?.trim());

    return [
      {
        id: "verified-creator",
        label: "Ověřený tvůrce",
        earned: hasProfile && pkgCount >= 1,
        hint: "Vyplň profil a přidej alespoň jeden balíček.",
      },
      {
        id: "top-earner",
        label: "Top Earner",
        earned: false,
        hint: "Získáš první přijatou objednávkou.",
      },
      {
        id: "active-creator",
        label: "Aktivní tvůrce",
        earned: pkgCount >= 2,
        hint: "Měj 2 a více aktivních balíčků.",
      },
    ];
  }

  const [jobRow] = await db
    .select({ total: count() })
    .from(brandJobPost)
    .where(eq(brandJobPost.userId, profile.userId));
  const jobCount = jobRow?.total ?? 0;

  return [
    {
      id: "verified-brand",
      label: "Ověřená značka",
      earned: true,
      hint: "Aktivní po přihlášení jako značka.",
    },
    {
      id: "top-client",
      label: "TOP Zadavatel",
      earned: jobCount >= 1,
      hint: "Získáš první zveřejněnou poptávkou.",
    },
    {
      id: "regular",
      label: "Stálý zákazník",
      earned: jobCount >= 3,
      hint: "Zveřejni 3 a více poptávek.",
    },
  ];
}
