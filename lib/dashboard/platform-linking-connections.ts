import "server-only";

import { and, eq } from "drizzle-orm";

import type {
  CreatorPlatformId,
  PlatformConnectionSummary,
} from "@/lib/dashboard/creator-platform";
import { db } from "@/lib/db";
import { creatorPlatformLink, memberProfile } from "@/lib/db/schema";

export type PlatformTokenBundle = {
  platformUserId: string;
  username: string;
  accessToken: string;
  refreshToken?: string | null;
  tokenExpiresAt?: Date | null;
};

export async function listCreatorPlatformConnections(
  userId: string,
): Promise<PlatformConnectionSummary[]> {
  const rows = await db
    .select({
      platform: creatorPlatformLink.platform,
      platformUserId: creatorPlatformLink.platformUserId,
      username: creatorPlatformLink.username,
      connectedAt: creatorPlatformLink.connectedAt,
    })
    .from(creatorPlatformLink)
    .where(eq(creatorPlatformLink.userId, userId));

  return rows.map((row) => ({
    platform: row.platform,
    platformUserId: row.platformUserId,
    username: row.username,
    connectedAt: row.connectedAt.toISOString(),
  }));
}

export async function upsertCreatorPlatformConnection(
  userId: string,
  platform: CreatorPlatformId,
  bundle: PlatformTokenBundle,
) {
  await db
    .insert(creatorPlatformLink)
    .values({
      userId,
      platform,
      platformUserId: bundle.platformUserId,
      username: bundle.username,
      accessToken: bundle.accessToken,
      refreshToken: bundle.refreshToken ?? null,
      tokenExpiresAt: bundle.tokenExpiresAt ?? null,
    })
    .onConflictDoUpdate({
      target: [creatorPlatformLink.userId, creatorPlatformLink.platform],
      set: {
        platformUserId: bundle.platformUserId,
        username: bundle.username,
        accessToken: bundle.accessToken,
        refreshToken: bundle.refreshToken ?? null,
        tokenExpiresAt: bundle.tokenExpiresAt ?? null,
      },
    });

  if (platform === "tiktok") {
    await db
      .update(memberProfile)
      .set({ socialTiktok: bundle.username })
      .where(eq(memberProfile.userId, userId));
  }
  if (platform === "instagram") {
    await db
      .update(memberProfile)
      .set({ socialInstagram: bundle.username })
      .where(eq(memberProfile.userId, userId));
  }
  if (platform === "youtube") {
    await db
      .update(memberProfile)
      .set({ socialYoutube: bundle.username })
      .where(eq(memberProfile.userId, userId));
  }
}

export async function removeCreatorPlatformConnection(
  userId: string,
  platform: CreatorPlatformId,
) {
  await db.delete(creatorPlatformLink).where(
    and(
      eq(creatorPlatformLink.userId, userId),
      eq(creatorPlatformLink.platform, platform),
    ),
  );
}
