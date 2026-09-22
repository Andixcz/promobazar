# promobazar.cz

Next.js (App Router) aplikace pro tržiště influencerů a UGC tvůrců.

## Vývoj

```bash
npm install
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000).

Proměnné prostředí: zkopíruj `.env.example` → `.env.local` a doplň hodnoty (Postgres, Better Auth, Stripe).

## Struktura migrace

Původní monolitický `index.html` je rozdělen na:

- `public/legacy-body.html` — zbytek UI, které ještě není v Reactu
- `public/legacy-app.js` — klientská logika (auth, tržiště, chat, …)
- `app/globals.css` — Tailwind v4 + design tokeny
- `components/ui/*` — sdílené UI (logo, později tlačítka, modaly, …)
- `components/landing/*` — homepage / marketing shell + legacy bridge
- `lib/legacy-body.ts` — načtení a split `legacy-body.html` (jen server)
- `lib/legacy-bridge.ts` — volání legacy funkcí z Reactu během migrace
- `components/landing/legacy-html-chunk.tsx` — server render HTML bez client props
- `components/landing/legacy-app-bootstrap.tsx` — Supabase + `legacy-app.js`

Původní soubor je archivovaný v `legacy/index.html`. Další krok: sekce ceník/FAQ, creator view, auth modaly.

## Deploy

Vhodné pro [Vercel](https://vercel.com) (`next build`). OAuth callback: `/auth/callback` přesměruje na `/`.
