import { defineConfig } from "drizzle-kit";

import { loadEnvFiles } from "./lib/db/load-env";
import { getDatabaseUrl } from "./lib/db/url";

loadEnvFiles();

const migrateUrl =
  process.env.DATABASE_URL_MIGRATE?.trim() || getDatabaseUrl();

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: migrateUrl,
  },
});
