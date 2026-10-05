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

Pro lokální přihlášení musí být v env (Doppler config i `.env.local`) **`NEXT_PUBLIC_APP_URL` a `BETTER_AUTH_URL` = `http://localhost:3000`**. Když `doppler run` přepíše `.env.local` produkční `https://promobazar.cz`, OAuth a starší klienty můžou dál zlobit — v Doppleru uprav `dev`, nebo pro vývoj používej jen `.env.local`.

### Neon (Postgres)

1. [Neon](https://neon.tech) → nový projekt → **Connect** → zkopíruj **Pooled** connection string do `DATABASE_URL` v `.env.local`.
2. Pro **drizzle-kit** (`push` / `migrate` / `generate`) ideálně nastav i **Direct** URL do `DATABASE_URL_MIGRATE` (viz `.env.example`).
3. `bun run db:studio` — tabulky `user`, `member_profile`, …

#### Schéma (Drizzle)

Zdroj pravdy je `lib/db/schema.ts`. SQL migrace jsou v `drizzle/` včetně `meta/_journal.json` (negeneruj ručně soubory mimo `db:generate`).

| Situace | Příkaz |
|--------|--------|
| **Nová prázdná DB** (preview, nový Neon branch) | `bun run db:migrate` |
| **Rychlý lokální sync** bez SQL souborů | `bun run db:push` |
| **Změna schématu v kódu** | `bun run db:generate` → commit `drizzle/` → `bun run db:migrate` |
| **DB už existuje z dřívějšího `db:push`** a `migrate` padá na „already exists“ | jednou `bun run db:baseline`, pak už jen `db:migrate` |

Baseline jen označí aktuální `0000_initial` jako aplikovanou — nespouští `CREATE TABLE` znovu.

Auth a dashboard jedou přes **Better Auth + Drizzle**, ne přes Supabase DB. Volitelné `NEXT_PUBLIC_SUPABASE_*` jsou jen pro legacy `public/app.js`.

## Struktura homepage

- **`/`** — Najít promo (`FirmsView`)
- **`/pro-tvurce`** — Pro tvůrce (`CreatorsView`)
- `components/landing/landing-shell.tsx` — sdílený obal stránek
- `lib/landing-routes.ts` — cesty a anchor odkazy
- `AGENTS.md` — rozcestník pro agenty; detaily v `.cursor/skills/promobazar-*`
- `public/app.js` — klientská logika (auth, tržiště, chat, …)
- `app/globals.css` — Tailwind v4 + design tokeny (`@theme`)
- `lib/ui-surfaces.ts` — sdílené Tailwind třídy pro React / `app.js`
- `components/ui/*` — sdílené UI (shadcn, tlačítka, …)
- `components/landing/*` — header, hero, modaly, footer
- `lib/app-global.ts` — typované volání handlerů z `app.js` z Reactu

## Deploy

Vhodné pro [Vercel](https://vercel.com) (`next build`). OAuth callback: `/auth/callback` přesměruje na `/`.
