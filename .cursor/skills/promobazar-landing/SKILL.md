---
name: promobazar-landing
description: >-
  Landing pages and App Router structure for promobazar.cz: SiteShell, routes
  / and /pro-tvurce, page views under components/pages, header navigation,
  landingHref anchors. Use when editing app/page.tsx, pro-tvurce, site-header,
  or adding marketing sections.
---

# promobazar: landing

Struktura jako v rexcare-web: **`components/shared/`** (chrome) + **`components/pages/`** (obsah rout).

## Routy

| Soubor | URL | Export |
|--------|-----|--------|
| `app/page.tsx` | `/` | `FirmsPage` + `ContactSection` |
| `app/pro-tvurce/page.tsx` | `/pro-tvurce` | `CreatorsPage` + `FaqSection` + `ContactSection` |

Obal: `components/shared/site-shell.tsx` (`SiteShell` — alias `LandingShell`).

## Složky

| Cesta | Obsah |
|-------|--------|
| `components/shared/` | `site-header`, `site-footer`, `member-context`, cookies, `hash-scroll` |
| `components/pages/firms/` | `firms-page.tsx`, `marketplace.tsx` (hero + grid + poptávky) |
| `components/pages/creators/` | `creators-page.tsx` (hero, gate, PRO) |
| `components/pages/` | `contact-section.tsx`, `faq-section.tsx` |
| `lib/marketplace.ts` | filtry + demo data tržiště |
| `lib/landing-routes.ts`, `lib/landing-nav.ts` | cesty, scroll na job board |

## Navigace

`landingHref`, `goToJobBoardBrowse()`, `scrollToSection()`, `useMember()` / `MemberProvider`.

Nová sekce: přidej do příslušného `*-page.tsx` nebo nový soubor v `components/pages/<audience>/`.

Design: skill **promobazar-design-system**.
