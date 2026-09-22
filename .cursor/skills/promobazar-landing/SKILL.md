---
name: promobazar-landing
description: >-
  Landing pages and App Router structure for promobazar.cz — LandingShell, routes
  / and /pro-tvurce, home-views, header navigation, landingHref anchors. Use
  when editing app/page.tsx, pro-tvurce, site-header, site-footer, hero sections,
  or adding marketing sections.
---

# promobazar — landing

## Routy

| Soubor | URL | Obsah |
|--------|-----|--------|
| `app/page.tsx` | `/` | `FirmsView` + `ContactSection` |
| `app/pro-tvurce/page.tsx` | `/pro-tvurce` | `CreatorsView` + `FaqSection` + `ContactSection` |

Obě používají `components/landing/landing-shell.tsx`:

- `SiteHeader` / `SiteFooter`
- `AppModal`, `CookieBanner`, `CookieSettingsDialog`, `ChatWidget`
- `ClientAppScript` — `/app.js` (marketplace/auth/chat) + `window.supabase.createClient`
- `LandingHashScroll` — hash scroll + job board tab z Reactu

## Odkazy a audience

`lib/landing-routes.ts`:

- `LANDING_FIRMS_PATH` = `/`, `LANDING_CREATORS_PATH` = `/pro-tvurce`
- `landingHref("firms" | "creators", sectionId?)` — hash např. `cenik`, `propojeni`, `marketplace`
- `isCreatorsLandingPath(pathname)` — aktivní tab v headeru

Navigace: `next/link` + `usePathname()`. Poptávky v menu: `goToJobBoardBrowse()` z `lib/landing-nav.ts`. Scroll: `lib/scroll-to-section.ts`. Cookies: `lib/cookie-consent.ts`.

## View komponenty

`components/landing/views/home-views.tsx` (client):

- **`FirmsView`** — `<main id="view-firms">`: `FirmsHeroSection`, `#marketplace`, job board, `#jak-to-funguje`, `#cenik`, `#firms-cta`
- **`CreatorsView`** — `<main id="view-creators">`: `CreatorsHeroSection`, `#propojeni`, balíčky, staging
- **`ContactSection`** — kontakt (`submitContact` přes app.js)

Hero: `firms-hero-section.tsx`, `creators-hero-section.tsx`. FAQ: `faq-section.tsx` (jen `/pro-tvurce`).

## Související soubory

- `site-header.tsx` / `site-footer.tsx` — navigace, auth, audience CTA
- `app-modal.tsx`, `chat-widget.tsx` — shell; většina logiky v app.js
- `app/auth/callback/page.tsx` — `redirect("/")`

Nová statická sekce: React v `components/landing/` (+ route v `app/` pokud nová URL). Interaktivita vázaná na id z app.js → skill **promobazar-app-js**.
