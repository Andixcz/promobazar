---
name: promobazar-app-js
description: >-
  DEPRECATED — public/app.js was removed. Landing interactivity lives in React
  (components/landing, lib/ui-surfaces). Do not recreate global scripts or
  invokeAppGlobal. Use promobazar-landing and promobazar-design-system instead.
---

# promobazar: app.js (removed)

`public/app.js`, `lib/app-global.ts`, and `ClientAppScript` **no longer exist**.

If you see references in old branches or docs, migrate to:

- Auth: `/prihlaseni`, `/registrace`, `authClient` from `lib/auth-client.ts`
- Landing session: `LandingMemberProvider`, `CreatorGate`
- Forms / dropdowns: `components/ui` (`FieldSelect`, `FormField`, …)
- Styling: `lib/ui-surfaces.ts` only (no `PB_*` sync)
