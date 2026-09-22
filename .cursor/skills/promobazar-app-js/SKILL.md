---
name: promobazar-app-js
description: >-
  Client script public/app.js and React bridge for promobazar.cz — invokeAppGlobal,
  AppGlobal types, mountDropdown ids, stable DOM contract, marketplace grid, job
  board, creator profile. Use when editing app.js, app-global.ts, home-views ids,
  or landing interactivity tied to window handlers.
---

# promobazar — app.js a React

## Načtení

`components/landing/client-app-script.tsx` — `Script src="/app.js"`. Funkce jsou **globální** (ne ES module).

## Volání z Reactu

`lib/app-global.ts`:

- `invokeAppGlobal(name, ...args)` — preferuj v JSX místo `onclick="..."`
- `callAppHandler` — stejné, méně typů
- Nový handler v app.js → doplň **`AppGlobal`**

Příklad: `invokeAppGlobal("openAuth", "creator")`.

## Init app.js (konec skriptu)

`restoreSession`, `enforceDashboardAccess`, `handleAuthCallback`, `initLandingViewFromPath`, `scrollToHashOnLoad`, cookie init.

Dropdowny: `mountDropdown('…-mount', …)` hned po load — v JSX musí existovat `id="dd-*-mount"`.

## Kam psát změny

| Změna | Kde |
|-------|-----|
| Nové tlačítko → existující flow | React + `invokeAppGlobal` |
| Marketplace, filtry, grid, jobs, profil, chat, auth | `public/app.js` (nebo postupný přesun do React + koordinace id) |
| Cesty / hash v menu | `landing-routes.ts` |

Preferuj React + TS pro novou UI, pokud nepotřebuješ stav a DOM z app.js. Měníš-li id nebo mount point → **vždy** uprav app.js ve stejném PR.

## Checklist

- [ ] `/` a `/pro-tvurce` pokud jde o shell nebo globální init
- [ ] Typ v `AppGlobal` pro nové volání z Reactu
- [ ] Id/mount pointy synchronizované s app.js
- [ ] Tlačítka → skill **promobazar-design-system** (PB_BTN sync)

## DOM id

Kompletní tabulky: [dom-ids.md](dom-ids.md). Pravidlo: React drží kontejnery a stabilní id; app.js renderuje do `#grid`, `#job-grid`, mount pointů, subtabs job boardu (`.active`). **Nepřidávej** do app.js routing, view switcher ani cookies.
