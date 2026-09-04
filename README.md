# event-bridge

Browser extension (Chrome/Firefox) to create, manage, and migrate VRChat scene
events across [vrc.tl](https://vrc.tl), [vrcpop.com](https://vrcpop.com) and
[rave.page](https://rave.page).

event-bridge doesn't scrape or crawl - it acts as **you**, in **your** browser,
with **your** logged-in session, performing the same actions you'd do by hand:
enter an event once, post it to the platforms you choose, keep the copies in
sync, migrate lineups between them.

## Features

Once you're signed in on a platform, event-bridge shows your real data — clubs
and events by name, never raw ids.

- **One row per event, across platforms.** Your events show as a single table
  with a cell per platform — the copy's status where it exists, a one-click
  **Transfer** where it doesn't. Your clubs/groups are listed by name, never raw ids.
- **Link clubs & events across platforms.** The **Clubs** view links the same
  club on vrc.tl, vrcpop.com and rave.page (clubs sharing a VRChat group link
  automatically). event-bridge then suggests "probably the same event" for
  look-alike copies under a linked club — one click to join them into a row, or
  dismiss it.
- **Search & filter.** Filter by platform, club, status, time
  (upcoming / past / all + date range) and "missing on a platform"; search title
  or club. Filters live in the URL, so a filtered view is a shareable link.
  **Past events are out of scope by default** — the upcoming view hides them (and
  a long-past event that a platform still marks "scheduled" reads as *ended*);
  switch the time filter to *past* or *all* to work with them.
- **Event detail.** A read-only view of one event with the resolved lineup
  (performer names, B2B, VJ/dancers/hosts), poster, flags, genres and links.
- **Create and edit events.** Enter an event once — title, start time, lineup (drag-
  and-drop slots with searchable performers), flags, genres, links and poster — and
  post it to the platforms you tick, each with its own club. Only the start time is
  required; the end follows the lineup (or a default event length you set). Before anything is
  sent, a per-platform review shows what maps cleanly, what's dropped or
  approximated, what a platform requires (e.g. vrc.tl's NSFW/SFW), and the exact
  request; publishing stays off unless you turn it on (vrcpop asks first). Editing
  an event can also transfer it to more platforms at once. Runs stop at the first
  error with a retry, and never publish on your behalf. **Transfers resolve
  performers** — a transfer to vrc.tl (which needs known performer ids) searches
  and adopts each DJ's real id, so the copy carries ids, not just names.
- **Auto-sync linked copies.** For a linked event you can keep its copies in step
  while the dashboard is open — on **notify** it shows what drifted; on **apply**
  it writes the non-conflicting changes for you. Sync runs only on the Events view
  (load / Refresh / after a local edit), never on a timer or in the background.
  You choose the source (last-edited or a fixed platform) and which fields sync
  (details, lineup, poster, publish state). **Conflicts are never applied
  automatically** — a field edited on both sides waits for your per-field pick —
  and **publish state is off by default**, with a red confirm before anything goes
  public. Set defaults under **Settings → Sync defaults**.
- **Delete, safely.** Row and detail delete with a confirmation that shows the
  exact request first and names the platform for public events.
- **Job log.** Every run — create, edit, transfer, delete, sync — is recorded
  under **Jobs**: what, when, status, and the exact request per step (never your
  tokens). Stored locally; clear it anytime.

## Privacy

event-bridge keeps everything in your browser's own extension storage — your
cross-platform event links, club links and dismissed suggestions never leave your
machine. See [docs/privacy.md](docs/privacy.md).

## Experimental: rave.page integration

The rave.page integration is an **experimental feature, off by default**. vrc.tl
and vrcpop.com work fully without it; nothing about event-bridge requires
rave.page. Turn it on under **Settings → Experimental** and rave.page joins as a
third equal integration.

Because rave.page is being made open-source and federated, its **instance is
configurable**: point event-bridge at any self-hosted or federated rave.page by
setting the app origin (default `https://development.rave.page`) and API origin
(default `https://development.api.rave.page`) in Settings. A custom instance
needs a one-time host-permission grant (your browser prompts on Save). Changing
the instance disconnects the current session — the stored token is
instance-scoped, so reconnect to continue.

## Independent project

event-bridge is an independent, open-source tool (WTFPL). It is **not affiliated
with, endorsed by, or a product of** vrc.tl, vrcpop.com or rave.page — the three
are equal integrations, and no platform account is a prerequisite: connect only
the platforms you use. It's built with rave.page's open design-system kit
[`@rave-page/ui`](https://rave.page) (MIT) and shares that look by design.

Status: pre-alpha, under construction.

## License

[WTFPL](LICENSE).
