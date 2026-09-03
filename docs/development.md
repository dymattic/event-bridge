# Development

## Build

```sh
pnpm install          # node >=22, pnpm >=10
pnpm build            # esbuild + tailwind -> build/, then assemble -> dist/chrome + dist/firefox
pnpm dev              # esbuild watch + tailwind --watch (sourcemaps on)
```

`pnpm build` runs `tools/build.mjs` (esbuild: 4 IIFE bundles background/agent/
popup/dashboard, React 19 via `jsx: automatic`; then `@tailwindcss/cli`
compiles `src/ui/styles.css` -> `build/styles.css`) then `tools/assemble.mjs`
(merges manifests, copies bundles + built CSS + HTML + icons + `src/ui/fonts/*`
into each `dist/` target). `dist/` and `build/` are git-ignored.

## UI stack (@rave-page/ui)

React 19 + Tailwind 4 on `@rave-page/ui` — the shared rave.page design-system
kit (Button, Badge, Card/DashboardCard/StatCard, Dialog family, form controls,
SmartSelect, Date/DateTime pickers, DataTable, Toast, …) plus its `tokens.css`
(brand palette, semantic `--color-*`, `--control-h` density, Orbitron
`font-orbitron`, z-ladder, `--breakpoint-xxl`). No hand-rolled widgets or
ad-hoc colours where a kit component/token exists; missing primitives are added
upstream in the kit, never forked here. Extension-specific views stay in
`src/ui/`. `views/KitShowcase.tsx` renders every export (wire it at `#/kit`).

`src/ui/styles.css` is the Tailwind entry:

```css
@import "tailwindcss";
@import "@rave-page/ui/tokens.css";
@source "../../node_modules/@rave-page/ui/src";   /* node_modules is auto-ignored; opt the kit back in */
@source "./**/*.tsx";                             /* the extension's own components */
```

It adds only the extension's own Orbitron `@font-face` (dist-relative
`fonts/…` url — we do NOT import the kit's `font.css`, whose url wouldn't
resolve from `dist/`) and the `body` defaults. Orbitron + its OFL license ship
in `dist/*/fonts/`.

**Providers.** Mount once at each React root (`popup/main.tsx`,
`dashboard/main.tsx`): `TooltipProvider` (backs any `Button`/`IconButtonWithTooltip`
`tooltip`) wrapping `NotificationProvider` with `<Toast/>` inside (backs
`useNotification()`).

### Vendored kit (not `link:`)

The kit isn't on npm yet, so it's consumed as a committed tarball under
`vendor/` — a self-contained `pnpm install` for outside contributors (no
sibling rave.page checkout needed). `package.json` carries
`"@rave-page/ui": "file:vendor/rave-page-ui-<version>.tgz"`; peers are
react/react-dom 19 + lucide-react 1.34 (the kit accepts lucide `>=0.560 <2`).
Provenance (kit commit/branch, sha256, UTC date, refresh command) lives in
`vendor/PROVENANCE.md`. Refresh:

```sh
pnpm vendor:ui                                     # default kit ../rave.page/packages/ui
pnpm vendor:ui ../rave.page-wt-uikit/packages/ui   # today the kit is on a worktree
pnpm install                                       # if the spec/tarball changed
```

