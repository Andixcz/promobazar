import "server-only";

import { and, eq, or, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { marketplaceOrder } from "@/lib/db/schema";
import { storagePublicUrl } from "@/lib/storage/storage-url";

/** Tvůrce nebo zákazník u objednávky s danou přílohou. */
export async function canReadOrderBriefObject(
  objectKey: string,
  userId: string,
): Promise<boolean> {
  if (!objectKey.includes("/order-brief/")) return false;
  const url = storagePublicUrl(objectKey);
  const [row] = await db
    .select({ id: marketplaceOrder.id })
    .from(marketplaceOrder)
    .where(
      and(
        or(
          eq(marketplaceOrder.clientUserId, userId),
          eq(marketplaceOrder.creatorUserId, userId),
        ),
        sql`${marketplaceOrder.briefAttachments}::jsonb @> ${JSON.stringify([{ url }])}::jsonb`,
      ),
    )
    .limit(1);
  return !!row;
}
