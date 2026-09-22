# promobazar.cz

Next.js (App Router) aplikace pro tržiště influencerů a UGC tvůrců.

## Vývoj

```bash
npm install
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000).

Proměnné prostředí: zkopíruj `.env.example` → `.env.local` (nebo `.env`) a doplň hodnoty.

### Neon (Postgres)

1. [Neon](https://neon.tech) → nový projekt → **Connect** → zkopíruj **Pooled** connection string do `DATABASE_URL` v `.env.local`.
2. Pro schéma: `bun run db:push` (když push zlobí, dej **Direct** string do `DATABASE_URL_MIGRATE` — viz `.env.example`).
3. `bun run db:studio` — tabulky `user`, `member_profile`, …

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
