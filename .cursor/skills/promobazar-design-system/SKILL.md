---
name: promobazar-design-system
description: >-
  Styling for promobazar.cz: Tailwind v4 @theme in globals.css, lib/ui-surfaces.ts,
  lucide-react icons, shadcn components/ui. Use when changing colors, buttons,
  empty states, pricing cards, forms, or Tailwind classes on landing and dashboard.
---

# promobazar: design systém

## Tokeny

`app/globals.css`: `@theme`: `void`, `panel`, `cyan`, `mist`, `magenta`, …; fonty `font-display`, `font-body`, `font-mono`.

`@source` scanuje `components/`, `app/`, `lib/`.

Layout: `app/layout.tsx`: fonty (Strichpunkt Sans, Inter, JetBrains, Geist), `html.dark`, `body.grain`.

## Sdílené třídy: `lib/ui-surfaces.ts`

| Export | Použití |
|--------|---------|
| `section`, `surface`, `eyebrow` | layout sekcí |
| `emptyState`, `emptyStateIcon`, … | prázdné stavy |
| `pricingCard`, `pricingIcon`, … | ceník |
| `fieldControl`, `fieldLabel`, `fieldSelectTrigger` | formuláře |
| `htmlButtonCta`, `htmlButtonOutline`, … | marketing CTA (Link / button className) |
| `audienceSwitcherActive` | header switcher (`.active`) |
| `mobileHeaderMenuLink` | mobilní menu headeru |
| `dropdownPanel`, `dropdownPanelNav`, `dropdownOption` | FieldSelect, účet v headeru |

## Stíny a glow (zakázáno)

Na komponentách **nepřidávej** dekorativní stíny ani glow: `box-shadow`, `drop-shadow`, barevné halo kolem prvků.

Hloubku řeš **`surface`**, **`border-white/[0.09]`**, **`bg-panel`** / **`bg-dd-panel`**.

## Tlačítka

Marketing CTA: exporty `htmlButton*` v `ui-surfaces.ts`. Dashboard a formuláře: `components/ui/button.tsx`.

## Ikony

React: **lucide-react**. U gate / empty / upload nepoužívej emoji.

## UI kit

`components/ui/*`: shadcn (Button, Dialog, Input, FieldSelect, Modal, …). Nové prvky stavěj na kitu.
