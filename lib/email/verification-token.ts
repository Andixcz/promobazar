import "server-only";

import { jwtVerify } from "jose";

export type VerificationTokenMeta = {
  email: string | null;
  updateTo: string | null;
  requestType: string | null;
};

export async function readVerificationTokenMeta(
  token: string,
): Promise<VerificationTokenMeta | null> {
  const secret = process.env.BETTER_AUTH_SECRET?.trim();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return {
      email: typeof payload.email === "string" ? payload.email : null,
      updateTo: typeof payload.updateTo === "string" ? payload.updateTo : null,
      requestType:
        typeof payload.requestType === "string" ? payload.requestType : null,
    };
  } catch {
    return null;
  }
}
