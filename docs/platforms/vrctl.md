# vrc.tl adapter

Nette (PHP) server-rendered admin. No API, no CSRF token — session cookie only.
All HTTP runs through the agent `http` op **inside the user's vrc.tl tab**
(same-site `_nss` cookie requires in-tab requests); parsing runs in the dashboard
with `DOMParser`. No `fetch(` in `src/adapters/vrctl/**`.

## Own surfaces only

Reads only what the user manages; there is deliberately **no route** for public
listings (`/event/*`, `/api/v1/*`) or the `timetable` / `vrChatEventCreate` grid
actions. Write ids are branded (`ids.ts`) — they can only come from a parsed
own-surface listing, never raw input.

| Route id | Method | Path | Kind |
|---|---|---|---|
| `chooseOrganizer` | GET | `/admin/event/choose-organizer` | read |
| `chooseCategory` | GET | `/admin/event/choose-category?organizerId=<id>` | read |
| `grid` | GET | `/admin/event` | read |
| `detail` | GET | `/admin/event/detail/<id>` | read |
| `performerSearch` | GET | `/admin/ajax/performer?term=&_type=query&q=` | read |
| `organizerSearch` | GET | `/admin/ajax/organizer?term=&_type=query&q=` | read |
| `create` | POST | `/admin/event/create?categoryId=<id>&organizerId=<id>[&promoted=0]` | write |
| `detailSubmit` | POST | `/admin/event/detail/<id>` (multipart) | write |
| `delete` | GET | `/admin/event?grid-grid-__id=<id>&grid-grid-__key=delete&do=grid-grid-actionCallback` | write |

`request(send, routeId, params)` is the only entry; `buildRequest` validates every
id (`^\d+$`) and refuses any grid action key other than `delete`.

## Flows

- **Reads**: `chooseOrganizer` → own clubs `{organizerId, name}` (the grp_ id is
  NOT on this surface — it appears in the detail form's *how to join* label);
  `chooseCategory` → `{categoryId, name, promoted, createPath}` (promoted =
  absence of `promoted=0`); `grid` → rows `{id, name, start, organizer, promoted}`
  + a `delete` action **only** for manageable rows; `detail` →
  `parseDetailForm(html) → VrctlDetailForm` (organizers, timezone, howToJoin,
  flag categories `flags[1..6]` with option ids/labels/input-type, slot blocks
  `slots[<id>][…]`, poster, published/showSlots) → `fromVrctl`; `performerSearch`
  → `{id, text}[]`.
- **create**: `POST create` (urlencoded: `name, start, timezone, slots, duration,
  _submit, _do`) → 303 → detail. The new id is read from the `Location` header if
  present, else from `finalUrl` (see redirect note). Then `GET detail` →
  `parseDetailForm` → `POST detail` (multipart, from `buildVrctlDetailFields`) →
  re-`GET detail` → slot ids into `extras.vrctl`.
- **update**: detail GET → POST → GET.
- **delete**: the grid `delete` action (GET), success = lands back on the grid.
- ≥300 ms between consecutive writes (injectable `writeDelayMs`; `runPlan`).

## Semantics

- **promoted** (public to all) vs **not promoted** (followers only) is fixed at
  create via the `choose-category` URL; not changeable afterwards. Default =
  not promoted.
- **published** = the "Publish to Timeline" checkbox; the `published` field is
  emitted **only** when publishing (draft by default).
- **NSFW/SFW** (`flags[1]`) is **required** — `assertWritable`/`planCreate` throw
  `VALIDATION` before any request when `flags.nsfw` is unset.
- **slot ids** are server-assigned at create and read back from the re-fetched
  detail form.
- Tag option ids (`flags[1..6]`) and timezone/howToJoin values are **scraped at
  runtime**, never hardcoded.

## Redirect handling (important)

An in-tab `fetch(..., {redirect:'manual'})` yields an **opaqueredirect** response
(status 0, no readable `Location`, empty `finalUrl`). So create/delete use
`redirect:'follow'` and recover the target from `finalUrl` (create id parsed from
`/admin/event/detail/<id>`; delete success = back on `/admin/event`). The
`Location` header is still read first when a transport exposes it (mocks/tests).

## Error mapping

- Bounced outside `/admin/` after a followed request → `NOT_LOGGED_IN`
  (`isSignInRedirect`).
- Nette/Bootstrap validation markers in the returned HTML → `VALIDATION`
  (`detectNetteError`): `.alert-danger`, `.invalid-feedback`, `ul.error li`,
  `[data-nette-error]`. `.text-danger` is deliberately NOT matched (decorative in
  the success form). **Open item**: the exact server-side error markers were not
  in a captured error render — confirm on a real validation bounce (read-only).
- Bad/absent id or `< 400 ...` → `NOT_FOUND` / `PARSE` as appropriate.

## PlatformAdapter wiring

`src/adapters/vrctl/platform.ts` exports `vrctlAdapter: PlatformAdapter` (binds
the agent transport via `withAgent`, delegates to the pure planner). A create plan
is two `PlannedStep`s — `vrctl.create` (urlencoded → `{id}`) then
`vrctl.detailFinalize` (scrape live form → multipart detail POST → read slot ids)
— because the multipart body can't be precomputed. Poster **bytes** ride
`setPoster` (imperative), like rave.page. The lead registers it in
`registry.ts` (`ADAPTERS.vrctl = vrctlAdapter`). The pure modules
(`parse/forms/routes/planner/ids/adapter`) are node/happy-dom importable and are
where the tests live.
