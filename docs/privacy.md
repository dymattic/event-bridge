# Privacy

event-bridge acts as **you**, in **your** browser, with **your** logged-in
sessions. It doesn't scrape, crawl, poll third-party sites in the background, or
send your data anywhere.

## What it stores, and where

Everything lives in the browser's **extension storage** (`storage.local`) on your
machine. Nothing is uploaded to event-bridge; there is no event-bridge server.

| Key | What it is |
|---|---|
| `settings` | Your preferences (test prefix, the experimental rave.page toggle + instance). |
| `links` | Cross-platform **event** links — which per-platform copies are the same event. |
| `clubLinks` | Cross-platform **club** links — which per-platform clubs are the same club. |
| `dismissedSuggestions` | "Not the same event" dismissals (suggestion keys). |
| `jobs` | A local log of the last runs (create/edit/transfer/delete/sync). |
| `ravepage.auth` | The rave.page access token (only if you connect rave.page). |

Event/club links, dismissals, the job log and settings are computed and kept
**locally** — they are your own annotations and never leave the browser.
Uninstalling the extension (or clearing its storage) removes them.

Per-link **sync settings** and the last-synced baseline hashes live inside `links`;
they too stay on your machine. Sync runs only while the dashboard is open — never
in the background — and never publishes without a confirmation.

The **job log** keeps, per step, the *exact request event-bridge sent* (so you can
audit what it did) — but only the request body, **never** session tokens, cookies
or CSRF values (those are added by your browser at send time and are never
recorded). It's capped to the most recent runs; **Clear finished** on the Jobs
view empties it.

## Network

The only requests event-bridge makes are the same-origin actions you trigger,
against the platform you're already signed in to (create/edit/read your own events
and clubs). No analytics, no telemetry, no third-party calls.
