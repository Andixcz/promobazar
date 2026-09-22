/**
 * PostgreSQL URL pro Drizzle (`postgres` driver) a drizzle-kit.
 *
 * Doporučení (Neon): pooled URL pro běh aplikace, direct URL pro `db:push`
 * (`DATABASE_URL_MIGRATE`). Pooler vyžaduje `prepare: false` — viz `lib/db/index.ts`.
 *
 * @see https://neon.com/docs/guides/drizzle
 */
function pickDatabaseUrl(): string | undefined {
  for (const key of [
    "DATABASE_URL",
    "POSTGRES_URL",
  ] as const) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getDatabaseUrl(): string {
  const url = pickDatabaseUrl();

  if (!url?.trim()) {
    const hasPublicSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (hasPublicSupabase) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_* nenahrazuje DATABASE_URL. " +
          "Pro Drizzle a Better Auth nastav Neon (nebo jiný Postgres) connection string — viz .env.example.",
      );
    }

    throw new Error(
      "DATABASE_URL musí být nastaveno (Neon Console → Connect → Pooled connection string).",
    );
  }

  const trimmed = url.trim();

  let hostname: string;
  try {
    hostname = new URL(trimmed.replace(/^postgresql:/, "http:")).hostname;
  } catch {
    throw new Error(
      "DATABASE_URL není platná PostgreSQL URI. Zkopíruj ji z Neon Console (Connect), ne šablonu z .env.example.",
    );
  }

  if (
    hostname.toLowerCase() === "host" ||
    /\[.*\]/.test(trimmed) ||
    trimmed.includes("@HOST") ||
    trimmed.includes("USER:PASSWORD") ||
    trimmed.includes("********")
  ) {
    throw new Error(
      "DATABASE_URL obsahuje zástupný text. Vlož celý řetězec z Neon → Connect. " +
        "Po změně .env.local restartuj `bun dev`.",
    );
  }

  if (/^db\.[a-z0-9]+\.supabase\.co$/i.test(hostname)) {
    console.warn(
      "[db] Používáš Supabase direct host. Pro lokální vývoj často funguje lépe pooler URI nebo Neon.",
    );
  }

  return trimmed;
}
