# SUPPLY_CHAIN.md

Direct deps only; every row justifies existence. Pin exact versions **>=7 days
old at pin time** (no `@latest`, no ranges). Transitives audited via lockfile.
Bumps: new row or edit + release-date arithmetic in Notes. Pins verified at
install by `pnpm check:pins` (exact + registry `time[version]` >= 7 days).

| Package | Version | Why | Notes |
|---|---|---|---|
| react | 19.2.8 | dashboard + popup UI; rave.page UI reuse (its primitives are React 19 + Tailwind 4; user decision 2026-09-03) | released 2026-07-21; **ships** |
| react-dom | 19.2.8 | React DOM renderer (`createRoot`) | released 2026-07-21; **ships** |
| tailwindcss | 4.3.3 | design-token CSS engine; tokens vendored from rave.page | released 2026-07-16; dev-only (generated CSS ships) |
| @tailwindcss/cli | 4.3.3 | `styles.css` -> `build/styles.css` build step (`tools/build.mjs`) | released 2026-07-16; dev-only |
| @types/react | 19.2.18 | React types | released 2026-07-30; dev-only |
| @types/react-dom | 19.2.5 | React DOM types | released 2026-08-23; dev-only |
| typescript | 6.0.3 | typecheck only (esbuild emits) | released 2026-04-16; dev-only |
| esbuild | 0.28.2 | 4 IIFE bundles, TSX (`jsx: automatic` -> react) | released 2026-08-08; dev-only; only pkg in `pnpm.onlyBuiltDependencies` |
| vitest | 4.1.11 | unit tests (NOT 5.0.0) | released 2026-08-18; dev-only |
| happy-dom | 20.11.2 | DOM env for React render + parser tests | released 2026-08-07; dev-only |
| @playwright/test | 1.62.1 | e2e with the loaded extension | released 2026-07-30; dev-only; browser via `playwright install chromium` |
| @types/chrome | 0.2.7 | MV3 promise API types; shim typed `typeof chrome` | released 2026-08-21; dev-only |
| @types/node | 22.20.1 | `tools/*.mjs`, vitest + playwright configs (engines node>=22) | released 2026-07-08; dev-only |
| openapi-typescript-codegen | 0.30.0 | generated rave.page client (P3; same tool as rave.page) | released 2025-12-22; dev-only (**generated code ships**) |

Vendored assets (not npm deps):

- **Orbitron (OFL 1.1)** — brand font copied from the rave.page design system
  (`rave-page-design-system/fonts/`); the license file (`Orbitron-OFL.txt`)
  ships next to the font in `dist/*/fonts/`. Re-sync from rave.page, don't fork.

Tooling not installed (run via `pnpm dlx`, never a dep):

- `web-ext@10.6.0` (released 2026-08-04) — Firefox `lint` / `run` / `build`
  (`pnpm lint:firefox`). Rejected as a dep (heavy tree); pinned at invocation.

`pnpm.minimumReleaseAge: 10080` (7 days, in `pnpm-workspace.yaml`) also gates
transitives at resolve time — pnpm refuses any version published < 7 days ago.
`saveExact: true` keeps future adds exact.

Shipped extension bundle: our code + react/react-dom + the generated Tailwind CSS.
