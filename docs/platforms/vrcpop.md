# vrcpop adapter

vrcpop.com (`src/adapters/vrcpop/`). JSON action API + server-rendered manage
pages. All HTTP runs through the agent `http` op inside the user's own vrcpop tab
(cookies + CSRF); HTML parsing happens in the dashboard (DOMParser). No raw HTTP
client in the adapter (a unit test greps for it).

## Own-surfaces only (user-agency rule)

Reads and writes touch only the pages/APIs the logged-in user manages. Every
request goes through `request(routeId, params)` against an allowlist
(`routes.ts`); anything else is refused. Write/edit routes take **branded** ids
(`OwnGroupRef`/`OwnEventRef`) that can only be minted by parsing the user's own
manage listings — a raw user-typed id can't reach a write.

### Reads

| Route | Path | Parsed to |
|---|---|---|
| dashboard | `GET /dashboard` | `<meta csrf-token>` + `.club-card` → `{groupId (grp_…), name}` |
| eventsList | `GET /manage/club/<grp>/events` | `.event-card` (+ `.event-card--draft[data-draft-id]`), `window.MANAGE_DATA` |
| editPage | `GET /manage/club/<grp>/events/<id>/edit` | `#event-wizard-container[data-event]` JSON (+ `data-event-id/-group-id/-club-scene-type/-default-hosts`) → `fromVrcpop`; `version` kept in `extras.vrcpop` |
| lineup | `GET /api/event-lineup.php?event_id=` | richer slot detail (prefers `*_timestamp_utc`) |
| genres / energy | `GET /api/dj/?action=genres\|energy` | vocab `{id,name}` |
| performerSearchAll | `GET /api/dj/?action=search-all&q=&type=dj` | performer hits (`slug` when present) |
| performerProfile | `GET /u/<slug>` | public profile → upcoming sets (`ProfileSet[]`): hero + `.dj-set-row`s |

`action=search` returns HTTP 400 "Unknown action" (recon) — `resolvePerformer`
uses `search-all`. `performerSearch` (`action=search`) stays on the allowlist for
completeness but is not the primary path.

### Performer profile (My gigs)

`listGigs(names)` finds the user's upcoming appearances. Own performer slugs come
from the dashboard (`<a href="/manage/performer/<slug>">`), plus `search-all`
hits whose name matches and each name's `slugifyName` candidate — union capped at
5 slugs (own first). Each `/u/<slug>` page (branded `PerformerSlugRef`;
`/dj/<slug>` redirects here) is read **once per slug per manual refresh** — user
agency, no crawling; the page is public and self-asserted (the user's OWN
profile). The **`upcoming_sets`** section renders only with a future set: parse
its `.dj-next-hero[data-utc]` (title/club/href; end derived from the clock range
via `parseVrcpopTimeRange`) plus every `.dj-set-row` outside `upcoming_nights`
(RSVPs, ignored) whose `data-end`/`data-start` ≥ now; dedupe by event id, hero
winning. A complement scans own clubs' upcoming events and matches the lineup
(`matchLineupNames`), capped at `MAX_EVENT_READS` (25) detail reads, paced ≥300 ms
apart. A 404 slug is skipped. Public event link: `https://vrcpop.com/event/<id>`.

### Writes (JSON; header `X-CSRF-Token`)

CSRF comes from the `<meta name="csrf-token">` of a **freshly fetched** manage
page (`runPlan` reads `/dashboard` before writing). Human-scale: `execute`
awaits a ≥300 ms gap before each write (injectable for tests).

| Route | Path | Body |
|---|---|---|
| create | `POST /api/events/?action=create` | `toVrcpop` payload, `status:'draft'` unless publish |
| update | `POST /api/events/?action=update` | payload + `event_id` + `version` (re-read immediately before) |
| delete | `POST /api/events/?action=delete` | `{event_id}` (soft, 30-day undo) |
| flyerUpload | `POST /api/events/upload-flyer.php` | multipart `flyer`,`group_id`,`event_id` (bytes via the blob slice protocol) → `{success,flyer_url}` then `flyer_url` into an update |
| flyerRemove | `DELETE /api/events/upload-flyer.php` | `{group_id,event_id}` |

Refused (not on the allowlist): public `/event/<id>`, `/club/<other>`,
`action=list|bulk-publish|duplicate|collab-*`, wrong-method variants.

## Draft status caveat

`caps.draft = 'expected-unverified'` (`capabilities.ts`). Drafts are almost
certainly real (draft cards `.event-card--draft`, `action=bulk-publish`, and the
site's own "Import from Discord" flow POSTs `status:"draft"` to `action=create`),
but the **user rule forbids creating/deleting test events on vrcpop**, so we do
not probe it. The UI keeps events as drafts by default; publish is a separate
explicit toggle with a red "PUBLIC immediately" confirm. The user's first real
use confirms draft acceptance; a rejected draft maps to `VALIDATION`.

## Version lock (optimistic concurrency)

`update` carries the `version` read from the edit page immediately before the
write. `planUpdate`/`planPoster` re-read it as their first step (`editPage` →
`{version}`, referenced by the update body). A wrong version → server 500
"Concurrent edit detected" → `VERSION_CONFLICT`; the UI re-reads and retries.

## Flyer path

`planPoster(set)` = re-read version → `flyerUpload` (multipart) → `update` with
the returned `flyer_url`. Remove = single `DELETE upload-flyer.php`. External
`flyer_url` (not via upload) is untested → upload is primary.

## Error mapping (`http-result.ts`)

| Condition | Code |
|---|---|
| 401 / followed redirect to a login/OAuth/home URL | `NOT_LOGGED_IN` |
| 403 | `NOT_AUTHORIZED` |
| 404 | `NOT_FOUND` |
| 429 | `RATE_LIMITED` |
| 500 body "Concurrent edit detected" | `VERSION_CONFLICT` |
| JSON `{success:false,error}` | `VALIDATION` (keeps `error`) |
| non-JSON / missing marker | `PARSE` (names the missing marker) |

## Dev panel + wiring

`src/ui/dashboard/dev/VrcpopDevPanel.tsx`, wired into the dashboard hash router
at `#/dev/vrcpop` (`App.tsx`). Buttons: My clubs, Events, Read event, Preview
create draft (shows the exact JSON), Run create draft, Set flyer (file picker),
Delete. Drives the native adapter via the `withAgent` transport; exercised
against mocks in `e2e/tests/vrcpop-adapter.spec.ts` (panel flow) and, later,
read-only by the lead.

## PlatformAdapter binding

The native `vrcpopAdapter` (`adapter.ts`) threads a `VrcpopAgent` through every
method (unit-testable without the webext shim). `src/adapters/vrcpop/platform.ts`
binds the agent via `withAgent` and exposes `vrcpopAdapter: PlatformAdapter`,
mapping vrcpop types → shared `ConnectionStatus`/`OwnClub`/`OwnEvent`/`PlanResult`.
The registry imports it from `./platform` (never `./index`, which stays pure so
unit tests avoid the chrome shim). Impedance bridges: the sync `plan*` builders
mint own-surface brands from the opts ids (`ownGroupRef`/`ownEventRef`);
`readEvent`/`setPoster`/`removePoster` locate the owning club by scanning the
user's own clubs/events; poster set/remove ride `setPoster`/`removePoster`
(imperative), so `planPoster` reports loss only. The shared
`PlatformCapabilities.draft` was widened to a tri-state (`DraftSupport`) so
vrcpop's `expected-unverified` fits `caps` while rave.page/vrc.tl keep `true`.
