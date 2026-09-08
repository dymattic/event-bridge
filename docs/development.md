# Development

## Build

```sh
pnpm install          # Node 24.20.0 LTS (.node-version), pnpm 10.33.0
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
`src/ui/`. `views/KitShowcase.tsx` renders every export (wired at `#/kit`).

`src/ui/styles.css` is the Tailwind entry:

```css
@import "tailwindcss" source(none);
@import "@rave-page/ui/tokens.css";
@source "../../node_modules/@rave-page/ui/src";   /* node_modules is auto-ignored; opt the kit back in */
@source "./";                                    /* the extension's own UI */
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
  (id, `strict_min_version` `142.0`, `data_collection_permissions`). The floor
  covers the data-collection key's desktop/Android compatibility validation.
  `gecko_android` stays absent: Android is not a tested distribution target.

Edit the manifest under `manifest/`, never the generated `dist/*/manifest.json`.

`base.json` also declares `optional_host_permissions: ["https://*/*"]` — the
runtime grant a **custom rave.page instance** needs (see Settings below). The
manifest probe (`pnpm build && pnpm lint:firefox`) confirmed web-ext accepts this
for Firefox (0 errors; four documented upstream React warnings), so it stays in the shared
`base.json` — no per-browser split. The default dev rave.page hosts remain in the
required `host_permissions`, so the default instance never prompts.

## Load unpacked

**Chrome/Chromium:** `chrome://extensions` -> enable Developer mode ->
"Load unpacked" -> select `dist/chrome`. Click the toolbar icon to open the
dashboard.

**Firefox:** `pnpm dlx web-ext@10.6.0 run --source-dir dist/firefox`
(temporary install), or `about:debugging#/runtime/this-firefox` ->
"Load Temporary Add-on" -> pick `dist/firefox/manifest.json`.

## Gates

```sh
pnpm check:pins   # exact npm pins + matching Node LTS runtime; each >=7 days old
pnpm typecheck    # tsconfig.json (DOM) + tsconfig.background.json (WebWorker)
pnpm test         # vitest
pnpm build
pnpm e2e          # loads dist/chrome in headless Chromium
pnpm lint:firefox # web-ext lint, 0 errors required; upstream warnings stay visible
```

E2E needs the browser once: `pnpm exec playwright install chromium`.

Read [Mozilla / TypeScript compliance](mozilla-compliance.md) before changing
extension permissions, HTML handling, dependencies or release tooling.

## README screenshots

The images under `docs/screenshots/` are generated, never hand-captured. Run:

```sh
pnpm screenshots   # builds, then runs e2e/tests/readme-screenshots.spec.ts with EB_SCREENSHOTS=1
```

`readme-screenshots.spec.ts` is excluded from test discovery unless `EB_SCREENSHOTS=1`, so the
normal `pnpm e2e` run never writes images. It drives the extension through the
same e2e fixtures + mocks the other specs use (all three platforms connected),
so **every capture comes from the mocked test platforms — never a real
account/session**, and each shot is asserted free of any real club/DJ/session
string before it is written. `test/docs/screenshots-manifest.test.ts` guards that
the directory holds exactly the files the README links. Regenerate and re-commit
whenever the UI changes.

## Supply-chain soak

Every direct dep is pinned exact and must be **>= 7 days old** at pin time
(`SUPPLY_CHAIN.md` row each). `pnpm check:pins` verifies this against the npm
registry; `pnpm-workspace.yaml` `minimumReleaseAge: 10080` also gates transitives
at resolve time. Never `@latest`, never a range.

## Packaging & release

Every push to `master` publishes a GitHub pre-release after both CI gate jobs
pass. Pull requests only run checks. Each pushed master tip gets its own version,
tag, Chrome ZIP, Firefox ZIP, matching source ZIP and `SHA256SUMS`.

`tools/prepare-release.mjs` adds the first-parent commit distance from `v0.2.0`
to that tag's patch version: one master commit advances one patch. Merge commits
advance once; retries keep the same version, and overlapping runs cannot reuse
one another's tags. A push containing several commits releases its final tip;
the version accounts for every intervening master commit. Failed gates publish
nothing. Existing releases are never overwritten.

CI stamps `package.json` in its checkout before building; it does not push a
version-bump commit. The source ZIP includes that stamped version. The committed
package version remains the development baseline. `tools/assemble.mjs` copies
the package version into both manifests. Never edit generated manifests.

```sh
node tools/prepare-release.mjs --write  # full Git history + v0.2.0 tag required
pnpm build
pnpm package   # zip the existing build into web-ext-artifacts/
```

`tools/package.mjs` rejects stale manifest versions and writes (git-ignored):

- `web-ext-artifacts/event-bridge-chrome-<version>.zip` — a zero-dep Node ZIP of
  `dist/chrome` (stored, no compression), the folder a user unzips and
  **Load unpacked**s.
- `web-ext-artifacts/event-bridge-firefox-<version>.zip` — built by
  `pnpm dlx web-ext@10.6.0 build` (pinned, run on demand — not a dep), so it's
  the exact artefact AMO would sign.
- `web-ext-artifacts/event-bridge-source-<version>.zip` — tracked sources,
  stamped `package.json`, lockfile and vendored kit, including its sources.
- `web-ext-artifacts/SHA256SUMS` — SHA-256 of all three archives.

**No store listings exist yet.** Distribution today is the zips + "Load unpacked"
(Chrome) / "Load Temporary Add-on" (Firefox). A Firefox temporary add-on is
**gone on browser restart** until a signed build exists; signing (AMO or a
self-distributed signed xpi) is a pre-publish decision for the maintainer.

