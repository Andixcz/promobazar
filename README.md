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

- `components/landing/views/home-views.tsx` — sekce pro značky, tvůrce a kontakt (React)
- `public/app.js` — klientská logika (auth, tržiště, chat, …), postupně nahrazovat
- `app/globals.css` — Tailwind v4 + design tokeny (`@theme`)
- `lib/ui-surfaces.ts` — sdílené Tailwind třídy pro React / `app.js`
- `components/ui/*` — sdílené UI (shadcn, tlačítka, …)
- `components/landing/*` — header, hero, modaly, footer
- `lib/app-global.ts` — typované volání handlerů z `app.js` z Reactu

## Deploy

Vhodné pro [Vercel](https://vercel.com) (`next build`). OAuth callback: `/auth/callback` přesměruje na `/`.
