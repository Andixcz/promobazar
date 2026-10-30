"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/auth-session";
import { ensureMemberProfile } from "@/lib/dashboard/profile-server";
import { startPackageCheckout } from "@/lib/orders/checkout";

export async function checkoutPublicPackage(input: {
  packageId: string;
  brief: string;
  briefAttachments?: unknown;
}) {
  const session = await getServerSession();
  if (!session?.user) {
    return {
      ok: false as const,
      error: "Pro objednání se nejdřív přihlas.",
      code: "auth" as const,
    };
  }

  const profile = await ensureMemberProfile(
    session.user.id,
    session.user.name,
    session.user.email,
  );

  const result = await startPackageCheckout({
    clientUserId: profile.userId,
    packageId: input.packageId,
    brief: input.brief,
    briefAttachments: input.briefAttachments,
  });

  if (result.ok) {
    revalidatePath("/dashboard/objednavky");
  }

  return result;
}
