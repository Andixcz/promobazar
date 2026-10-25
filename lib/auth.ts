import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import {
  authEmailPasswordExtras,
  authEmailVerification,
  authUserEmailOptions,
} from "@/lib/auth-email-hooks";
import { authBaseUrl } from "@/lib/auth-env";
import { buildBetterAuthSocialProviders } from "@/lib/auth-social-server";

export const auth = betterAuth({
  appName: "promobazar.cz",
  baseURL: authBaseUrl(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailVerification: authEmailVerification,
  emailAndPassword: {
    enabled: true,
    ...authEmailPasswordExtras,
  },
  user: authUserEmailOptions,
  socialProviders: buildBetterAuthSocialProviders(),
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
