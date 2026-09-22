# AGENTS.md — promobazar.cz

Krátký rozcestník pro agenty v tomto repu. Detailní postupy jsou v **projektových skills** (`.cursor/skills/`).

## Produkt

Tržiště influencerů a UGC tvůrců — UI **čeština**, téma **dark** (`app/layout.tsx`).

| Skupina | Route | Obsah |
|--------|-------|--------|
| Značky | `/` | Tržiště, job board, ceník, kontakt |
| Tvůrci | `/pro-tvurce` | Profil, balíčky, FAQ, kontakt |

Dev: `bun install` → `bun run dev`. Env: `.env.example` → `.env.local`.

## Architektura (shrnutí)

- **Next.js App Router** — `app/page.tsx`, `app/pro-tvurce/page.tsx`, sdílený `LandingShell`
- **React** — struktura landingu (`components/landing/`, `components/ui/`)
- **`public/app.js`** — klientská logika (auth, grid, chat, dropdowny); načítá `ClientAppScript`
- **`lib/`** — `landing-routes.ts`, `ui-surfaces.ts`, `app-global.ts` (volání handlerů z Reactu)

React a `app.js` sdílejí **stejná DOM id** a **styly** — při změnách v interaktivních sekcích načti skill `promobazar-app-js`.

## Skills (kdy je načíst)

| Skill | Načti když… |
|-------|-------------|
| [promobazar-landing](.cursor/skills/promobazar-landing/SKILL.md) | Routy, header/footer, hero, `home-views`, nová landing sekce |
| [promobazar-app-js](.cursor/skills/promobazar-app-js/SKILL.md) | `app.js`, `invokeAppGlobal`, mount pointy, id v JSX, job board / marketplace / profil |
| [promobazar-design-system](.cursor/skills/promobazar-design-system/SKILL.md) | `globals.css`, Tailwind tokeny, tlačítka, `ui-surfaces.ts`, lucide |

## Rychlá pravidla

1. Audience **Najít promo / Pro tvůrce** = navigace (`/` ↔ `/pro-tvurce`), ne jedna stránka se skrytými view.
2. **Routing, hash scroll, cookies** — React (`landing-routes.ts`, `landing-nav.ts`, `scroll-to-section.ts`, `cookie-consent.ts`). Do `app.js` to nepřidávej.
3. Nový handler v `app.js` volaný z Reactu → typ v `lib/app-global.ts` (`AppGlobal`).
3. Změna stylu CTA/outline tlačítek → sync `lib/ui-surfaces.ts` a `PB_BTN_*` v `public/app.js`.
4. Před merge: obě landing routy + `bun run build` (Tailwind scanuje i `public/app.js`).

Lidský přehled: `README.md`.
