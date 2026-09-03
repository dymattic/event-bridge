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

**UI stack:** React 19 + Tailwind 4 on `@rave-page/ui`, the design-system kit
owned by the rave.page repo (`packages/ui`). `src/ui/styles.css` is the Tailwind
entry (`@import "tailwindcss"`); the rave.page design tokens (brand palette,
semantic `--color-*`, `--control-h`, Orbitron font) currently sit in that file
verbatim and move to `@import "@rave-page/ui/tokens.css"` once the kit package
lands. The Orbitron font + its OFL license ship in `dist/*/fonts/`.

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
