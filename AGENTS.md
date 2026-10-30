# AGENTS.md: promobazar.cz

Krátký rozcestník pro agenty v tomto repu. Detailní postupy jsou v **projektových skills** (`.cursor/skills/`).

## Produkt

Tržiště influencerů a UGC tvůrců: UI **čeština**, téma **dark** (`app/layout.tsx`).

| Skupina | Route | Obsah |
|--------|-------|--------|
| Značky | `/` | Tržiště, poptávky, ceník, kontakt |
| Tvůrci | `/pro-tvurce` | Profil, balíčky, FAQ, kontakt |

Dev: `bun install` → `bun run dev`. Env: `.env.example` → `.env.local`.

## Architektura (shrnutí)

Veškeré UI a interaktivita na landingu i v dashboardu = **React + App Router + Tailwind** (`components/ui`, server actions, Route Handlers).

- **Next.js App Router**: `app/page.tsx`, `app/pro-tvurce/page.tsx`, sdílený `LandingShell`
- **React**: marketing (`components/shared/`, `components/pages/`), auth, dashboard
- **Better Auth + Drizzle (Neon)**: session, role, data
- **`lib/`**: `landing-routes.ts`, `ui-surfaces.ts`, `scroll-to-section.ts`, cookie consent, dashboard helpers

Session na landingu: `LandingMemberProvider` + `CreatorGate`. Auth = Better Auth stránky, ne legacy modal.

## Skills (kdy je načíst)

| Skill | Načti když… |
|-------|-------------|
| [promobazar-landing](.cursor/skills/promobazar-landing/SKILL.md) | Routy, header/footer, hero, `home-views`, nová landing sekce |
| [promobazar-design-system](.cursor/skills/promobazar-design-system/SKILL.md) | `globals.css`, Tailwind tokeny, tlačítka, `ui-surfaces.ts`, lucide |

## Formuláře (React)

Vždy `components/ui`: **`FormField`** + **`Label`** (uvnitř FormField) + **`Input`** / **`FieldSelect`** / **`Textarea`**. Nepoužívej raw `<input>`, `<select>`, `<textarea>` ani `fieldControl` v JSX: tokeny jsou jen v UI kitu. Výběr z možností = **`FieldSelect`**. Modaly: **`Modal`**.

## Rychlá pravidla

1. Audience **Najít promo / Pro tvůrce** = navigace (`/` ↔ `/pro-tvurce`), ne jedna stránka se skrytými view.
2. **Routing, hash scroll, cookies**: React (`landing-routes.ts`, `landing-nav.ts`, `scroll-to-section.ts`, `cookie-consent.ts`).
3. Nová landing feature = React komponenta + typy v `lib/`, ne globální skripty.
4. Změna stylu CTA/outline tlačítek → `lib/ui-surfaces.ts`.
5. Před merge: obě landing routy + `bun run build`.

Lidský přehled: `README.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev`: verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
