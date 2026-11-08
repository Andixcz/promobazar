# Drizzle migrace

- **Journal:** `meta/_journal.json`: bez něj `db:migrate` nefunguje.
- **Baseline:** `0000_initial.sql`: celé aktuální schéma (auth + dashboard).
- **Nové změny:** uprav `lib/db/schema.ts` → `bun run db:generate` → nový soubor `0001_*.sql` + update journalu.

Ruční `.sql` soubory mimo `generate` sem nepřidávej: Drizzle je neuvidí.

**Doppler config `dev`:** migrace musí běžet se stejným env jako `bun dev`:

```bash
doppler run -c dev -- bun run db:migrate
# alias: bun run db:migrate:doppler
doppler run -c dev -- bun run db:verify-billing
# alias: bun run db:verify-billing:doppler
```

Postup při existující DB z `db:push`: viz `README.md` → `bun run db:baseline`.
