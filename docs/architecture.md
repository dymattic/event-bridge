# Architecture

How event-bridge is put together, at a glance. Details live next to the code and
in [development.md](development.md); this page is the map, not the territory.

```
src/
  core/       event interchange schema + mapping + capability/loss + errors (pure TS)
  adapters/   one per platform (vrctl, vrcpop, ravepage) behind a shared interface
  agent/      injected per-origin content script: same-origin HTTP + session read
  background/ service worker: opens/focuses the dashboard, nothing else
  ui/         React 19 + @rave-page/ui dashboard + popup; pure logic in ui/lib
  shared/     protocol types, base64 chunking, the webext shim
```

## Contexts

Three cooperating contexts (same in Chrome and Firefox):

- **dashboard / popup** — extension pages (`dashboard.js`, `popup.js`). They run
  everything: `src/runtime/*` orchestrates agents, session status and settings;
  the React UI renders the product. The popup shows per-platform session status
  and (Firefox) requests host permissions inside the click handler.
- **agent** (`agent.js`, `src/agent/*`) — injected on demand per origin via
  `scripting.executeScript`, so its `fetch` is **same-origin** with the user's
  live session cookies. Idempotent install guard; answers a one-shot `ping` and
  then request/response ops over a named `'agent'` port: `session`, `http`
  (strictly same-origin), and blob transfer. Binary crosses the message bus as
  base64 slices ≤1 MiB (Chrome JSON-serializes messages, so typed arrays don't
  survive).
- **background** (`background.js`) — only opens/focuses the dashboard. No DOM,
  no network.

`ensureAgent(platform, {allowOpen})` finds a platform tab, optionally opens one
inactive, injects, and verifies the build (stale → reload + re-inject once).
`getSessionStatus` never opens tabs; only a user-triggered action may. There is
**no timer, alarm or background poll** anywhere — every network action is one the
user just triggered.

## Adapters (the only code that talks to a platform)

Core and UI never touch a platform directly. Each adapter implements one shared
interface (`src/adapters/types.ts`) and hides that platform's quirks:

- **vrctl** — Nette (PHP) forms, session cookie only, all HTTP through the agent
  **inside the user's vrc.tl tab** (same-site guard); parsing runs in the
  dashboard with `DOMParser`. No `fetch(` in the adapter.
- **vrcpop** — JSON API, `x-csrf-token` header, `version` optimistic lock
  (read-before-write).
- **ravepage** — official REST API via a generated client. Calls go only through
  the `ROUTES` allowlist (`adapters/ravepage/routes.ts`); a unit test greps the
  adapter for raw `fetch(` and permits exactly one (the chunk PUT, marked
  `raw-fetch-allowed:`).

**Own surfaces only.** Adapters read/write the user's own clubs and events —
there is deliberately no route for public listings or bulk harvesting (see the
[non-negotiable rules](../CLAUDE.md)).

## Plan / execute split

Writes are two phases so the user can preview the exact request before anything
is sent:

1. **plan** — pure builders (`planCreate` / `planUpdate` / `planDelete` /
   `planPoster`) turn a core event into an ordered list of `PlannedStep`s with
   `{$ref}` placeholders for ids not known until an earlier step runs.
