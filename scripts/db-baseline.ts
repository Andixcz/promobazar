/**
 * Označí existující migrace jako aplikované bez spuštění SQL.
 * Použij jednou, když DB už má schéma z dřívějšího `db:push` a chceš přejít na `db:migrate`.
 */
import { readMigrationFiles } from "drizzle-orm/migrator";
import postgres from "postgres";

import { loadEnvFiles } from "../lib/db/load-env";
import { getDatabaseUrl } from "../lib/db/url";

loadEnvFiles();

const url = process.env.DATABASE_URL_MIGRATE?.trim() || getDatabaseUrl();
const sql = postgres(url, { prepare: false, max: 1 });

try {
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  const migrations = readMigrationFiles({ migrationsFolder: "./drizzle" });
  if (migrations.length === 0) {
    console.error("Žádné migrace v drizzle/meta/_journal.json.");
    process.exit(1);
  }

  for (const migration of migrations) {
    const existing = await sql`
      SELECT 1 AS ok
      FROM drizzle.__drizzle_migrations
      WHERE hash = ${migration.hash}
      LIMIT 1
    `;
    if (existing.length > 0) continue;

    await sql`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES (${migration.hash}, ${migration.folderMillis})
    `;
    console.log(
      `Baseline: zapsána migrace (${migration.hash.slice(0, 12)}…).`,
    );
  }

  console.log("Hotovo. Další změny schématu: db:generate → db:migrate.");
} finally {
  await sql.end();
}
