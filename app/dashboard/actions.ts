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
  normalizePackageBannerUrl,
  normalizePackageShowcaseUrls,
  PACKAGE_SHOWCASE_MAX,
} from "@/lib/dashboard/package-media";
import { isAllowedProfileMediaUrl } from "@/lib/storage/storage-url";
import {
  DELIVERY_OPTIONS,
  PACKAGE_FORMATS,
  PACKAGE_LICENSE_OPTIONS,
} from "@/lib/dashboard/categories";
import {
  brandJobPost,
  creatorPackage,
  memberProfile,
  type MemberRole,
} from "@/lib/db/schema";

function revalidateDashboard(packageId?: string) {
  revalidatePath(dashboardPath());
  revalidatePath(dashboardPath("profil"));
  revalidatePath(dashboardPath("nastaveni"));
  revalidatePath(dashboardPath("balicky"));
  revalidatePath(`${dashboardPath("balicky")}/novy`);
  if (packageId) {
    revalidatePath(`${dashboardPath("balicky")}/${packageId}`);
  }
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

  const nextAvatar = input.avatarUrl ?? profile.avatarUrl;
  const nextBanner = input.bannerUrl ?? profile.bannerUrl;
  if (!isAllowedProfileMediaUrl(nextAvatar) || !isAllowedProfileMediaUrl(nextBanner)) {
    return {
      ok: false as const,
      error: "Neplatná URL profilového obrázku.",
    };
  }

  await db
    .update(memberProfile)
    .set({
      displayName: input.displayName.trim() || session.user.email,
      bio: input.bio.trim(),
      category: input.category,
      portfolioUrls: input.portfolioUrls.filter(Boolean).slice(0, 3),
      avatarUrl: nextAvatar,
      bannerUrl: nextBanner,
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
  showcaseUrls?: string[];
  bannerUrl?: string | null;
};

/** Stejná pravidla pro vytvoření i úpravu; cena drží limity checkoutu (100 až 500 000 Kč). */
function validatePackage(input: PackageInput, userId: string) {
  const name = String(input.name ?? "").trim();
  const description = String(input.description ?? "").trim();
  if (name.length < 3 || name.length > 120) {
    return { ok: false as const, error: "Název musí mít 3 až 120 znaků." };
  }
  if (description.length < 10 || description.length > 2000) {
    return { ok: false as const, error: "Popis musí mít 10 až 2000 znaků." };
  }
  if (!PACKAGE_FORMATS.some((f) => f.value === input.format)) {
    return { ok: false as const, error: "Vyber formát." };
  }
  if (!DELIVERY_OPTIONS.some((d) => d.value === input.deliveryDays)) {
    return { ok: false as const, error: "Vyber dobu doručení." };
  }
  if (!PACKAGE_LICENSE_OPTIONS.some((l) => l.value === input.licenseDays)) {
    return { ok: false as const, error: "Vyber délku licence." };
  }
  if (!Number.isInteger(input.revisions) || input.revisions < 0 || input.revisions > 5) {
    return { ok: false as const, error: "Počet revizí musí být 0 až 5." };
  }
  if (!Number.isInteger(input.priceCzk) || input.priceCzk < 100 || input.priceCzk > 500_000) {
    return { ok: false as const, error: "Cena musí být celé koruny mezi 100 a 500 000 Kč." };
  }

  if ((input.showcaseUrls?.length ?? 0) > PACKAGE_SHOWCASE_MAX) {
    return {
      ok: false as const,
      error: `Maximálně ${PACKAGE_SHOWCASE_MAX} ukázkových fotek.`,
    };
  }
  const showcaseUrls = normalizePackageShowcaseUrls(input.showcaseUrls, userId);
  const bannerUrl = normalizePackageBannerUrl(input.bannerUrl, showcaseUrls);

  return {
    ok: true as const,
    values: {
      name,
      format: input.format,
      deliveryDays: input.deliveryDays,
      revisions: input.revisions,
      licenseDays: input.licenseDays,
      priceCzk: input.priceCzk,
      description,
      showcaseUrls,
      bannerUrl,
    },
  };
}

export async function createCreatorPackage(input: PackageInput) {
  const ctx = await ownedProfile();
  if (!ctx.ok) return ctx;
  const { profile } = ctx;

  if (profile.role !== "creator") {
    return { ok: false as const, error: "Balíčky může spravovat jen tvůrce." };
  }
  const valid = validatePackage(input, profile.userId);
  if (!valid.ok) return valid;

  const id = crypto.randomUUID();
  await db.insert(creatorPackage).values({
    id,
    userId: profile.userId,
    ...valid.values,
  });

  revalidateDashboard(id);
  return { ok: true as const, id };
}

/** Objednávky si drží vlastní kopii názvu a ceny, úprava je nezmění. */
export async function updateCreatorPackage(packageId: string, input: PackageInput) {
  const ctx = await ownedProfile();
  if (!ctx.ok) return ctx;
  const { profile } = ctx;

  if (profile.role !== "creator") {
    return { ok: false as const, error: "Balíčky může spravovat jen tvůrce." };
  }
  const valid = validatePackage(input, profile.userId);
  if (!valid.ok) return valid;

  const [updated] = await db
    .update(creatorPackage)
    .set(valid.values)
    .where(
      and(
        eq(creatorPackage.id, packageId),
        eq(creatorPackage.userId, profile.userId),
      ),
    )
    .returning({ id: creatorPackage.id });
  if (!updated) return { ok: false as const, error: "Balíček jsme nenašli." };

  revalidateDashboard(packageId);
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

  revalidateDashboard(packageId);
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
