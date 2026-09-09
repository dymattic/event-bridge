# Mozilla / TypeScript extension requirements

Maintainer instructions; reviewed 2026-09-09. Passing automated validation is
not Mozilla approval. Read the current
[Add-on Policies](https://extensionworkshop.com/documentation/publish/add-on-policies/)
before submission.

## Safe application code

- Keep TypeScript strict and avoid unchecked `any`. Validate external data at
  adapter/message boundaries; TypeScript types alone do not validate runtime data.
- Render names, descriptions, announcements and other external strings as React
  children or `textContent`. No `dangerouslySetInnerHTML`, dynamic `innerHTML` /
  `outerHTML` writes, `insertAdjacentHTML`, or `document.write` / `writeln`.
- Detached `DOMParser` parsing for adapter extraction and read-only `outerHTML`
  are permitted. Never insert parsed third-party nodes into the live UI.
- No remote executable code, `eval`, `Function` constructors, or CSP/security
  header relaxation. Request only required permissions; use user-triggered
  optional grants for a configured instance.

`test/security/extension-policy.test.ts` checks application and vendored kit
source with the TypeScript parser. It is a source-level guard, not a complete
data-flow/security audit. Keep browser tests for user-visible behavior.

## Four upstream React warnings

The UI bundles each include two `UNSAFE_VAR_ASSIGNMENT` warnings from official
`react-dom@19.2.8`, in `cjs/react-dom-client.production.js`:

- `setProp`: the `dangerouslySetInnerHTML` setter (upstream line 13074).
- `setPropOnCustomElement`: the same explicit raw-HTML API (line 13288).

SHA-256 of the unmodified npm file:
`6cf4932e0c20a4572ae395035ca2e512a42d7d49c1a659fa73d6197069c28df0`.

Bundle line numbers change on rebuild. The warnings remain visible; application
and kit code do not use that API. Tests verify the source hash and guard against
application use. [React documents the API and its XSS risks](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html).

Do not patch React, rename properties to evade scanning, or suppress these
messages. Mozilla's Development Practices prohibit modifying third-party
libraries. [Library submission guidance](https://extensionworkshop.com/documentation/publish/third-party-library-usage/)
requires identifiable official releases; the exact npm dependencies and lockfile
provide provenance. Future resolution must use an official compatible release
or Mozilla reviewer guidance. A framework migration requires separate design
and compatibility work.

Suggested reviewer note:

> The four innerHTML warnings originate in unmodified react-dom 19.2.8's
> dangerouslySetInnerHTML implementation, bundled into popup and dashboard.
> Neither our application nor the vendored UI kit invokes that API. External
> strings are rendered as React children/text. Source, dependency lockfile,
> upstream hash and regression checks are provided with this version.

## Manifest and data handling

Firefox desktop minimum: **142.0**. This resolves the validator's inherited
Android minimum warning for `data_collection_permissions`. Do not add
`gecko_android` or list Android without testing it. See
[browser-specific settings](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings).

Keep declarations, listing and `docs/privacy.md` accurate to actual behavior.
`required: ["none"]` does not merely mean no telemetry: review all outbound
payloads against [Mozilla's data taxonomy](https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/)
when transmission changes. Describe the user-directed platform requests and
obtain any required consent. Never include real sessions, credentials, private
account fixtures or platform screenshots in the repository/reviewer archive.

## Compliance audit: 2026-09-09

Update README, [privacy policy](privacy.md), [listing/reviewer copy](amo-listing.md)
and the actual AMO fields together. Do not advertise unreleased safeguards as
present in the installed version. `none` in 0.2.14 was incorrect: no telemetry
does not mean no authenticated platform or image-host transmission.

The compliance build declares required `personallyIdentifyingInfo` (account and
performer identifiers/names), `authenticationInfo` (authenticated operations) and
`websiteContent` (event text, images, links, requests). Use Firefox's built-in
install/update consent, not implicit single-use consent for cookie-authenticated
or automatic operations. No telemetry is implemented; do not declare it merely
because ordinary network requests carry browser metadata.

Keep `incognito: not_allowed`, packaged scripts only, HTTPS extension-page
connections/images and UI `no-referrer`. Never relax website security headers.
Keep private/container sessions out of agent selection; container support needs
explicit session-scoped selection/storage. Never expose local identity/link
stores to web content. No history, cookies API, native messaging or userScripts
permission is needed. Optional wildcard HTTPS origins are possible rave.page
instances, not blanket access: request only the selected app/API origins.

Listing disclosures must include session checks on opening views, bounded public
My gigs reads, automatic Apply writes without per-write previews, remembered
publish confirmation, external poster/avatar hosts and bounded upload polling.
Jobs omit transport authentication but can contain private event data. Uninstall
does not delete remote events; local token removal is not server-side revocation.

Submission prerequisites (not waived by green tests):

- Provide matching source ZIP, exact rebuild commands and runnable mocked tests.
- Author cannot provision password-based vrc.tl/vrcpop.com test accounts. Explain
  their normal sign-in flows and request an acceptable review arrangement. Only a
  development.rave.page account can be supplied. Credentials go in AMO private
  reviewer notes, never public version notes/docs/source. Mocks are not live access.
- Shared UI kit provenance: `@rave-page/ui` is first-party (rave.page
  `packages/ui`; source commit in `packages/ui/PROVENANCE.md`), not an npm release.
  Its complete original TS/TSX source is vendored in-repo under `packages/ui` (a
  `workspace:*` package with its MIT `LICENSE`); `pnpm install`/`pnpm build`
  compile it to JS from that source. No compiled kit output is committed. Never
  hand-edit the kit source to satisfy the app compiler; fix upstream and re-vendor.
- Verify project LICENSE and generated THIRD_PARTY_NOTICES.txt in both browser
  ZIPs. Notices are extracted from actual bundled packages, not invented summaries;
  `licenses/` holds the single reviewed supplement for a release without one.
- Test Firefox install/update consent and refusal, private access, ordinary sessions
  and Disconnect. Chromium mocks and web-ext lint do not prove Firefox behavior.
- Keep pre-alpha/experimental status, account/payment requirements and independence
  accurate; retain reachable support details and sanitized screenshots. Do not
  bundle unrelated features into a reviewer-correction version.

## Build, review and release

Use **Node 24.20.0 LTS** from `.node-version`, pnpm **10.33.0**, and frozen
dependencies. Choose the newest LTS at least seven days old; record its release
date and run all gates on that runtime. `pnpm check:pins` verifies the exact
runtime, matching package engine, official LTS status and completed soak.
`SUPPLY_CHAIN.md` records the current
2026-08-26 release and 13-day soak. Node 24 typings are pinned separately.

Submit the release's Firefox ZIP and its matching `event-bridge-source` ZIP.
The generic GitHub source download has the development version. Preserve
original TS/TSX, the lockfile, build tooling, vendored kit source/licensing and
exact build instructions. No generated-file edits or private build dependencies.
[Source submission requirements](https://extensionworkshop.com/documentation/publish/source-code-submission/)
and [reviewer commands](development.md#mozilla-reviewer-build).

CI must pass pins, typecheck, unit/security tests, both browser builds, Firefox
validation and mocked e2e. The release job rebuilds the reviewer archive and
compares both browser outputs before publishing. Investigate every new warning;
the four identified React warnings are not a blanket exception for application
code or other dependencies. Mozilla signing/listing remains a separate action.
