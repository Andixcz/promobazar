# promobazar.cz

Next.js (App Router) aplikace pro tržiště influencerů a UGC tvůrců.

## Vývoj

```bash
npm install
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000).

Proměnné prostředí: zkopíruj `.env.example` → `.env.local` a doplň hodnoty (Postgres, Better Auth, Stripe).

## Struktura homepage

- `public/site-body.html` — statické sekce stránky (server render)
- `public/app.js` — klientská logika (auth, tržiště, chat, …)
- `app/globals.css` — Tailwind v4 + design tokeny (`@theme`)
- `lib/ui-surfaces.ts` — sdílené Tailwind třídy pro React / `site-body.html` / `app.js`
- `components/ui/*` — sdílené UI (shadcn, tlačítka, …)
- `components/landing/*` — React shell (header, hero, modaly, …)
- `lib/site-body.ts` — načtení a split `site-body.html` (jen server)
- `lib/app-global.ts` — volání globálních funkcí z `app.js` z Reactu

## Deploy

Vhodné pro [Vercel](https://vercel.com) (`next build`). OAuth callback: `/auth/callback` přesměruje na `/`.
