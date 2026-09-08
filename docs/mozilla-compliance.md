# Mozilla / TypeScript extension requirements

Maintainer instructions; reviewed 2026-09-08. Passing automated validation is
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
