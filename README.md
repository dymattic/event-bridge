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

- **Your clubs & events, resolved.** Each connected platform lists your own
  clubs/groups by name and your events in a searchable, filterable table
  (platform, title, local start, club, status, visibility).
- **Search & filter.** Filter by platform, club, status and time
  (upcoming / past / all + date range); search title or club. Filters live in
  the URL, so a filtered view is a shareable link.
- **Event detail.** A read-only view of one event with the resolved lineup
  (performer names, B2B, VJ/dancers/hosts), poster, flags, genres and links.
- **Delete, safely.** Row and detail delete with a confirmation that shows the
  exact request first and names the platform for public events.

In progress: create, edit, the lineup editor, cross-platform transfer, and sync.

## Independent project

event-bridge is an independent, open-source tool (WTFPL). It is **not affiliated
with, endorsed by, or a product of** vrc.tl, vrcpop.com or rave.page — the three
are equal integrations, and no platform account is a prerequisite: connect only
the platforms you use. It's built with rave.page's open design-system kit
[`@rave-page/ui`](https://rave.page) (MIT) and shares that look by design.

Status: pre-alpha, under construction.

## License

[WTFPL](LICENSE).
