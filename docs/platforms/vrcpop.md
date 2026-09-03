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
| performerSearchAll | `GET /api/dj/?action=search-all&q=&type=dj` | performer hits |

`action=search` returns HTTP 400 "Unknown action" (recon) — `resolvePerformer`
uses `search-all`. `performerSearch` (`action=search`) stays on the allowlist for
completeness but is not the primary path.

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

`src/ui/dashboard/dev/VrcpopDevPanel.tsx` (exported, **not** wired — App.tsx is
owned by P3). Buttons: My clubs, Events, Read event, Preview create draft (shows
the exact JSON), Run create draft, Set flyer (file picker), Delete. Drives the
adapter via the P2 `withAgent` transport; used only against mocks in e2e and,
later, read-only by the lead.

Wire it (lead) with one line — hash route in `App.tsx`:

```tsx
import { VrcpopDevPanel } from './dev/VrcpopDevPanel';
// first line of App(): if (location.hash === '#/dev/vrcpop') return <VrcpopDevPanel />;
```

or, without touching App.tsx, in `main.tsx`:

```tsx
import { mountVrcpopDevPanel } from './dev/vrcpop-dev-entry';
// if (location.hash === '#/dev/vrcpop') mountVrcpopDevPanel(el); else createRoot(el).render(<App/>);
```

Once wired, un-skip the panel test in `e2e/tests/vrcpop-adapter.spec.ts`
(it skips itself until the panel renders).

## PlatformAdapter (P3) reconciliation — open for the lead

P3's `src/adapters/types.ts` `PlatformAdapter` is **agentless** (rave.page does
CORS-exempt fetch from the dashboard itself). vrcpop needs the in-tab agent, so
`vrcpopAdapter` threads a `VrcpopAgent` through every method (and stays
unit-testable without the chrome-only webext shim). It matches the plan's
adapter sketch, not P3's concrete interface. To register it, the lead should
either add an agent-binding wrapper (`withAgent('vrcpop', …)` supplied by the
dashboard) that maps vrcpop types → `ConnectionStatus`/`OwnClub`/`OwnEvent`/
`PlanResult`, or evolve `PlatformAdapter` to pass a transport handle.
