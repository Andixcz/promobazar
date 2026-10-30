# promobazar.cz

Next.js (App Router) aplikace pro tržiště influencerů a UGC tvůrců.

## Vývoj

```bash
npm install
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000).

Proměnné prostředí: zkopíruj `.env.example` → `.env.local` (nebo `.env`) a doplň hodnoty.

### Doppler (volitelně)

Soubor `doppler.yaml` jen **přiřadí projekt a config** (např. `platforma` / `dev`). Samotný soubor **nenačte** proměnné do Next.js.

- Lokálně s Dopplerem: `bun run dev:doppler` (nebo `doppler run -- bun dev`)
- Bez Doppleru: `bun run dev` + `.env.local`

Pro lokální přihlášení nastav **`NEXT_PUBLIC_APP_URL`** a **`BETTER_AUTH_URL`** na `http://localhost:3000` (v Doppler configu `dev` nebo v `.env.local`). Pokud `doppler run` přepíše lokální env produkční doménou, OAuth přestane fungovat. Pro vývoj používej správný Doppler config, nebo jen `.env.local`.

### Neon (Postgres)

1. [Neon](https://neon.tech) → nový projekt → **Connect** → zkopíruj **Pooled** connection string do `DATABASE_URL` v `.env.local`.
2. Pro **drizzle-kit** (`push` / `migrate` / `generate`) ideálně nastav i **Direct** URL do `DATABASE_URL_MIGRATE` (viz `.env.example`).
3. `bun run db:studio`: tabulky `user`, `member_profile`, …

#### Schéma (Drizzle)

Zdroj pravdy je `lib/db/schema.ts`. SQL migrace jsou v `drizzle/` včetně `meta/_journal.json` (negeneruj ručně soubory mimo `db:generate`).

| Situace | Příkaz |
|--------|--------|
| **Nová prázdná DB** (preview, nový Neon branch) | `bun run db:migrate` |
| **Rychlý lokální sync** bez SQL souborů | `bun run db:push` |
| **Změna schématu v kódu** | `bun run db:generate` → commit `drizzle/` → `bun run db:migrate` |
| **DB už existuje z dřívějšího `db:push`** a `migrate` padá na „already exists“ | jednou `bun run db:baseline`, pak už jen `db:migrate` |

Baseline jen označí aktuální `0000_initial` jako aplikovanou: nespouští `CREATE TABLE` znovu.

Volitelné `NEXT_PUBLIC_SUPABASE_*` v `.env.example` jsou **legacy** (starý klient); produkce používá Better Auth + Neon.

### Přihlášení Google a Discord

1. V `.env.local` nastav `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` a/nebo `DISCORD_CLIENT_ID` + `DISCORD_CLIENT_SECRET`.
2. U providera zaregistruj redirect URI:
   - `http://localhost:3000/api/auth/callback/google` (resp. `discord`)
   - v produkci `https://promobazar.cz/api/auth/callback/...`
3. `BETTER_AUTH_SECRET` (min. 32 znaků) a `BETTER_AUTH_URL` musí sedět s doménou, na které běží appka.

Tlačítka se zobrazí na `/prihlaseni` a `/registrace`, jakmile jsou creds na serveru.

**Registrace:** na `/registrace` zvol typ účtu (tvůrce / značka), pak e-mail nebo OAuth. Po úspěchu redirect na `/dashboard?role=…` vytvoří `member_profile` (cookie `pb_dashboard_role` nastaví `proxy.ts`). Z `/pro-tvurce` odkaz Registrace v menu přidá `?role=creator`.

Ověření: `GET /api/auth/ok` → `{ "status": "ok" }`.

## Struktura homepage

- **`/`**: `FirmsPage` (`components/pages/firms/firms-page.tsx`)
- **`/pro-tvurce`**: `CreatorsPage` (`components/pages/creators/creators-page.tsx`)
- **`components/shared/site-shell.tsx`**: header, footer, session, cookies (jako rexcare `shared/`)
- **`components/pages/`**: obsah marketingových rout
- `lib/landing-routes.ts`: cesty a anchor odkazy
- **`lib/marketplace.ts`**: filtry a data tržiště
- `AGENTS.md`: rozcestník pro agenty; detaily v `.cursor/skills/promobazar-*`

## Deploy

Vhodné pro [Vercel](https://vercel.com) (`next build`). OAuth callback: `/auth/callback` přesměruje na `/`.
