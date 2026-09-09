# Privacy

Updated 2026-09-09. event-bridge runs in your browser, with no event-bridge
server or account. It does transmit data to the platforms you use and to image
hosts. It has no analytics, telemetry, advertising, affiliate redirects or paid
features. Platform operators have their own privacy practices.

## Data sent and recipients

| Recipient | Data and purpose |
|---|---|
| vrc.tl and vrcpop.com | Authenticated reads and event-management requests using your existing site session. Relevant account/performer IDs and names, club/group references, event titles/descriptions/times, lineups, flags, links and posters are read or sent as needed. The browser supplies same-origin cookies; adapters supply required anti-forgery values. |
| Configured rave.page app/API | Optional integration, off by default. Connecting uses a platform authorization grant, exchanged for an access token. The token authenticates account, club and event requests to the configured API. The default instance is development.rave.page with development.api.rave.page. |
| Poster/avatar hosts | Displaying remote images contacts the image URL's host, including third-party hosts. Poster sync can download an image and upload its bytes to a target platform. Hosts receive ordinary network metadata, including IP address and browser request headers; image requests may carry host cookies subject to browser policy. |

Transferring or syncing sends selected source event content to the target
platform. Only transmit content you have permission to share. There is no
separate developer-operated collection endpoint. This is not a promise that
platform or image-host servers receive no data.

Opening the popup/dashboard can check sessions and load platform data. Searches
send performer lookup terms to the relevant platform. My gigs also reads the
vrc.tl public timeline to find gigs at clubs you do not manage: one pass of at
most 12 pages, paced at least 300 ms apart, on page load or Refresh.

Sync defaults to Off. Notify reads and assesses changes; Apply can send updates
on Events load, Refresh or after a local write without an individual preview.
Conflicts require a choice. Public-publish authorization can be remembered per
link. There is no scheduled background sync. Pacing uses timers; a user-initiated
rave.page upload polls processing status for at most 30 seconds.

## Local storage

Data is kept in extension `storage.local`, not browser sync storage:

| Key | Contents |
|---|---|
| `settings` | Preferences, sync defaults, instance configuration, experimental toggle and saved DJ lookup names (`settings.gigs`). |
| `links` | Event references, per-link sync settings, confirmation state and baseline hashes. |
| `clubLinks` | Cross-platform club references. |
| `dismissedSuggestions` | Dismissed event-match suggestions. |
| `announcePresets` | User-created announcement templates. |
| `jobs` | Up to 50 job runs: event labels/references, step status, request-body previews and errors. |
| `ravepage.auth` | Access token, expiry, account ID/label, API origin and acquisition time. Refresh tokens returned by exchange are discarded. |

Transport cookies, bearer tokens and anti-forgery headers are not added to job
previews. Event bodies and errors can still contain personal or sensitive text;
redact them before sharing. Do not paste credentials into event fields.

Local links/settings/logs are not uploaded as a separate database. Individual
values, such as event IDs and performer names, are used in platform requests.
Announcements copied to the clipboard and exported calendar files leave
extension storage at your request; event-bridge does not automatically post them
to Discord or upload calendars.

## Consent and control

Version 0.2.15 and later replace the incorrect `none` declaration in 0.2.14
with Firefox's required `personallyIdentifyingInfo`, `authenticationInfo` and
`websiteContent` categories. Firefox 142+ provides install/update consent for
these declarations. Declining required transmission means declining installation
or the permission-changing update; disable/remove the extension to stop its use.
Changing listing text alone does not update an installed package's manifest.

Choose only the platforms you need. Site access can be revoked in Firefox's
extension settings. rave.page is optional; changing its instance forgets the
stored token. Disconnect forgets that token locally, not necessarily the server's
authorization. Sign out or revoke sessions on the platform itself when needed.

Set existing links to Off to stop their automatic sync; changing sync defaults
only affects links that inherit them. Clear finished jobs in Jobs. Remove saved
DJ names or presets through their views. Removing the extension/clearing its
storage removes local data, not events or accounts already stored remotely.

Version 0.2.15 and later disable private browsing and restrict extension-page
network connections and remote images to HTTPS, with no referrer sent from its
UI pages. Use normal browser windows: private-window and container tabs are never
used for platform sessions. Release checks: [Mozilla compliance](mozilla-compliance.md).

Questions: [project issues](https://github.com/dymattic/event-bridge/issues).
Do not include credentials or private account/event data in public reports.
