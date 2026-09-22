# DOM kontrakt — promobazar

Neměň id bez úpravy `public/app.js`.

## Marketplace (FirmsView)

| Id | Účel |
|----|------|
| `#grid` | karty tvůrců |
| `#result-count` | počet výsledků |
| `#empty-state`, `#empty-state-*` | prázdný filtr |
| `#dd-platform-mount`, `#dd-category-mount`, `#dd-license-mount` | filtry |

## Job board

| Id | Účel |
|----|------|
| `#job-board`, `#jobs-browse`, `#job-grid`, `#brand-panel` | panely |
| `#subtab-browse`, `#subtab-brand` | subtabs (`.active`) |
| `#dd-job-category-mount`, `#job-title`, `#job-budget`, `#job-description`, … | formulář |
| `#my-jobs-list` | poptávky značky |

## Tvůrci (CreatorsView)

| Id | Účel |
|----|------|
| `#propojeni` | sekce profilu |
| `#handle-tiktok`, `#handle-instagram`, `#handle-youtube` | sítě |
| `#dd-profile-category-mount`, `#avatar-upload`, `#profile-display-name`, `#profile-error`, … | profil |
| `#dd-pkg-*-mount`, `#dd-staging-*-mount` | balíčky / staging |

## Header

Audience a nav — React (`site-header.tsx`). `#nav-firms` / `#nav-creators` visibility podle pathname, ne app.js.

## Cookie / chat

`#cookie-banner` — React + `lib/cookie-consent.ts` (dialog: event `pb-open-cookie-settings`).