`tools/vendor-ui.mjs` asserts the kit identity, runs `pnpm --dir <kit> build`
then `pnpm --dir <kit> pack` into `vendor/`, drops stale tarballs, verifies the
packed `.` export resolves to the compiled `dist/` (event-bridge consumes the
`.js`/`.d.ts`, never the kit's looser TS sources — our tsconfig is stricter),
rewrites `vendor/PROVENANCE.md`, and syncs the `package.json` spec.
`check:pins` skips the `file:` spec with a printed note; the kit's transitive
exact pins (Radix, cva, clsx, tailwind-merge, dayjs) are still age-gated by
pnpm `minimumReleaseAge`. Switch to the npm version in P8.

## Two-manifest layout

One `manifest/base.json` shared; per-browser overlays deep-merged at assemble:

- `manifest/chrome.json` -> `background.service_worker`, `minimum_chrome_version`.
- `manifest/firefox.json` -> `background.scripts`, `browser_specific_settings.gecko`
  (id, `strict_min_version` `140.0`, `data_collection_permissions`). FF140 is the
  floor because `data_collection_permissions` needs it; `web-ext lint` still warns
  the key is unsupported on Firefox for Android (142) — Android is not a target.

Edit the manifest under `manifest/`, never the generated `dist/*/manifest.json`.

## Load unpacked

**Chrome/Chromium:** `chrome://extensions` -> enable Developer mode ->
"Load unpacked" -> select `dist/chrome`. Click the toolbar icon to open the
dashboard.

**Firefox:** `pnpm dlx web-ext@10.6.0 run --source-dir dist/firefox`
(temporary install), or `about:debugging#/runtime/this-firefox` ->
"Load Temporary Add-on" -> pick `dist/firefox/manifest.json`.

## Gates

```sh
pnpm check:pins   # exact pins, each >=7 days old on npm
pnpm typecheck    # tsconfig.json (DOM) + tsconfig.background.json (WebWorker)
pnpm test         # vitest
pnpm build
pnpm e2e          # loads dist/chrome in headless Chromium
pnpm lint:firefox # web-ext lint, 0 errors required
```

E2E needs the browser once: `pnpm exec playwright install chromium`.

## Supply-chain soak

Every direct dep is pinned exact and must be **>= 7 days old** at pin time
(`SUPPLY_CHAIN.md` row each). `pnpm check:pins` verifies this against the npm
registry; `pnpm-workspace.yaml` `minimumReleaseAge: 10080` also gates transitives
at resolve time. Never `@latest`, never a range.

## Runtime model (P2)

Three cooperating contexts (both browsers):

- **dashboard/popup** (extension pages, `dashboard.js` / `popup.js`) run
  everything: `src/runtime/*` orchestrates agents, session status, settings.
  They inject agents and drive them over ports. Popup shows per-platform session
  status and (Firefox) requests host permissions in the click handler.
- **agent** (`agent.js`, `src/agent/*`) is injected on demand per origin via
  `scripting.executeScript`. Idempotent install guard
  (`globalThis.__eventBridgeAgent = {buildId}`). Answers a one-shot `ping`
  (`runtime.onMessage`, used right after injection to read the live build) and
  request/response ops over a named `'agent'` port (`runtime.onConnect`):
  `ping`, `session`, `http` (strictly same-origin, `credentials:'same-origin'`),
  and blob transfer (`blobBegin/Chunk/End/Drop`, assembled in a 5-min-TTL Map).
  Binary crosses the bus as base64 slices ≤1 MiB (`src/shared/base64.ts`);
  Chrome JSON-serializes messages, so typed arrays don't survive.
- **background** (`background.js`) only opens/focuses the dashboard (toolbar
  click or an `open-dashboard` runtime message). No DOM, no network.

`ensureAgent(platform, {allowOpen})` finds a platform tab (`tabs.query({url})`),
optionally opens one inactive (15 s ready timeout), injects, verifies the build
(stale → reload + re-inject once). `getSessionStatus` NEVER opens tabs
(`allowOpen:false`); only a user-triggered action passes `allowOpen:true`.
Transport caches one port per tab and reconnects on disconnect (Firefox drops
ports). Codes are `BridgeError`/`BridgeErrorCode` from `src/core/errors.ts`.

## e2e mocks

Tests never hit the real platforms. `e2e/fixtures/extension.ts` exposes
`mockPlatform(context, platform, 'logged-in'|'logged-out')` which `context.route`s
`https://vrcpop.com/**`, `https://vrc.tl/**`, `https://development.rave.page/**`
(+ `https://development.api.rave.page/**` → 404 JSON) to self-authored fixtures
in `e2e/mocks/` (sanitized: placeholder group id, organizer 9001, CSRF
`TEST_CSRF_TOKEN`). The vrcpop mock carries the inline `window.vrcpop.user`
script; the vrc.tl logged-out mock 302-redirects `/admin/event` to `/sign/in`;
the rave.page mock sets `localStorage.auth_token` to an unsigned test JWT with a
future `exp`. Helpers: `openPopup`, `openDashboard`, `openPlatformTab`,
`getExtensionId`. Specs: `session-status.spec.ts` (no-tab / logged-in /
logged-out / `tabs.query` probe), `agent-blob.spec.ts` (3 MiB sha256 round-trip
over a real port), plus the P0 `smoke.spec.ts`.

## Verified platform facts

- **vrc.tl (Nette) same-origin fetch passes the same-site guard.** In-tab agent
  requests are viable; a nonexistent signal returns a plain 403 page (not the
  CSRF redirect); `GET /admin/ajax/performer?term=…` returns 200 JSON.
- **Chrome runtime messaging JSON-serializes payloads** — typed arrays /
  ArrayBuffers do NOT survive. All binary crosses the bus as base64 slices
  ≤1 MiB (`sliceBase64`).
- **`tabs.query({url})` works WITHOUT the `tabs` permission** (host permission
  only): the e2e probe confirmed matching tabs AND their `url` come back with
  just `host_permissions`. `manifest/base.json` keeps `permissions:
  ["storage","scripting"]` — no `tabs`.

## rave.page adapter (P3, dev API only)

API base = one constant `API_BASE = 'https://development.api.rave.page'`
(`src/adapters/ravepage/client.ts`), which configures the generated `OpenAPI`
(`BASE`, a Bearer `TOKEN` resolver reading the token store, `WITH_CREDENTIALS
false`). Generated calls go only through the `ROUTES` allowlist
(`ravepage/routes.ts`); a unit test greps the adapter for raw `fetch(` and
allows exactly one — the chunk PUT — marked `raw-fetch-allowed:`.

**Auth = the SPA's grant/exchange flow, never SPA tokens.** `connect()` opens
`https://development.rave.page/desktop/bridge?target=extension` active, runs the
agent `grantAwait` handshake (page `rave-page:bridge-ready` → agent
`event-bridge:hello` → page `rave-page:desktop-grant {code, api}`), then
`POST /auth/exchange {code}` → `{token, refresh}`. The `refresh` is **discarded**
(`/auth/refresh` is 410 → renewal is a user re-connect). The 30-day JWT + identity
(`GET /auth/me`) are stored in `storage.local` under `ravepage.auth`
(`ravepage/token-store.ts`); `needsReconnect()` fires < 3 days before expiry, and
any 401 clears the token so the UI offers Reconnect.

The dashboard (`src/ui/dashboard/App.tsx`) is a minimal dev panel — Connect /
Disconnect, status, Who am I, My groups, Create test draft (draft + unlisted +
`is_public:false`, one slot, one performer), Delete it — used for manual checks
once the bridge branch is deployed to development.rave.page. Writes use the pure
`planCreate/Update/Delete/Poster` builders + a sequential `runPlan` that resolves
`{$ref}` placeholders (new event/slot ids). Poster bytes upload imperatively
(`setPoster`): chunked `media-upload` (resume from `uploaded_chunk_numbers`, poll
`pipeline_status` to `ready`) then `PATCH /events/{id}/poster`.

## Manual verification browser (`pnpm dev:browser`)

Builds, then launches a **headed** Chromium with the unpacked extension loaded
into a persistent, git-ignored `.profile/` and `--remote-debugging-port=9222`.
It prints the extension id + dashboard URL and opens the dashboard, then stays
alive until Ctrl+C. The user logs in on development.rave.page themselves in that
window; the lead attaches tooling (Playwright/CDP) via
`http://127.0.0.1:9222`. rave.page development is exercised with draft/unlisted
events only, cleaned up afterwards (repo rule: no test events on vrc.tl/vrcpop).
