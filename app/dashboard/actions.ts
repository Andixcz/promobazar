"use server";



import { and, eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";



import { getServerSession } from "@/lib/auth-session";

import { dashboardPath } from "@/lib/dashboard-routes";

import {

  assertProfileOwner,

  ensureMemberProfile,

} from "@/lib/dashboard/profile-server";

import { db } from "@/lib/db";

import {

  brandJobPost,

  creatorPackage,

  memberProfile,

  type MemberRole,

} from "@/lib/db/schema";



function revalidateDashboard(slug: string) {

  revalidatePath(dashboardPath(slug));

  revalidatePath(dashboardPath(slug, "profil"));
  revalidatePath(dashboardPath(slug, "nastaveni"));

  revalidatePath(dashboardPath(slug, "balicky"));

  revalidatePath(dashboardPath(slug, "poptavky"));

}



export async function saveProfileSettings(

  slug: string,

  input: {

    displayName: string;

    bio: string;

    category: string;

    socialTiktok: string;

    socialInstagram: string;

    socialYoutube: string;

    portfolioUrls: string[];

    avatarUrl?: string | null;

    bannerUrl?: string | null;

  },

) {

  const session = await getServerSession();

  if (!session?.user) return { ok: false as const, error: "Nepřihlášený uživatel." };



  const profile = await assertProfileOwner(session.user.id, slug);

  if (!profile) return { ok: false as const, error: "Profil nenalezen." };



  await db

    .update(memberProfile)

    .set({

      displayName: input.displayName.trim() || session.user.email,

      bio: input.bio.trim(),

      category: input.category,

      socialTiktok: input.socialTiktok.trim() || null,

      socialInstagram: input.socialInstagram.trim() || null,

      socialYoutube: input.socialYoutube.trim() || null,

      portfolioUrls: input.portfolioUrls.filter(Boolean).slice(0, 3),

      avatarUrl: input.avatarUrl ?? profile.avatarUrl,

      bannerUrl: input.bannerUrl ?? profile.bannerUrl,

    })

    .where(eq(memberProfile.userId, profile.userId));



  revalidateDashboard(slug);

  return { ok: true as const };

}



export async function saveMemberRole(slug: string, role: MemberRole) {

  const session = await getServerSession();

  if (!session?.user) return { ok: false as const, error: "Nepřihlášený uživatel." };



  const profile = await assertProfileOwner(session.user.id, slug);

  if (!profile) return { ok: false as const, error: "Profil nenalezen." };



  if (role !== "creator" && role !== "brand") {

    return { ok: false as const, error: "Neplatná role." };

  }



  await db

    .update(memberProfile)

    .set({ role })

    .where(eq(memberProfile.userId, profile.userId));



  revalidateDashboard(slug);

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



export async function createCreatorPackage(slug: string, input: PackageInput) {

  const session = await getServerSession();

  if (!session?.user) return { ok: false as const, error: "Nepřihlášený uživatel." };



  const profile = await assertProfileOwner(session.user.id, slug);

  if (!profile || profile.role !== "creator") {

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



  revalidateDashboard(slug);

  return { ok: true as const };

}



export async function deleteCreatorPackage(slug: string, packageId: string) {

  const session = await getServerSession();

  if (!session?.user) return { ok: false as const, error: "Nepřihlášený uživatel." };



  const profile = await assertProfileOwner(session.user.id, slug);

  if (!profile) return { ok: false as const, error: "Profil nenalezen." };



  await db.delete(creatorPackage).where(
    and(
      eq(creatorPackage.id, packageId),
      eq(creatorPackage.userId, profile.userId),
    ),
  );



  revalidateDashboard(slug);

  return { ok: true as const };

}



export async function createBrandJob(

  slug: string,

  input: {

    title: string;

    category: string;

    budgetCzk: number;

    description: string;

  },

) {

  const session = await getServerSession();

  if (!session?.user) return { ok: false as const, error: "Nepřihlášený uživatel." };



  const profile = await assertProfileOwner(session.user.id, slug);

  if (!profile || profile.role !== "brand") {

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



  revalidateDashboard(slug);

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


