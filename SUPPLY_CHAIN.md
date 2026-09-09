# SUPPLY_CHAIN.md

Direct deps only; every row justifies existence. Pin exact versions **>=7 days
old at pin time** (no `@latest`, no ranges). Transitives audited via lockfile.
Bumps: new row or edit + release-date arithmetic in Notes. Pins verified at
install by `pnpm check:pins` (exact + registry `time[version]` >= 7 days).

| Package | Version | Why | Notes |
|---|---|---|---|
| react | 19.2.8 | dashboard + popup UI; rave.page UI reuse (its primitives are React 19 + Tailwind 4; user decision 2026-09-03); kit peer (`^19`) | released 2026-07-21; **ships** |
| react-dom | 19.2.8 | React DOM renderer (`createRoot`); kit peer (`^19`) | released 2026-07-21; **ships** |
| @rave-page/ui | workspace:* (packages/ui) | shared rave.page design-system kit (Button/Badge/Card/Chip/Dialog/form controls/SmartSelect/DataTable/Toast/LineupBoard/…); UI-reuse rule (P0b) | **first-party in-repo source** (`packages/ui/**`), MIT; not an npm release. Vendored from rave.page `packages/ui` @ `c7121629` (`packages/ui/PROVENANCE.md`); its `prepare` builds `dist/` from `src/` (git-ignored, reproducible). `check:pins` skips `workspace:` specs; its exact-pinned deps listed below; **ships** (kit built to JS + Tailwind CSS) |
| lucide-react | 1.34.0 | icons (design rule: Lucide only); kit peer (accepts `>=0.560 <2`) | released 2026-08-24; **ships** |
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
| @types/node | 24.13.3 | Node 24 types for tools, vitest and Playwright; matches the LTS major | released 2026-07-08; 62-day soak verified 2026-09-08; dev-only |
| openapi-typescript-codegen | 0.30.0 | generated rave.page client (P3; same tool as rave.page) | released 2025-12-22; dev-only (**generated code ships**) |

`@rave-page/ui` exact-pinned deps (declared in `packages/ui/package.json`,
installed into the workspace; each age-gated by pnpm `minimumReleaseAge: 10080`
at resolve; all released on/before 2026-07-24 per the plan's pin table):

- `@radix-ui/react-checkbox` 1.3.11, `@radix-ui/react-dialog` 1.1.23,
  `@radix-ui/react-dropdown-menu` 2.1.24, `@radix-ui/react-label` 2.1.15,
  `@radix-ui/react-popover` 1.1.23, `@radix-ui/react-separator` 1.1.15,
  `@radix-ui/react-slot` 1.3.3, `@radix-ui/react-switch` 1.3.7,
  `@radix-ui/react-tabs` 1.1.21, `@radix-ui/react-tooltip` 1.2.16
- `class-variance-authority` 0.7.1, `clsx` 2.1.1, `tailwind-merge` 3.6.0,
  `dayjs` 1.11.20
- kit 0.2.0 (LineupBoard drag/drop): `@dnd-kit/core` 6.3.1 (2024-12-05),
  `@dnd-kit/sortable` 10.0.0 (2024-12-04), `@dnd-kit/utilities` 3.2.2
  (2023-11-06), `@dnd-kit/modifiers` 9.0.0 (2024-12-04), transitive
  `@dnd-kit/accessibility` 3.1.1 (2024-11-23); dates checked 2026-09-04

These are the kit's own `dependencies` (bundled into its published contract),
not event-bridge direct deps — hence they carry no separate 7-day-soak row
here; the kit owns their justification, and pnpm still refuses any that resolve
< 7 days old.

Vendored assets (not npm deps):

- **Orbitron (OFL 1.1)** — display face (h1/h2, wordmark) copied from the
  rave.page design system (`rave-page-design-system/fonts/`); the license file
  (`Orbitron-OFL.txt`) ships next to the font in `dist/*/fonts/`. Re-sync from
  rave.page, don't fork.
- **Inter Variable (OFL 1.1)** — body/UI face (kit `--font-body`; the kit's
  2026-09-07 type split, same face rave.page loads). The two weight-axis woff2
  files (`inter-latin-wght-normal.woff2`, `inter-latin-ext-wght-normal.woff2`)
  and `Inter-OFL.txt` are copied from `@fontsource-variable/inter@5.3.0` (the
  version rave.page pins) into `src/ui/fonts/`; a local `@font-face` in
  `styles.css` serves them with dist-relative urls (we do NOT add the npm
  package as a dep). Non-latin text falls back through the `--font-body` stack
  to system-ui.

Tooling not installed (run via `pnpm dlx`, never a dep):

- `web-ext@10.6.0` (released 2026-08-04) — Firefox `lint` / `run` / `build`
  (`pnpm lint:firefox`). Rejected as a dep (heavy tree); pinned at invocation.

`pnpm.minimumReleaseAge: 10080` (7 days, in `pnpm-workspace.yaml`) also gates
transitives at resolve time — pnpm refuses any version published < 7 days ago.
`saveExact: true` keeps future adds exact.

Shipped extension bundle: our code + react/react-dom + the kit with its
dependencies + the generated Tailwind CSS. `pnpm build` writes
`THIRD_PARTY_NOTICES.txt` (license text of every bundled package, from the
installed packages; `licenses/` holds the single reviewed supplement for an npm
release that omits its license file) and copies `LICENSE` into both `dist/`
targets. The build also compiles the in-repo kit source (`packages/ui/src`) to
its own `dist/` before bundling, so nothing machine-generated from the kit is
committed (see `docs/development.md`).

## Build runtime

Node **24.20.0 LTS**, pinned in `.node-version` and `engines.node`; all CI jobs
use that file. [Official release](https://nodejs.org/en/blog/release/v24.20.0):
2026-08-26; latest eligible LTS checked against `https://nodejs.org/dist/index.json`
on 2026-09-08, **13 days old**. Upgrade only after seven days and full gates.
Local verification uses the official Windows archive with SHA-256 checked
against Node's `SHASUMS256.txt`; no system-wide runtime switch is required.

React DOM remains the official, unmodified **19.2.8** release. Its two raw-HTML
setters produce four validator warnings across the two UI bundles. Application
and kit source must not call this API. Hash, test coverage and reviewer notes:
[Mozilla compliance](docs/mozilla-compliance.md). Do not patch a third-party
library to silence the validator; Mozilla prohibits library modifications.
