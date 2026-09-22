---
name: promobazar-design-system
description: >-
  Styling for promobazar.cz — Tailwind v4 @theme in globals.css, lib/ui-surfaces.ts,
  PB_BTN_* sync in public/app.js, lucide-react icons, shadcn components/ui. Use
  when changing colors, buttons, empty states, pricing cards, forms, or Tailwind
  classes shared between React and app.js.
---

# promobazar — design systém

## Tokeny

`app/globals.css` — `@theme`: `void`, `panel`, `cyan`, `mist`, `magenta`, …; fonty `font-display`, `font-body`, `font-mono`.

`@source` scanuje `components/`, `app/`, `lib/`, **`public/app.js`**.

Layout: `app/layout.tsx` — fonty (Strichpunkt Sans, Inter, JetBrains, Geist), `html.dark`, `body.grain`.

## Sdílené třídy — `lib/ui-surfaces.ts`

| Export | Použití |
|--------|---------|
| `section`, `surface`, `eyebrow` | layout sekcí |
| `emptyState`, `emptyStateIcon`, … | prázdné stavy |
| `pricingCard`, `pricingIcon`, … | ceník |
| `fieldControl`, `fieldLabel` | formuláře v landingu |
| `htmlButtonCta`, `htmlButtonOutline`, … | stringy v app.js |
| `audienceSwitcherActive` | header switcher (`.active` z app.js) |

## Sync tlačítek (povinné)

Konstanty **`PB_BTN_*`** na začátku `public/app.js` = stejné třídy jako `htmlButton*` v `ui-surfaces.ts`. Jedna změna → **oba soubory**.

## Ikony

React: **lucide-react** (`Lock`, `Check`, `Upload`, …). U gate / empty / upload nepoužívej emoji.

## UI kit

`components/ui/*` — shadcn (Button, Dialog, Input, …). Nové interaktivní prvky v Reactu stavěj na kitu; app.js generuje HTML s Tailwind z `PB_BTN_*` nebo inline tříd.
