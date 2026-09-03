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
