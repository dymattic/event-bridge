# Test fixtures

Sanitized captures + hand-built goldens for core mapping/parse tests. Raw
captures live in git-ignored `.devnotes/fixtures-raw/`; these are the public,
scrubbed derivatives.

## Sanitization rules (applied to everything here)

- CSRF meta content → `TEST_CSRF_TOKEN`; any 64-hex string → `TEST_CSRF_TOKEN`.
- VRChat group id → `grp_00000000-0000-4000-8000-000000000001`.
- Organizer id → `9001`.
- Event ids → `100001`+; set ids → `2xxxxx`; performer ids → `3xxxxx`.
- Club name → `Example Club`; shortcodes → `EXAMPLE.0001`; DJ names → `Example DJ`.
- Avatar/logo/discord/cdn URLs dropped (→ `example.invalid`).
- vrc.tl HTML trimmed to the `<form>` / `<table>` region parsers need.

`test/core/fixtures-hygiene.test.ts` fails if any forbidden token reappears.

## Files

| Path | Source | Used by |
|---|---|---|
| vrcpop/data-event.json | edit-page `data-event` | from-vrcpop |
| vrcpop/lineup.json | `/api/event-lineup.php` | from-vrcpop |
| vrcpop/genres.json, energy.json | `/api/dj/?action=…` | vocab / to-vrcpop |
| vrcpop/golden-create.json | derived | to-vrcpop golden |
| vrctl/detail-form.json | parsed detail form (VrctlDetailForm) | to/from-vrctl |
| vrctl/detail-form.html, create-form.html, admin-grid.html | scrubbed HTML | P5 DOM parser |
| vrctl/performer-search.json | `/admin/ajax/performer` | P5 |
| ravepage/event-out.json, slots.json, performers.json | derived from spec models | from-ravepage |
| ravepage/event-create-in.json | derived from spec | to-ravepage ref |
