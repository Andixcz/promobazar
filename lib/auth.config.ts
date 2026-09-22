import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

/** Konfigurace pro `@better-auth/cli generate` — drž v sync s `lib/auth.ts`. */
export default betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
