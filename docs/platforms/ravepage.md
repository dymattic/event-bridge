# rave.page adapter

rave.page (`src/adapters/ravepage/`), development API only during dev. Unlike
vrcpop/vrc.tl this is our **own** REST API: the adapter is **agentless** — it
calls the generated client directly from the dashboard (a Bearer token, no page
tab). API base is one constant `API_BASE = 'https://development.api.rave.page'`
(`client.ts`), which configures the generated `OpenAPI` (`BASE`, a Bearer `TOKEN`
resolver reading the token store, `WITH_CREDENTIALS false`).

Generated calls go only through the `ROUTES` allowlist (`routes.ts`); a unit test
greps the adapter sources for raw `fetch(` and allows exactly one — the chunk PUT
in `upload.ts`, marked `raw-fetch-allowed:` (the generated `MediaUploadService`
can't express its no-body + `X-Chunk-Checksum` shape).

## Auth (grant/exchange — never SPA tokens)

`connect()` opens `https://development.rave.page/desktop/bridge?target=extension`
active and runs the agent `grantAwait` handshake (page `rave-page:bridge-ready` →
agent `event-bridge:hello` → page `rave-page:desktop-grant {code, api}`), then
`POST /auth/exchange {code}` → `{token, refresh}`. The `refresh` is **discarded**
(`/auth/refresh` is 410 → renewal = a user re-connect). The 30-day JWT + identity
(`GET /auth/me`) live in `storage.local` under `ravepage.auth`
(`token-store.ts`). `session()` derives status from the store (no tab);
`needsReconnect()` fires < 3 days before expiry; any 401 clears the token so the
UI offers Reconnect.

## Routes / methods used (`ROUTES` allowlist)

| Concern | Generated method | HTTP |
|---|---|---|
| auth | `exchangeDesktopGrant`, `getCurrentUserInfo` | `POST /auth/exchange`, `GET /auth/me` |
| discovery | `getMyGroups`, `listEventOrganizers`, `listEvents` | `GET /groups/mine`, `/events/organizers`, `/events` |
| event read | `getEvent`, `listEventSlots`, `listEventPerformers` | `GET /events/{id}`, `/events/{id}/slots`, `/events/{id}/performers` |
| event write | `createEvent`, `updateEvent`, `deleteEvent` | `POST`/`PUT`/`DELETE /events[/{id}]` |
| slots | `createEventSlot`, `updateEventSlot`, `deleteEventSlot` | `POST`/`PUT`/`DELETE /events/{id}/slots[/{slotId}]` |
| performers | `addEventPerformer`, `removeEventPerformerDelete`, `listPerformers` | `POST`/`DELETE /events/{id}/performers`, `GET /performers` |
| poster | `assignEventPoster`, `deleteEventPoster` | `PATCH`/`DELETE /events/{id}/poster` |
| genres | `listGenres`, `setEntityManualGenres` | `GET /taxonomy/genres`, `PUT /taxonomy/{entity_type}/{entity_id}/genres` |
| media upload | `initiateUpload`, `completeUpload`, `getUploadStatus` (+ raw chunk PUT) | chunked media-upload |

Own-surfaces only: discovery uses `getMyGroups` (filtered to
`can_organize_events`) + `listEventOrganizers`; there is no public-listing route.

## Plan / execute

Writes are pure `planCreate/Update/Delete/Poster` builders returning
`PlannedStep[]` whose slot/performer bodies reference just-created ids via
`{$ref}` placeholders; a sequential `runPlan` resolves them (rave.page is our own
API — no inter-write spacing). A create plan is event → slots → performers
(each `slot_id` = `{$ref slotN.id}`; B2B = several performers on one slot) →
genres. Update reconciles slots by `slot_number` (patch/create/delete) and
replaces performers. `planUpdate` strips organizer mutation (a slug/organizer
change is 501).

### Genres (organizer-facing)

`setEntityManualGenres` — `PUT /taxonomy/{entity_type}/{entity_id}/genres`, body
`{genre_slugs}` — **replaces** this caller's `source='manual'` genre assignments
at confidence 1.0 (unknown slugs are dropped + returned in `unknown_slugs`). Slugs
resolve from `GET /taxonomy/genres` (`loadVocab` → `{id,name,slug}`); `toRavepage`
maps core genre names → slugs via the `genreVocab`. The admin-only POST
`/taxonomy/entities/event/{id}/genres` is deliberately **not** used (403 for a
non-admin event owner).

## Vocab mapping (live-spec vocabularies)

`toRavepage`/`fromRavepage` constrain free-form core values to the spec's
`EventOut` enums (each mapping carries a `// spec:` comment citing the field):

| Core | rave.page field | Spec vocabulary | Mapping |
|---|---|---|---|
| `flags.platforms` | `platforms` | tags `pc`, `quest`, … | `windows→pc`, `android→quest`; `ios` → `LossReport.dropped` (no tag) |
| `flags.ageGated` | `age_gate` | `all_ages \| 18_plus \| 21_plus` | `true→18_plus`; unset ⇒ omitted (all_ages) |
| `music.sceneType` | `scene_type` | `club \| festival \| rave \| concert \| showcase` | normalized; unmappable → dropped |
| `music.energy` | `energy_level` | `chill \| medium \| high \| extreme` | normalized (e.g. "High Energy"→`high`); unmappable → dropped |

`fromRavepage` mirrors: `pc→windows`, `quest→android`, and `age_gate` other than
`all_ages` (or empty) ⇒ `ageGated`.

## My gigs

`listGigs(names)` combines two sources. **Bookings received**: for each of the
user's own performer profiles (`listMyPerformers`) whose name matches, list
`listReceivedBookings({performerId, isActive:true})` and emit a `Gig` per booking
(`declined`/`cancelled` dropped; `accepted`→`confirmed`, else `pending`).
**Own events** (complement): scan own clubs' upcoming events (start ≥ now or
missing, capped at `MAX_EVENT_READS` = 25) and emit a `Gig` when
`listEventPerformers` names one of `names` or a matched performer id. Results are
deduped per event id (a booking wins over the same event's own-event row) and
filtered to upcoming. rave.page is our own API, so no pacing. Event links use the
configured instance `appOrigin`: `${appOrigin}/events/<id>`.

## Poster pipeline

URL posters ride the event body (`cover_image_url`); a platform ref uses
`assignEventPoster` (`media_upload_id`). **Bytes** upload imperatively
(`setPoster`, not a JSON step): chunked `media-upload` (resume from
`uploaded_chunk_numbers`, poll `pipeline_status` to `ready`) then
`PATCH /events/{id}/poster`. `removePoster` = `DELETE /events/{id}/poster`.

## Error mapping (`client.ts` `toBridgeError`)

| Condition | Code |
|---|---|
| 401 (also clears the stored token) | `NOT_LOGGED_IN` |
| 403 | `NOT_AUTHORIZED` |
| 404 | `NOT_FOUND` |
| 400 / 409 / 422 | `VALIDATION` |
| 429 | `RATE_LIMITED` |
| 5xx / other `ApiError` | `NETWORK` |
| `CancelError` | `CANCELLED` |
| fetch `TypeError` | `NETWORK` |

## Dev panel

The rave.page dev route (`#/dev/ravepage`, `RavepageDevPanel` in `App.tsx`):
Connect / Disconnect, status, Who am I, My groups, Create test draft (draft +
unlisted + `is_public:false`, one slot, one performer), Delete it. rave.page
**development**
may be exercised with draft/unlisted events, cleaned up afterwards (repo rule: no
test events on vrc.tl/vrcpop).
