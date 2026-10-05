"use server";

import { and, eq } from "drizzle-orm";

import type { CreatorPlatformId } from "@/lib/dashboard/creator-platform";
import { isCreatorPlatformLinkingConfigured } from "@/lib/dashboard/platform-linking-env";
import { removeCreatorPlatformConnection } from "@/lib/dashboard/platform-linking-connections";
import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/auth-session";
import { dashboardPath } from "@/lib/dashboard-routes";
import {
  ensureMemberProfile,
  getProfileByUserId,
} from "@/lib/dashboard/profile-server";
import { db } from "@/lib/db";
import {
  brandJobPost,
  creatorPackage,
  memberProfile,
  type MemberRole,
} from "@/lib/db/schema";

function revalidateDashboard() {
  revalidatePath(dashboardPath());
  revalidatePath(dashboardPath("profil"));
  revalidatePath(dashboardPath("nastaveni"));
  revalidatePath(dashboardPath("balicky"));
  revalidatePath(dashboardPath("poptavky"));
  revalidatePath(dashboardPath("objednavky"));
}

async function ownedProfile() {
  const session = await getServerSession();
  if (!session?.user) {
    return { ok: false as const, error: "Nepřihlášený uživatel." };
  }

  const profile =
    (await getProfileByUserId(session.user.id)) ??
    (await ensureMemberProfile(
      session.user.id,
      session.user.name,
      session.user.email,
    ));

  return { ok: true as const, session, profile };
}

export async function saveProfileSettings(input: {
  displayName: string;
  bio: string;
  category: string;
  portfolioUrls: string[];
  avatarUrl?: string | null;
  bannerUrl?: string | null;
}) {
  const ctx = await ownedProfile();
  if (!ctx.ok) return ctx;
  const { session, profile } = ctx;

  await db
    .update(memberProfile)
    .set({
      displayName: input.displayName.trim() || session.user.email,
      bio: input.bio.trim(),
      category: input.category,
      portfolioUrls: input.portfolioUrls.filter(Boolean).slice(0, 3),
      avatarUrl: input.avatarUrl ?? profile.avatarUrl,
      bannerUrl: input.bannerUrl ?? profile.bannerUrl,
    })
    .where(eq(memberProfile.userId, profile.userId));

  revalidateDashboard();
  return { ok: true as const };
}

export async function saveMemberRole(role: MemberRole) {
  const ctx = await ownedProfile();
  if (!ctx.ok) return ctx;
  const { profile } = ctx;

  if (role !== "creator" && role !== "brand" && role !== "buyer") {
    return { ok: false as const, error: "Neplatná role." };
  }

  await db
    .update(memberProfile)
    .set({ role })
    .where(eq(memberProfile.userId, profile.userId));

  revalidateDashboard();
  return { ok: true as const };
}

export type PackageInput = {
  name: string;
  format: string;
  deliveryDays: number;
  revisions: number;
  licenseDays: string;
  priceCzk: number;
  description: string;
};

export async function createCreatorPackage(input: PackageInput) {
  const ctx = await ownedProfile();
  if (!ctx.ok) return ctx;
  const { profile } = ctx;

  if (profile.role !== "creator") {
    return { ok: false as const, error: "Balíčky může spravovat jen tvůrce." };
  }

  const id = crypto.randomUUID();
  await db.insert(creatorPackage).values({
    id,
    userId: profile.userId,
    name: input.name.trim(),
    format: input.format,
    deliveryDays: input.deliveryDays,
    revisions: input.revisions,
    licenseDays: input.licenseDays,
    priceCzk: input.priceCzk,
    description: input.description.trim(),
  });

  revalidateDashboard();
  return { ok: true as const };
}

export async function deleteCreatorPackage(packageId: string) {
  const ctx = await ownedProfile();
  if (!ctx.ok) return ctx;
  const { profile } = ctx;

  await db.delete(creatorPackage).where(
    and(
      eq(creatorPackage.id, packageId),
      eq(creatorPackage.userId, profile.userId),
    ),
  );

  revalidateDashboard();
  return { ok: true as const };
}

export async function createBrandJob(input: {
  title: string;
  category: string;
  budgetCzk: number;
  description: string;
}) {
  const ctx = await ownedProfile();
  if (!ctx.ok) return ctx;
  const { profile } = ctx;

  if (profile.role !== "brand") {
    return { ok: false as const, error: "Poptávky může zveřejnit jen značka." };
  }

  await db.insert(brandJobPost).values({
    id: crypto.randomUUID(),
    userId: profile.userId,
    title: input.title.trim(),
    category: input.category,
    budgetCzk: input.budgetCzk,
    description: input.description.trim(),
    status: "open",
  });

  revalidateDashboard();
  return { ok: true as const };
}

export async function disconnectCreatorPlatform(platform: CreatorPlatformId) {
  const ctx = await ownedProfile();
  if (!ctx.ok) return ctx;
  const { profile } = ctx;

  if (profile.role !== "creator" && profile.role !== "brand") {
    return {
      ok: false as const,
      error: "Propojení účtů na sítích je jen pro tvůrce a značky.",
    };
  }

  if (!isCreatorPlatformLinkingConfigured(platform)) {
    return { ok: false as const, error: "Tuto síť teď nelze propojit." };
  }

  await removeCreatorPlatformConnection(profile.userId, platform);
  revalidateDashboard();
  return { ok: true as const };
}

export async function ensureProfileForSession(preferredRole?: MemberRole) {
  const session = await getServerSession();
  if (!session?.user) return null;
  return ensureMemberProfile(
    session.user.id,
    session.user.name,
    session.user.email,
    preferredRole,
  );
}
