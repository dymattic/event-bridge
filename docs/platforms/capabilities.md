# Platform capability matrix

What each platform can represent, derived from `src/core/capabilities.ts` (the
`CAPS` table). The mapping layer reads this table to compute a **loss report**
per target — what a platform can't hold is dropped or approximated, and what it
requires but the event lacks is flagged before any write. Keep this table in
step with `CAPS` (a unit test asserts every capability row is documented).

Legend: **Yes** / **No** / **required** / **optional**.

| Capability | vrc.tl | vrcpop.com | rave.page |
|---|---|---|---|
| Draft (real unpublished state) | Yes | Yes | Yes |
| Performer ids | required | optional | optional |
| VJ slot | No | Yes | No |
| Dancers | No | Yes | No |
| Hosts | No | Yes | No |
| Per-slot genre | No | Yes | No |
| Per-slot energy | No | Yes | No |
| B2B (multiple performers per slot) | Yes | Yes | Yes |
| Slot gaps (non-contiguous lineup) | No | Yes | Yes |
| Poster by URL | Yes | No | Yes |
| Poster by upload | Yes | Yes | Yes |
| Flag: NSFW | Yes | No | Yes |
| Flag: age-gated | Yes | No | Yes |
| Flag: open decks | Yes | Yes | Yes |
| Flag: platforms (PC/Quest) | Yes | No | Yes |
| Flag: Quest compatible | No | Yes | No |
| Flag: photosensitivity | Yes | No | No |
| Flag: avatar restrictions | Yes | No | No |
| Required fields | `flags.nsfw` | — | — |

## Notes per platform

- **vrc.tl** — Nette forms. **Performer ids are required**: a lineup performer
  with only a free-text name is a `required` loss item until you resolve it via
  the platform's performer search (the editor's resolver does this). **NSFW/SFW
  is required** at create. Slots are **contiguous durations** — gaps between
  slots are removed. Poster by URL or upload.
- **vrcpop.com** — JSON wizard. Richest lineup model: VJ, dancers, hosts,
  per-slot genre + energy. No per-event NSFW/age flag (those are tag-based, so
  they're unsupported here). Poster by upload only (external flyer URL untested,
  so URL is treated as unsupported).
- **rave.page** — REST API. Performers only (no VJ/dancers/hosts split);
  `genre_tags` live on the performer and `energy_level` is event-level, so
  per-slot genre/energy are not representable. Poster by URL or chunked upload.
  Age/NSFW via `age_gate` + content flags; platforms array; open decks.

## Publish semantics

- **vrc.tl** — two independent axes. **Promoted** (public to everyone) vs **not
  promoted** (followers only) is fixed at create via the choose-category URL and
  can't be changed later; default is *not promoted*. **Published** is the
  "Publish to Timeline" checkbox — emitted **only** when publishing, so events
  are **draft by default**.
- **vrcpop.com** — draft by default; turning publish on is an explicit switch
  that shows a red "publishes PUBLICLY" confirm before the write.
- **rave.page** — `visibility.publish` + audience (`unlisted`/etc.); draft +
  unlisted by default; a public flip needs the red confirm.

Publishing is an explicit per-target choice, off by default, gated by a confirm.
For opted-in publish-state sync, confirmation can be remembered per link;
automatic Apply mode does not ask again for every write.