2. **execute** — `src/ui/dashboard/lib/run-plan.ts` runs the steps sequentially:
   resolve `{$ref}` against accumulated results, pace third-party hosts
   (≥300 ms between reads), dispatch through the adapter's own `execute`, emit a
   `StepEvent` per transition for the live log, and **stop at the first failure**
   (no silent retry). `results` can seed a "retry from failed step". Poster
   **bytes** upload imperatively (chunked, bounded status poll) outside the JSON
   plan; the editor surfaces that as its own run-log step. Every run is wrapped
   by an [unload guard](#unload-guard).

`computeLoss(core, caps)` (`src/core/capabilities.ts`) produces the per-target
**loss report** (dropped / approximated / required) the Review tab shows — see
the [capability matrix](platforms/capabilities.md).

## Local stores (`storage.local`, no separate database upload)

| Key | Module | What |
|---|---|---|
| `settings` | `runtime/settings.ts` | preferences, sync defaults, the experimental rave.page toggle + instance |
| `links` | `runtime/link-store.ts` | cross-platform **event** links (+ per-link sync settings + baselines) |
| `clubLinks` | `runtime/club-links.ts` | cross-platform **club** links |
| `dismissedSuggestions` | `runtime/dismissals.ts` | "not the same event" dismissals |
| `jobs` | `runtime/jobs.ts` | the local job log (create/edit/transfer/delete/poster/sync) |
| `ravepage.auth` | `adapters/ravepage/token-store.ts` | the rave.page token (only if connected) |

Event grouping is pure and node-tested (`ui/lib/club-anchors.ts`,
`ui/lib/event-match.ts`): one logical row per event across platforms, with
"probably the same event" suggestions under a shared club anchor. See
[privacy.md](privacy.md) for exactly what each key holds.

## Sync model

Pure planner `src/ui/lib/sync-plan.ts` (core + platform-meta only):
`projectScoped` reduces a core to just the opted-in fields (details / lineup /
poster / publish state), canonicalizes them, and hashes; `planSync` compares
each linked copy's current scoped hash against its baseline and returns a state
— `off` / `in-sync` / `pending` (one changed = source) / `conflict` (>1 drifted;
**never auto-applied**) / `pick-source`. The webext-bound engine
`src/ui/dashboard/lib/sync.ts` reads each ref (paced), assesses, and — in apply
mode — writes only the non-conflicting targets, merging so a field the source
can't represent never wipes the target's value. Sync runs **only** on the Events
view (load / Refresh / after a local edit), **never** on a timer or in the
background. A public-publish confirmation can be remembered per link; opted-in
automatic writes are not individually previewed. Stored identifiers and the
rave.page access token are used in platform requests; local storage does not mean
zero transmission. See [privacy.md](privacy.md).

## Unload guard

`src/ui/dashboard/lib/unload-guard.ts` ref-counts in-flight runs and installs a
single `beforeunload` prompt while any write (plan run or poster upload) is
active, so closing the tab mid-run warns instead of silently abandoning it.

## Core: gigs / ics / discord

Three pure `src/core` modules (schema + time only; never ui) back two features.
`gigs.ts` matches the user's DJ names to lineups (`normalizeName`/`matchLineupNames`),
then dedupes/sorts/cross-platform-groups `Gig[]` into `GigGroup[]` (same-title-in-
window or close-club fuzzy join; never two of one platform). `ics.ts` builds an
RFC 5545 calendar (set/event mode, CRLF, 75-octet folding, TEXT escaping) for "My
gigs" export. `discord.ts` renders template announcements with `<t:unix:STYLE>`
timestamps, markdown escaping (`!raw` opt-out, URLs kept) and three built-in
presets. Public share links: `platform-meta.ts` `PUBLIC_EVENT_URL` (third-party,
static) + `platform-urls.ts` `publicEventUrl` (rave.page instance). Adapters build
the inputs; views consume these exports.

## My gigs data sources

Each adapter's `listGigs(names, {now})` returns raw per-platform `Gig[]` (deduped
per event id, upcoming only); the UI groups/sorts across platforms. `names` empty
→ `[]` with no I/O. Per platform: **vrctl** scans the admin grid and reads each
upcoming own-club event's detail form, matching the lineup. **vrcpop** reads the
user's public performer profile(s) `/u/<slug>` (own + matched search slugs, ≤5),
plus an own-events lineup complement. **ravepage** combines bookings received for
the user's matched performer profiles with an own-events lineup complement.
Third-party detail reads are capped at `MAX_EVENT_READS` (25) per platform per
call and paced ≥300 ms apart (vrctl/vrcpop); rave.page is our own API, no pacing.

## Build & manifests

esbuild produces four IIFE bundles (background / agent / popup / dashboard);
Tailwind compiles the kit + app CSS. `tools/assemble.mjs` deep-merges
`manifest/base.json` with a per-browser overlay and stamps the version from
`package.json`, then writes `dist/chrome` and `dist/firefox`. MV3 in both
browsers; host permissions cover only the three platforms (+ an optional grant
for a custom rave.page instance).
