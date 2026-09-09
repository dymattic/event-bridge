# Mozilla listing and reviewer notes

Maintainer copy, reviewed 2026-09-09. Public listing:
[event-bridge](https://addons.mozilla.org/en-US/firefox/addon/event-bridge/).
Update AMO fields as well as this file. Do not describe unreleased safeguards as
already present in the version available to users.

## Summary

Manage and sync VRChat scene events across vrc.tl, vrcpop.com and optional rave.page. Uses your platform sessions to read and send event data; no event-bridge account or telemetry.

## Description

event-bridge brings VRChat event management into one browser dashboard. It uses
your platform sessions to read and send event data to vrc.tl, vrcpop.com and,
optionally, a compatible rave.page instance.

- Create, edit, review and transfer events; manage lineups, performers and posters.
- Link copies of the same event or club across platforms.
- Look up My gigs by DJ name and export an ICS calendar. vrc.tl includes a bounded
  public timeline lookup to find gigs at clubs you do not manage: at most 12 pages,
  paced at least 300 ms apart, when opening or refreshing My gigs.
- Prepare announcements for copying. No automatic Discord posting or calendar upload.
- Review editor requests and platform differences before submitting. New events
  default to drafts; publishing requires an explicit choice.
- Sync defaults to Off. Notify assesses changes. Opt-in Apply mode can update linked
  copies on Events load, Refresh or after a local write without previewing each
  write. Conflicts need your choice; publish confirmation can be remembered per link.

Accounts and appropriate event/club permissions are needed on the platforms you
choose; you do not need all three. Sign in on each platform itself, not in
event-bridge. rave.page is experimental and off by default. Its contributor
default is development.rave.page / development.api.rave.page; a compatible HTTPS
instance can be configured, with site-access permission for its app/API origins.

Data transmission: platforms receive relevant account/performer identifiers and
names, club references, event content, lineups, links, posters and authentication
needed for your operations. vrc.tl/vrcpop.com use existing session cookies;
rave.page uses an access token obtained when connecting. Displaying posters and
avatars also contacts their image hosts, which receive normal network request
metadata and may receive cookies under your browser's policy.

Opening the popup/dashboard can check sessions and load data. No scheduled
background sync runs; request pacing and user-initiated upload processing use
timers. Set each existing link to Off to stop its sync. Jobs keeps up to 50 local
runs and request-body previews; clear finished jobs anytime. Disconnecting
rave.page forgets its local token. Uninstalling clears local extension data, not
remote events/accounts.

Free, open source and independent: no event-bridge account, server, telemetry,
analytics, advertisements or paid features. Not affiliated with or endorsed by
vrc.tl, vrcpop.com or rave.page. Pre-alpha; Firefox desktop 142+, Android untested.
Use normal browser windows and a single platform account per browser profile.

## Other public fields

- Experimental: Yes (matches pre-alpha status).
- Requires payment: No (event-bridge has no paid functionality).
- Support: https://github.com/dymattic/event-bridge/issues
- Homepage: https://github.com/dymattic/event-bridge
- Privacy policy: paste the accurate released-version text from [privacy.md](privacy.md).
- License: keep WTFPL; dependency licenses remain applicable separately.
- Screenshots: only sanitized mocked-platform captures under `docs/screenshots/`.

## Private Notes for Reviewers

Keep credentials only in AMO's private Notes for Reviewers, never in version
notes, public listing text, GitHub or the source archive.

event-bridge is independent of vrc.tl and vrcpop.com. Those services do not give
the author a way to provision shareable username/password test accounts. The
author cannot provide credentials for them. Reviewers can use the services'
normal sign-in flows with their own accounts if suitable; organizer features
also need platform-granted club/event permissions. This is an access limitation,
not a claim that those features require no account.

A development.rave.page reviewer account can be provided privately by the author.
It must have an organizer/group and designated disposable draft/unlisted events.
This account tests the rave.page integration, not authentication or live behavior
on vrc.tl/vrcpop.com. Mozilla may request another review arrangement for them.

Reproduction and non-live tests:

1. Use the matching `event-bridge-source-VERSION.zip` from the GitHub release,
   not GitHub's generic source archive. See [reviewer build](development.md#mozilla-reviewer-build).
2. Node 24.20.0 LTS, pnpm 10.33.0; `pnpm install --frozen-lockfile`, `pnpm build`.
3. `pnpm test`; `pnpm exec playwright install chromium`; `pnpm e2e`.
   Browser tests use local fixtures for all three platforms, not real accounts.
   Mocked Chromium tests do not replace Firefox or live-platform review.
4. Firefox: open the dashboard, enable Settings > Experimental > rave.page,
   retain the development app/API origins and Connect; sign in using the privately
   supplied development account. Review own clubs/events, edit a designated draft,
   test transfer/sync in mocks, inspect Jobs and Disconnect.
5. Do not create/delete test events on vrc.tl/vrcpop.com. Request coordination
   for any live write; keep normal review there read-only.

Four innerHTML warnings come from the unmodified official react-dom 19.2.8
implementation, bundled into popup/dashboard. Application and vendored kit do
not call `dangerouslySetInnerHTML`; external text uses React children/text.
Exact hash and source guards: [mozilla-compliance.md](mozilla-compliance.md).

Outstanding before claiming a complete submission: verify the corrected manifest
and notices in the uploaded version; on the signed build, test Firefox
install/update consent and refusal, private-window exclusion and Disconnect;
and provide actual development-account credentials privately. Validation,
Chromium mocks and GitHub signatures are not Mozilla approval or add-on signing.
