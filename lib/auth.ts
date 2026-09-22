import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { buildBetterAuthSocialProviders } from "@/lib/auth-social-server";

export const auth = betterAuth({
  appName: "promobazar.cz",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: buildBetterAuthSocialProviders(),
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
