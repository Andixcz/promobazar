import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getDatabaseUrl } from "./url";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;
type Sql = ReturnType<typeof postgres>;

type GlobalDb = {
  drizzleDb?: Db;
  drizzleDbUrl?: string;
  sqlClient?: Sql;
};

const globalForDb = globalThis as unknown as GlobalDb;

function createDrizzle(url: string): Db {
  if (globalForDb.sqlClient) {
    void globalForDb.sqlClient.end({ timeout: 1 }).catch(() => {});
  }
  const client = postgres(url, {
    // Neon / Supabase pooler (transaction mode) — bez prepared statements
    prepare: false,
    max: 10,
  });
  globalForDb.sqlClient = client;
  globalForDb.drizzleDbUrl = url;
  globalForDb.drizzleDb = drizzle(client, { schema });
  return globalForDb.drizzleDb;
}

/** V dev obnoví pool po změně DATABASE_URL (bez restartu celého next dev). */
export function getDb(): Db {
  const url = getDatabaseUrl();
  if (!globalForDb.drizzleDb || globalForDb.drizzleDbUrl !== url) {
    return createDrizzle(url);
  }
  return globalForDb.drizzleDb;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(real);
    }
    return value;
  },
});