The release job rebuilds the source archive in a fresh directory and requires
both browser outputs to match byte-for-byte. It has `contents: write`; test jobs
retain read-only permissions. It tags the exact checked commit and attaches all
four files. No AMO credentials are used: Mozilla listing/signing remains a
separate maintainer action.

### Mozilla reviewer build

Upload the Firefox ZIP as the extension and the matching **event-bridge-source**
ZIP as source (the generic GitHub source download has the development version).
See [Mozilla source submission requirements](https://extensionworkshop.com/documentation/publish/source-code-submission/).

Release environment: GitHub Actions Ubuntu x86-64, Node **24.20.0 LTS**, pnpm
10.33.0. Node is single-pinned in `.node-version`; every upgrade must complete a
seven-day soak. Install [Node 24.20.0](https://nodejs.org/en/blog/release/v24.20.0),
then install the pinned package manager with `npm install --global pnpm@10.33.0`.
Extract the source ZIP and run
from its root:

```sh
pnpm install --frozen-lockfile
pnpm build
```

Compare `dist/firefox` with the extracted Firefox ZIP. No Git checkout, sibling
repository, credentials or live platform access is needed. The release build ID
is a hash of source/build inputs, stable across rebuilds. Tailwind scans only
the explicit kit/UI sources, so Git ignore state cannot change CSS output;
watch builds retain a fresh ID so development agents reload. Dependencies are
downloaded through pnpm;
the private-origin UI kit and its original source ship in `vendor/`.

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

## Dashboard routes

`src/ui/dashboard/App.tsx` is a minimal hash router (no router dep) with a top
nav ("Overview · Events · Clubs · Settings") and a muted footer nav ("Overview ·
Developer: rave.page · vrcpop · vrc.tl · Kit"). The hash carries a query for
filter state (`#/events?platform=…&club=…&q=…`); the router splits path from query:

| Hash | View |
|---|---|
| `#/` (default) | Overview (`views/Overview.tsx`) — equal platform cards (vrc.tl, vrcpop.com; rave.page only when the toggle is on) |
| `#/events` | Events (`views/Events.tsx`) — ONE logical row per event across platforms; suggestions + Transfer |
| `#/events?platform=…&club=…&status=…&time=…&from=…&to=…&missing=1&q=…` | Events with URL-synced filters (shareable; `missing=1` = rows missing a connected-platform cell) |
| `#/events/new` (optional `?targets=vrctl,vrcpop`) | Event editor, create (`views/EventEditor.tsx`) — multi-target |
| `#/events/:platform/:id` | Event detail (`views/EventDetail.tsx`) — read-only resolved view + delete/edit |
| `#/events/:platform/:id/edit` (optional `?targets=…`) | Event editor, edit (`views/EventEditor.tsx`) — source event ∪ extra create targets (Transfer) |
| `#/gigs` | Gigs (`views/Gigs.tsx`) — My gigs: DJ-name lookup across connected platforms, grouped list with public links, ICS export. Loads once per open + Refresh (no timers) |
| `#/announce` (optional `?platform=…&id=…&preset=…`) | Announce (`views/Announce.tsx`) — Discord announcement presets: template editor, live `<t:>` preview, lineup + public platform links, copy |
| `#/clubs` | Clubs (`views/Clubs.tsx`) — link the same club across platforms (one row per anchor) |
| `#/jobs` | Jobs (`views/Jobs.tsx`) — persisted job log (create/edit/transfer/delete/sync) with per-step request previews |
| `#/settings` | Settings (`views/Settings.tsx`) — General + Sync defaults + Experimental (rave.page toggle + instance) |
| `#/kit` | `@rave-page/ui` showcase (`views/KitShowcase.tsx`) |
| `#/dev/ravepage` | rave.page dev panel (`RavepageDevPanel`, keeps `rp-*` testids) — **gated** by the toggle |
| `#/dev/vrcpop` | `dev/VrcpopDevPanel.tsx` |
| `#/dev/vrctl` | `dev/VrctlDevPanel.tsx` |
| `#/dev/lineup` | Lineup editor harness (`dev/LineupDevPanel.tsx`) — the reusable `LineupEditor` on a sample event, target checkboxes, live core `Slot[]` JSON |

Top nav is "Overview · Events · Clubs · Jobs · Settings". When the rave.page toggle is off, the
rave.page-only routes (`#/dev/ravepage`, `#/events/ravepage/:id`,
`#/events/ravepage/:id/edit`) render an `EmptyState` (`ravepage-off`) linking to
`#/settings` instead of the view. `#/events/new` is always reachable (targets are
gated per-platform inside the editor).

**Developer panels are hidden by default.** The footer dev links (`#/dev/*`,
`#/kit`) render only when Settings → Experimental → **Developer panels**
(`developer.panels`, off by default; testid `settings-developer-panels`) is on.
The routes themselves stay reachable by URL regardless — this gates the footer
nav, not the router — so e2e specs still navigate to them directly. Off, the
footer shows only the repo link + build id.

The Overview treats all three platforms identically (no primary platform): each
card shows name + host, a session-status badge (`getSessionStatus` for
vrc.tl/vrcpop; the rave.page token store for rave.page) that surfaces the
resolved account **name** (never a raw id), a `caps`-derived "Supports" line,
and user-triggered actions (Open + Refresh for the tab platforms;
Connect/Disconnect + Refresh for rave.page). When a platform is connected the
card also lists own clubs (name, type, per-club event count), an upcoming-event
StatCard, and a "View events" link into `#/events`.

### Events surface (P6.1)

Real listings, resolved ids. `src/ui/lib/` holds the reusable data layer:
`resource.ts` (a zero-dep stale-while-revalidate cache + `useResource`,
`invalidate(prefix)`, `refresh()`, 5-min TTL), `format.ts` (Intl date/time +
relative-day), `platform-meta.ts` (PURE names/hosts + the 300 ms third-party read
gap - no webext/settings import, so node tests can load it), `platform-urls.ts`
(settings-bound `platformHost`/`eventUrl`), and `event-filters.ts` (pure filter/sort +
hash-query sync). `src/ui/dashboard/lib/event-data.ts` wraps the adapter registry:
own clubs → own events per club, **paced ≥300 ms between reads to a third-party
host** (rave.page, our own API, is not paced), with platforms loaded in parallel
by their independent `useResource` keys. Delete uses the adapter plan/execute
split — the exact planned request is shown in a collapsible preview before
`ConfirmDialog` (destructive-styled + platform-named for public/published
events), then `planDelete` → `execute`, cache invalidate + toast.

The registry (`src/adapters/registry.ts`) exposes `getAdapter(id)` + `ADAPTER_IDS`
for all three platforms; the two agent-bound adapters live in each platform's
`platform.ts`. e2e drives every route (`kit`/`vrcpop`/`vrctl` panel specs).

**vrcpop card-date approximation.** The events-list card renders the date as a
human label in the OWNER's timezone (e.g. `Thu, Sep 3, 2026 at 10:00 PM`).
`parseVrcpopCardDate` (in `adapters/vrcpop/parse.ts`) strips ` at ` and
`Date.parse`s the rest into an ISO instant for `OwnEvent.start` — a browser-local
**approximation** good enough for listing/sorting/upcoming counts; the exact
instant comes from `readEvent` (`start_timestamp_utc`). It returns `undefined`
for an unparseable label — never the raw string (which would make `Date.parse`
NaN and drop the row from the Overview upcoming count while `#/events` still
listed it — the P6.1b bug). Overview and `#/events` share one rule,
`event-filters.ts` `isUpcoming(row)` (`matchesTime('upcoming')` AND
`status !== 'past'`), so the card count and the table never disagree.

### Event editor (P6.2)

`views/EventEditor.tsx` is the create + edit surface, reachable from the Events
"New event" button and the detail "Edit" button. One `EventForm` drives a live,
per-target loss report, validation, and payload preview; **Run** executes each
checked target sequentially.

- **Pure form model** `src/ui/lib/event-form.ts` — `EventForm` (the string/boolean
  fields the inputs bind to + a passthrough of non-edited fields), `emptyForm(zone)`,
  `fromCore`, `toCore` (local↔UTC via `time.ts` with the form zone; instants store
  the event-zone wall string, and a `source` snapshot lets an untouched time
  round-trip to the exact ISO — no millis/DST re-snapping), and `formIssues`
  (= `validateEvent` on the derived core plus zone-invalid / doors-after-start; no
  form-field end check — end is derived, so a moved start never trips a stale end).
  `deriveEnd(core, {defaultDurationMin, sourceEnd?})` computes the end the user
  never types: latest slot end (a timed slot lacking an end is `DEFAULT_SLOT_MINUTES`
  long — the shared `lineup-bridge` constant), else start + `defaultDurationMin`;
  edit keeps the source end unless the derived end is LATER (a grown lineup extends,
  a shrunk one never truncates). DST-safe via `time.ts` instant math.
  `toCore(fromCore(x))` is lossless (round-trip tested against `lineup-sample.json`
  and a `from-ravepage` core). PURE — node-testable, no runtime/adapters import.
- **Shared plan runner** `src/ui/dashboard/lib/run-plan.ts` — `runPlan(platform,
  steps, opts?)`: sequential, `resolveRefs` before each `execute`, `paceHost`
  before each step, dispatches via `getAdapter(platform).execute(step)` (each
  adapter self-binds its agent/CSRF context), **stops at the first failure** (no
  silent retry), emits a `StepEvent` per transition for the live log, and takes
  `opts.results` to resume a "Retry from failed step". Poster BYTES ride the
  adapter's imperative `setPoster` after the JSON plan; URL posters ride
  `planPoster` (vrc.tl) or the create body (rave.page `cover_image_url`).
- **Link store** `src/runtime/link-store.ts` — `EventLink {anchorId, refs[], createdAt}`
  in `storage.local.links`. A multi-target create saves one link with every created
  ref; a single-target create saves a one-ref link. `listLinks`/`saveLink`/
  `findLinkByRef`/`removeLink` (+ `makeLink`). P6b/P7 (sync, transfer, jobs) build on it.
- **PosterPanel** `src/ui/dashboard/components/PosterPanel.tsx` — thumb (url or
  object URL of picked bytes), "Use image URL", "Pick file" (`image/*`, > 8 MB
  warns), "Remove", and the sha256 of picked bytes (`src/ui/lib/digest.ts`) in a
  disclosure. Emits `(PosterRef | null, PosterFile | null)`.
- **Targets** are `enabledPlatforms()`, checkable only when connected; each checked
  target gets its own club picker (names) and, in the Review tab, its own
  `LossReportView` (dropped/approximated/**required**, required items link to their
  tab), validation issues, publish switch (turning it on for vrcpop opens a red
  confirm), and a live `renderPreview` of `planCreate`/`planUpdate`. Edit mode also
  shows "Changed fields" (`diffEvents(current, toCore(form))`). **Run** is disabled
  while any target has validation issues or unmet `required`. On failure the runner
  stops and offers "Retry from failed step" and, when a create already succeeded,
  "Delete created event on <platform>" (never automatic).
- **Start-only times (P7.1).** Basics asks only for the **Start** (required); the
  End field is gone and **Doors open** moved under a *More times* disclosure. The
  end is derived (`deriveEnd`) in the editor's `core` memo before planning, so
  previews / LossReport / validation see it; each Review target shows *Ends <local>
  (from lineup / default N h)* — what will be sent (vrcpop `end_time`, rave.page
  `ends_at`; vrc.tl uses slot times, noted inline). The no-lineup default is
  `Settings.editor.defaultDurationMin` (default 120). Rationale: slot count/length
  are chosen on the Lineup tab, so a separate end entry was redundant.

### Unified events + clubs (P6b)

`#/events` shows ONE logical row per event across platforms — a cell per enabled
platform (`PLATFORM_ORDER`, restricted to `enabledPlatforms`). Grouping is pure +
node-tested; the runtime only supplies stored links.

- **Club anchors** `src/ui/lib/club-anchors.ts` (PURE) — `buildClubAnchors(clubsByPlatform,
  links)`: clubs sharing a `vrchatGroupId` auto-group under that grp id
  (`source:'vrchatGroup'`); a stored `ClubLink` adds/overrides members
  (`source:'link'`); a club with neither is a singleton `solo:<platform>:<id>`
  (`source:'solo'`). Anchor name = first member by `PLATFORM_ORDER`.
  `anchorLookup(anchors)` maps `(platform, clubId) -> anchorId` (solo fallback).
- **Club link store** `src/runtime/club-links.ts` — `storage.local.clubLinks`;
  `ClubLink {anchorId, members:Partial<Record<Platform,{organizerId,name}>>}`
  (canonical type in club-anchors); `listClubLinks/saveClubLink/removeClubMember`.
- **Matcher** `src/ui/lib/event-match.ts` (PURE) — `normalizeTitle` (lowercase,
  strip test prefix, drop punctuation/emoji, collapse ws), `titleSimilarity`
  (token-set Dice 0..1), `groupLogicalEvents({rows, links, anchorOf, dismissed,
  now})` -> `{logical, suggestions}`. Linked rows (`EventLink`) collapse into one
  `LogicalEvent` (refs without a row are ignored but counted in `staleRefs`).
  A `Suggestion` forms between unlinked rows on DIFFERENT platforms iff same club
  anchor AND `titleSimilarity >= 0.6` AND (both starts parseable with `|Δ| <= 24h`,
  `strong` when `<= 30min`; OR similarity `>= 0.9` with an unparseable start).
  Greedy by score, one row per platform; `key` = sorted `platform:id` refs joined
  by `|` (the dismissal key). `filterLogical` reuses `EventFilterState` (+ optional
  `missing`, query `missing=1`): platform/club/status match any cell; time = earliest
  start via `isUpcoming`; `missing` = fewer cells than the connected platforms.
- **Views** — `views/Clubs.tsx` (`#/clubs`) links clubs across platforms via a
  `SmartSelect` per empty cell (testid `club-link-<platform>`), Unlink on a linked
  member (`club-unlink-<platform>`), "same VRChat group" hint on an auto-grouped
  member. `views/Events.tsx` renders logical rows (`components/LogicalEventsTable.tsx`):
  a present cell links to detail (`cell-<platform>-<rowKey>`); a missing+connected
  cell offers Transfer -> `#/events/<src>/<id>/edit?targets=<platform>`
  (`cell-transfer-<platform>`); missing+disconnected is a muted "—". Suggestions
  render above the table ("Probably the same event", `suggest-link` /
  `suggest-dismiss`). Row actions: Edit (first present cell) + Unlink (`row-unlink`,
  linked rows only). Per-cell **Delete** stays on the detail view (`event-detail-delete`).
- **Dismissals** `src/runtime/dismissals.ts` — `storage.local.dismissedSuggestions`
  (string[] of suggestion keys); `listDismissed/dismissSuggestion`.
- **Link store** `src/runtime/link-store.ts` gained `upsertLinkForRefs(refs)` —
  merge into a link containing any ref (replacing same-platform refs) else create;
  the editor uses it, keeps `createdRefs` across run/retry (successful targets are
  linked even if a later one fails), skips re-applying an unchanged poster on an
  edit, and (edit mode) unions the source with `?targets=` create targets.

**Storage keys:** `settings` (now incl. `sync` defaults), `links` (EventLinks,
now with optional per-link `sync` + `lastSynced` baselines), `clubLinks`
(ClubLinks), `dismissedSuggestions`, `jobs` (P7 job log), `ravepage.auth`. All
extension-local; nothing leaves the browser.

e2e: `unified-events.spec.ts` (club linking via SmartSelect, suggestion Link,
Transfer -> editor, missing filter, Unlink, rave.page third column, mobile
overflow). The vrc.tl mock "what's poppin" (100002) start is aligned to the vrcpop
2030 card so the two match.

### Auto-sync, jobs, performer resolution (P7)

**Past events are out of scope by default.** The default time filter is
`upcoming`; a past event never appears in the upcoming view, forms no
suggestion, and is skipped by the sync pass. Switch the time filter to `past` /
`all` to opt in. `event-filters.ts` `inTimeScope(row, time)` is the single rule
the Events matcher input and the sync pass share. Because a platform can leave a
stale status on a past event (rave.page keeps `scheduled` months later),
`displayStatus(row, now)` shows a muted **ended** badge instead of the raw
status once the start/end has passed (purely cosmetic; `isUpcoming` is
unchanged). Overview club rows count **upcoming** (with an optional `· n past`).

**Jobs (`src/runtime/jobs.ts`, `#/jobs`).** Every plan run opens a `JobRecord`
(`storage.local.jobs`, newest-first, cap 50): `kind`
(create/edit/transfer/delete/poster/sync), `title`, `status`
(running/done/failed/interrupted), `targets`, `steps`, `refs`. Each step stores
the **exact resolved request** (`JSON.stringify`, never tokens — auth is added by
the transport, never in a step request) + any error. API: `startJob`,
`recordStep`, `finishJob`, `listJobs`, `clearFinishedJobs`, `markInterrupted`
(called once on dashboard boot: a `running` job left over from a prior session
can't resume → `interrupted`). Runs feed `runPlan`'s `onStep` into the store via
the tiny `dashboard/lib/job-recorder.ts` adapter (`startJobRun` → per-platform
`stepRecorder` + `finish`, writes serialized so overlapping running/done events
don't lose an update), keeping `run-plan.ts` decoupled. The editor, delete
dialog and sync engine each open a job. `views/Jobs.tsx` = a DataTable
(when/kind/title/targets/status) with a row disclosure of the step previews +
"Open event" + "Clear finished" (`jobs-clear`).

**Sync model.** Pure planner `src/ui/lib/sync-plan.ts` (imports only core +
platform-meta; node-tested):
- `projectScoped(core, fields)` → a plain object of only the opted-in fields
  (`details` = title/description/start/end/doorsOpen/zone/flags/music/links;
  `lineup`; `poster` = url/platform ref only, never bytes; `publishState` =
  visibility.publish). A change outside the scope is invisible.
- `scopedHash(core, fields)` = `hashCanonical(projectScoped(...))` — stable;
  drives "changed since baseline".
- `planSync({link, cores, hashes})` → `SyncAssessment { state; source?;
  changedSince; targets:[{platform, changes (diffObjects target→source),
  conflict}] }`. States: `off` (mode off); `in-sync` (all match their baseline);
  `pending` (one changed ref = source, propagate to the rest); `conflict` (>1
  drifted from a baseline, or an explicit-source target that also drifted —
  never auto-applied); `pick-source` (first run, no baseline, refs differ).
  `changedSince` = refs whose current scoped hash ≠ `lastSynced` hash (no
  baseline counts as changed).

Engine `src/ui/dashboard/lib/sync.ts` (webext-bound; render tests mock it):
- `assessLink(link, settings, connected)` reads each connected ref's core
  (paced), hashes with the link's fields, runs `planSync`.
- `applySync(link, assessed, {source, resolutions?, auto?})` writes each
  actionable target: `mergeScoped` (source's **defined** fields win, gaps keep
  the target's value so a field the source can't represent — e.g. vrcpop has no
  per-event NSFW — never wipes a required target value) or, for a conflict, a
  per-path merge from `resolutions`. A **required-id** target (vrc.tl)
  auto-resolves exact performer matches; still-unresolved → that target is
  skipped as *needs-resolution* (no write, a link to the editor). `planUpdate` →
  `runPlan` under a `sync` job; poster in scope + url → `planPoster`, url→upload
  target → fetch bytes + `setPoster`. After success it writes fresh `lastSynced`
  for the source + written targets and returns the updated link. A public
  publish flip needs `publishConfirmed` (red confirm); an automatic pass never
  flips to public without it.
- `setBaseline(link, …)` records current hashes with no platform write.
- `runSyncPass(anchorIds, connected)` (reads links fresh) — notify: assess only;
  apply: assess then apply non-conflicting targets. Triggers: the Events view
  runs it as a `sync:pass` resource on load / Refresh / after a local write
  (`invalidate('sync:pass')`). **Never timers/alarms/background.**

UI: a **Sync** cell on linked rows (`LogicalEventsTable`) shows the state badge
(In sync / n pending / Conflict / Pick source / —) and opens `SyncSheet`
(`sync-sheet`) — per-link mode/source/fields (`sync-mode`/`sync-source`/
`sync-field-<f>`), the per-target `path: from → to` rows, per-field conflict
picks (`sync-pick-<path>-source`/`-target`), **Apply now** (`sync-apply`, disabled
until every conflict field is picked), **Set as baseline** (`sync-baseline`), and
the last run's result. Defaults live in Settings → **Sync defaults**
(`settings-sync-*`); a new link inherits them (`upsertLinkForRefs` / the
suggestion Link), existing links keep their own.

**Performer resolution.** `PlatformCapabilities.performerIds` is `required`
(vrc.tl) or `optional` (vrcpop/rave.page). `computeLoss` emits a `required`
`lineup.N.performers.M` for each performer lacking that platform's alias id on a
required target (vrc.tl accepts free-text, so `assertWritable` does NOT hard-fail
on it — it's a UI gate). The editor Lineup tab's `PerformerResolver` (shown only
when a checked required target has an unresolved performer) auto-adopts exact
case-insensitive matches via `performer-search.ts` and offers a search picker
(`resolve-<slotIdx>-<perfIdx>`) for the rest; a pick adds the alias to
`form.lineup`, so a transfer to vrc.tl carries the id, not the name.

e2e: `jobs.spec.ts` (a create run is logged done with a step preview),
`transfer.spec.ts` (vrcpop→vrc.tl carries the resolved performer id), and
`autosync.spec.ts` (notify: baseline → drift → 1 pending → Apply writes the new
title → In sync; conflict blocks Apply until a per-field pick, no write before
it; apply mode writes on Refresh + logs a sync job; off does nothing). The
vrcpop mock's `recorder.eventName` simulates a "changed on re-read" edit.

**Read integrity + canonical projection (P7.2).** Sync compares two consecutive
reads by a scoped hash, so each read MUST be deterministic — a non-deterministic
read reads as false drift ("n pending" that never clears) and, in apply mode,
would WRITE it to the targets on every Refresh. Two guards:
1. **vrcpop `readEvent` fails loud.** A failed `/api/event-lineup.php` fetch now
   throws instead of the old `catch { lineup = undefined }`, which silently fell
   back to the edit-page `data-event` sets (no per-slot genre/energy, different
   performers). `assessLink` EXCLUDES a ref it can't fully read, so a transient
   lineup failure never yields a degraded core that flips the hash or pushes a
   stripped lineup; the editor surfaces the error instead.
2. **`projectScoped` canonicalizes before hashing/diffing.** `music.genres` sorted
   case-insensitively; each slot's `performers`/`dancers` sorted by name, aliases
   by platform; slots in start order. Equivalent re-orderings hash equal; a real
   change still differs. `mergeScoped` keeps the platform's real order when it
   writes (canonicalization is projection-only).

A link stays removable in the UI: `LogicalEventsTable` renders **Unlink** (and the
Sync cell) on any linked row (`le.linkId`), in both the table and the mobile card.
A link whose refs match no loaded row produces no row (`groupLogicalEvents` drops
a zero-`found` link) — that fully-orphaned case only arises when every ref's event
is deleted/unlisted; a link with any listed ref is always removable.

### My gigs (DJ-name lookup, ICS)

`#/gigs` (`views/Gigs.tsx`) answers "where am I playing next?" The user enters
their DJ name(s) (`settings.gigs.names`, normalized by `ui/lib/gig-names.ts` —
trimmed, non-empty, deduped case-insensitively, ≤10 names, ≤64 chars each). For
each **enabled + connected** platform, `dashboard/lib/event-data.ts` `loadGigs`
runs every adapter's `listGigs(names)` in **parallel** (each adapter paces its own
reads); one platform failing lands in `errors[p]` (human copy via `error-copy`)
and never hides the others. What each platform reads:

- **vrcpop.com** — the user's own **performer profile** (`/u/<slug>`, public
  page, own/self-asserted slug only) plus the lineups of clubs they manage. See
  [docs/platforms/vrcpop.md](platforms/vrcpop.md).
- **vrc.tl** — the **public timeline** (`GET /api/v1/events`, the same paged
  listing the web app calls; owner-approved 2026-09-07) matched by slot performer
  name — so gigs at **any** club are found — **plus** the lineups of the user's
  own clubs (which also catch hidden-slot / host-only events). One bounded paged
  pass per refresh (≤12 pages, ~36-day horizon), paced ≥300 ms. See
  [docs/platforms/vrctl.md](platforms/vrctl.md).
- **rave.page** — the user's **bookings received** (accepted → confirmed,
  unaccepted → a "pending" badge) plus own-event lineups. See
  [docs/platforms/ravepage.md](platforms/ravepage.md).

**Load-once discipline (user + repo rule).** The view keys a `useResource` with an
**infinite TTL** on `gigs:<platforms>:<names>`, so it fetches exactly once when the
page opens (or the key changes) and again only on an explicit **Refresh** —
**never** on a timer or in the background. e2e asserts `recorder.profileGets`
stays `1` until Refresh.

**Sources line + empty states.** Above the table a `gigs-sources` row shows every
enabled platform as a `Badge` — `success` "checked" when it was queried, else
`secondary` with the reason (`No tab open` / `Signed out` / `No access` /
`Not connected`, reusing `ui/lib/status.ts` wording); a tab platform with no tab
open gets an **Open vrc.tl / Open vrcpop.com** button
(`ensureAgent(p, { allowOpen: true, active: false })` then `conns.refresh()` — the
reconnect grows `queried`, changing the resource key so the lookup re-runs with no
manual Refresh), and rave.page a **Connect in Settings** link. The empty state
also names the unchecked platforms + reason, and the footer states event-bridge
reads your performer profile (vrcpop.com), the public timeline and clubs you manage
(vrc.tl), your clubs' events (vrcpop.com) and your bookings (rave.page).

**Grouping + display.** `core/gigs.ts` `groupGigs` merges the same logical event
across platforms into one row (single-linkage on normalized title + start within a
6h window, or a shared club within 1h with a high title similarity; at most one
gig per platform per group). Each row shows the local when/set-time, the event
title (public link), the club, one link chip per platform, and the matched name —
resolved names only, never raw ids as a primary label.

**ICS export.** `core/ics.ts` `buildIcs(groups, { mode })` builds an RFC-5545
calendar; the `SmartSelect` picks the mode — **My set times** (`set`: DTSTART/END =
the user's slot, event fallback) or **Whole event** (`event`). `dashboard/lib/
download.ts` `downloadText` does the Blob/anchor mechanics.

## Settings & the experimental rave.page toggle

`src/runtime/settings.ts` owns `storage.local.settings`:

```jsonc
{
  "closeOpenedTabs": true,
  "testPrefix": "[event-bridge test] ",
  "experimental": { "ravepage": false },        // rave.page integration, OFF by default
  "ravepage": {                                  // configurable instance (self-hosted / federated)
    "appOrigin": "https://development.rave.page",
    "apiOrigin": "https://development.api.rave.page"
  },
  "sync": {                                      // defaults a new link inherits (P7)
    "mode": "off",                               // off | notify | apply
    "source": "last-edited",                     // last-edited | a Platform
    "fields": { "details": true, "lineup": true, "poster": true, "publishState": false }
  },
  "editor": { "defaultDurationMin": 120 }        // event length when no lineup sets the end (P7.1)
}
```

The Settings view has an **Editor** card (`settings-editor-duration`, a
`type=number` input) for `editor.defaultDurationMin`.

`merge()` deep-merges nested defaults, so settings stored before these keys
existed still load. Helpers: `isRavepageEnabled()`, `getRavepageInstance()`,
`enabledPlatforms(s)` (fixed order `vrctl, vrcpop, ravepage`-if-enabled),
`normalizeOrigin(input)` (trim; must parse as URL; `https:` only, `http:` for
`localhost`/`127.0.0.1` only; drops path/query/hash/credentials; lowercases host).

**Toggle off (default):** rave.page appears nowhere — no Overview card, no
`#/events` row/filter option, no popup row, no Connect affordance. vrc.tl and
vrcpop are unchanged. Overview/Events/popup subscribe to `onSettingsChange`, so
flipping the toggle applies without a reload.

**Configurable instance:** every rave.page host in `src/` resolves through
settings — `client.ts` `ensureConfigured()` sets `OpenAPI.BASE` at each
adapter/auth/upload entry point; `auth.ts` builds the bridge URL from `appOrigin`
and exchanges against `apiOrigin`; `tabs.ts` `getPlatformMeta('ravepage')` and
`ui/lib/platform-urls.ts` derive origin/host/`eventUrl` from settings; the agent
(`session.dom.ts`, `ravepage-grant.dom.ts`) never hardcodes the origin — the
dashboard passes the expected origin in the op and the agent verifies
`location.origin` matches. The stored token records its `apiBase`; a token whose
`apiBase` ≠ the configured `apiOrigin` is treated as absent (cleared), so changing
the instance disconnects.

**Permission behaviour for a custom instance:** Settings → Save normalizes both
origins; if either differs from the default (required) hosts it calls
`ext.permissions.request({origins:[appOrigin+'/*', apiOrigin+'/*']})` **inside the
click gesture** (Firefox needs the gesture live). Chrome prompts for the new host
permissions on Save; Firefox treats host permissions as optional and prompts the
same way (backed by `optional_host_permissions` in `base.json`). On denial the old
instance is kept + an error toast; on grant it persists, clears the token,
invalidates the resource caches, and toasts "reconnect to continue". "Reset to
defaults" restores the dev instance.

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
`getExtensionId`, and `enableRavepage(page)` — turns the experimental rave.page
toggle on by writing `{settings:{experimental:{ravepage:true}}}` into
`chrome.storage.local` from a privileged extension page (never by hardcoding the
flag in production code); `merge()` deep-merges the rest of the defaults. rave.page
specs (`ravepage-connect`, `event-detail`, `events`, `overview`) and the
three-card path in `settings.spec.ts` call it before navigating. Specs:
`settings.spec.ts` (default two cards, toggle-on three cards without reload,
`#/events` gating, `ravepage-off` route state), `session-status.spec.ts`,
`agent-blob.spec.ts` (3 MiB sha256 round-trip over a real port), plus the P0
`smoke.spec.ts`.

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

**Genres** write organizer-side: `PUT /taxonomy/{entity_type}/{entity_id}/genres`
(`setEntityManualGenres`, body `{genre_slugs}`) replaces this caller's manual
genre assignments; slugs resolve from `GET /taxonomy/genres` (`loadVocab`). The
admin-only POST `/taxonomy/entities/event/{id}/genres` is not used (403 for
non-admin owners).

**Vocab mapping to the live spec** (`toRavepage`/`fromRavepage`, with `// spec:`
comments citing the `EventOut` schema fields): platform tags `windows→pc`,
`android→quest` (ios has no rave.page tag → `LossReport.dropped`); `age_gate` ∈
`all_ages | 18_plus | 21_plus` (core `ageGated` → `18_plus`); `scene_type` ∈
`club | festival | rave | concert | showcase`; `energy_level` ∈
`chill | medium | high | extreme`. Unmappable scene/energy values drop to the
loss report instead of being sent verbatim.

### Discord announcements (presets)

`#/announce` (`views/Announce.tsx`) renders a Discord-ready post for one of your
events from a user-editable **preset**. A preset is a header / per-slot line /
footer template; the pure renderer (`core/discord.ts`, `renderAnnouncement`)
resolves `{token}` placeholders, markdown-escapes text (URLs kept intact), joins
the slot lines, and drops the lineup block between header and footer unless the
author placed `{lineup}` themselves.

**Timestamps** compile to `<t:unix:STYLE>` — Discord shows each in the READER's
own time zone, so the extension never picks one.

| Style | Renders as |
|---|---|
| `t` | 16:20 |
| `T` | 16:20:30 |
| `d` | 20/04/2021 |
| `D` | 20 April 2021 |
| `f` | 20 April 2021 16:20 |
| `F` | Tuesday, 20 April 2021 16:20 |
| `R` | in 2 months |

**Placeholders** are scoped. Event scope (usable in header/footer): `{title}`,
`{description}`, `{club}`, `{start:STYLE}`, `{end:STYLE}`, `{doors:STYLE}`,
`{duration}`, `{genres}`, `{links}`, `{link:vrctl|vrcpop|ravepage}`, `{lineup}`,
`{count}`. Slot scope (the per-slot line): `{n}`, `{performers}`, `{vj}`,
`{start:STYLE}`, `{end:STYLE}`, `{duration}`, `{genre}`, `{energy}`, `{title}`,
`{note}`. Event timestamps default to `F`, slot timestamps to `t`. Append `!raw`
to a token to skip markdown-escaping. The full list ships as `PLACEHOLDER_HELP`
and is shown in the view's Placeholders disclosure.

**Links are PUBLIC event URLs.** `{links}` / `{link:…}` resolve every ref of the
event's cross-platform `EventLink` (`runtime/link-store`) through
`publicEventUrl` (`ui/lib/platform-urls`) in `PLATFORM_ORDER` — the share pages
anyone can open, never the owner manage/detail surface. With no link, just the
selected platform's public URL.

**Presets live locally.** Three code builtins (`DEFAULT_PRESETS`: Classic,
Compact, Countdown) plus user presets in `storage.local` under `announcePresets`
(`runtime/announce-presets.ts` — builtins first, then user presets by `updatedAt`
desc; save/delete refuse builtin ids). Built-ins are read-only; **Duplicate to
edit** copies one into an editable user preset. Edits render live (unsaved
included); the selected preset id rides in the URL (`?preset=`) so it survives a
reload.

**2000-char guard.** The preview shows a live character count and a warning
badge past Discord's 2000-character message limit (the post is not blocked).
**Copy for Discord** writes the exact text via `navigator.clipboard`, falling
back to a hidden `<textarea>` + `execCommand('copy')` (extension pages may lack
async-clipboard permission), and mirrors the text in a hidden `announce-raw`
textarea for e2e/manual selection.

## Manual verification browser (`pnpm dev:browser`)

Builds, then launches a **headed** Chromium with the unpacked extension loaded
into a persistent, git-ignored `.profile/` and `--remote-debugging-port=9222`.
It prints the extension id + dashboard URL and opens the dashboard, then stays
alive until Ctrl+C. The user logs in on development.rave.page themselves in that
window; the lead attaches tooling (Playwright/CDP) via
`http://127.0.0.1:9222`. rave.page development is exercised with draft/unlisted
events only, cleaned up afterwards (repo rule: no test events on vrc.tl/vrcpop).

### Gotchas

- **Enable Developer mode in the `.profile` once.** In that window open
  `chrome://extensions` and turn on Developer mode. Without it, any
  `chrome.runtime.reload()` (or the extension reloading itself) on a
  `--load-extension` build disables the extension as "may have been corrupted"
  and it vanishes mid-session. Developer mode persists in the profile; after a
  disable, re-enable it and press Reload.
- **Attach over CDP, never own the browser.** Drive the running window with
  `chromium.connectOverCDP('http://127.0.0.1:9222')`. Detach with
  `process.exit` - never `browser.close()`, which would kill the user's
  logged-in session.

## Manual write-test checklist (vrc.tl / vrcpop — USER ONLY)

Agents never create/edit/delete on vrc.tl or vrcpop.com (repo rule); automated
coverage there is mocks-only. These real-session write tests are the **user's** to
run, in their own logged-in browser. rave.page **development** drafts may be
exercised by anyone and are deleted afterwards.

Per platform (vrc.tl, then vrcpop.com), from `#/events/new`:

1. **Create draft.** Tick the target, pick a club by name, fill Basics (title with
   the test prefix via the "Prefix as test event" switch; start; zone), set NSFW/SFW
   (required for vrc.tl), add one lineup slot with a searched performer. On Review,
   open "Show exact request" and confirm the payload; keep Publish OFF. Run → the new
   event opens; confirm it exists on the platform as a **draft/unpublished** event.
2. **Edit.** Open the event's Edit, change the title + description, confirm "Changed
   fields" lists them, Run, and verify the change landed (vrcpop: the update carried
   the current `version` — no `VERSION_CONFLICT`).
3. **Poster.** Edit → Poster: set a URL (vrc.tl) or pick a file (both), Run, confirm
   the poster shows on the platform. Then Remove, Run, confirm it's cleared.
4. **Delete.** Delete the event via the detail Delete flow (preview the exact request
   first) and confirm it is gone from the platform.
5. **Publish toggle.** For a **disposable** draft only, flip Publish ON in Review
   (vrcpop shows the red "publishes PUBLICLY" confirm), Run, confirm it went public,
   then delete it. Never publish a real/other club's event.

**vrcpop draft support (`caps.draft` is `expected-unverified`).** vrcpop's draft
flag was never probed (no test events allowed). If the create-draft test above
produces a genuine draft (not a forced-public event), report back so
`VRCPOP_CAPS.draft` can flip from `'expected-unverified'` to `true`.

### Sync test (USER ONLY — writes land on rave.page only)

Sync toward vrc.tl / vrcpop is the user's to test, source-only elsewhere. The
extension writes **only** the platform you pick as a target; keep vrc.tl / vrcpop
as the **source** so nothing is written there.

1. **Set up.** Create ONE rave.page **development** draft (unlisted, publish OFF,
   one slot). In extension storage add an `EventLink` with two refs — that draft
   and one of your existing vrcpop events — since their titles differ the
   suggestion won't fire. Open the row's **Sync** cell → set mode **notify**,
   source **vrcpop**, fields **details + lineup**.
2. **Baseline + assess.** Click **Set as baseline**, then **Refresh** — with no
   drift it reads *In sync*.
3. **Drift → apply.** Edit the vrcpop event (title/description), **Refresh** → the
   cell shows *n pending* and the Sheet lists the changed fields (vrcpop → rave.page).
   **Apply now** → confirm on the rave.page detail view that ONLY the rave.page
   draft changed; the cell returns to *In sync*; `#/jobs` shows a **sync** job with
   rave.page steps only (no vrcpop step).
4. **Transfer performers.** Transfer a vrcpop event to vrc.tl; on the Lineup tab
   the resolver adopts exact performer matches — confirm the previewed vrc.tl
   request carries performer **ids**, not names. (Do NOT Run the vrc.tl create
   for a non-disposable event.)
5. **Clean up.** Remove the `EventLink`, delete the rave.page draft via its detail
   Delete flow, and confirm it's gone under `#/events?time=all&platform=ravepage`.
   Never Apply toward, or Delete on, vrc.tl / vrcpop.

## Backlog

Deferred, not-yet-implemented ideas (deliberately out of scope for now):

- **Retry a failed create/edit from `#/jobs`.** The editor already retries an
  in-session failure ("Retry from failed step") and `#/jobs` links **Open event**
  when a run produced refs. Re-opening the editor *prefilled* from a failed job
  needs reconstructing the form from the stored step requests (a failed create
  has no event to open) — non-trivial, deferred.
- **Live poster-upload progress.** The chunked rave.page upload has a bounded
  status poll and surfaces a coarse `poster-upload` run-log step (running →
  done/error); per-chunk / percentage progress is not shown.
- **Sync-noise reductions (from P7).** Name-normalized lineup projection,
  club-level sync defaults, a kit async-search primitive, and a proven
  poster cross-origin fetch for URL→upload sync targets — all deferred; the
  current sync pass is deterministic and conflict-safe without them.
