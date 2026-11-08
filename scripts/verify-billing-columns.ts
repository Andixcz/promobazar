import { config } from "dotenv";
import { resolve } from "node:path";
import postgres from "postgres";

import { getDatabaseUrl } from "../lib/db/url";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const url = getDatabaseUrl();
const host = new URL(url.replace(/^postgresql:/, "http:")).hostname;

const sql = postgres(url, { max: 1, prepare: false });
const columns = await sql<{ column_name: string }[]>`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'member_profile'
    AND column_name IN (
      'billing_plan',
      'stripe_customer_id',
      'stripe_subscription_id',
      'subscription_status'
    )
  ORDER BY column_name
`;

const journal = await sql<{ created_at: string; hash: string }[]>`
  SELECT created_at, hash
  FROM drizzle.__drizzle_migrations
  ORDER BY created_at DESC
  LIMIT 8
`;

console.log("DATABASE host:", host);
console.log("billing columns:", columns.map((r) => r.column_name).join(", ") || "(none)");
console.log(
  "migration count:",
  journal.length,
  "latest:",
  journal[0]?.created_at ?? "n/a",
);

await sql.end();
