# CLAUDE.md - event-bridge

Guidance for Claude Code in this repo. These instructions OVERRIDE default behavior.

**event-bridge** (working title) = browser extension (Chrome/Firefox, MV3) to
create, manage, and migrate VRChat scene events across vrc.tl, vrcpop.com and
rave.page (development.rave.page during dev). Those platforms offer no public
API and forbid scraping - the extension acts as the logged-in user in their own
browser, same-origin, using their own session. **Will be published open source
on GitHub (WTFPL)** - write everything as if it were already public.

## Operating model (hard rule)

Session lead = **overseeing architect**: plans, writes detailed briefs, reviews
results, verifies outcomes — subagents execute. **Opus subagents**
(`model: opus`; forks exempt — they inherit the lead's model) do the work:
information gathering, file edits, feature implementation. A brief carries
goal, constraints, exact files, acceptance criteria, verification steps. Lead
direct-edits only typo-class changes where a brief would cost more than the
edit. Subagents execute their brief directly — no recursive delegation. Every
agent obeys the CLAUDE.md + rules of the repository it works in.

## Token-economy style (all code, comments, .md)

Minimize tokens. Drop filler ("simply", "just", "in order to", "make sure that").

1. **Code self-explains.** Comments only where intent isn't obvious - invariants,
   dense logic, security.
2. **Terse prose.** Techies only. Drop articles where it stays readable.
3. Same for `.md` files. Compress.

## Non-negotiable rules

- **User-agency only, never scraping.** The extension performs actions the
  logged-in user could do by hand, in their own browser, at human scale: no
  crawling, no bulk harvesting of other clubs' data, no background polling of
  third-party sites, no captcha/anti-bot circumvention. Features that automate
  beyond the user's own events/clubs are rejected.
- **Public-repo hygiene.** This repo goes to GitHub. NEVER commit: session
  cookies/tokens/CSRF values, HAR dumps, admin-page screenshots, internal infra
  hostnames or IPs (LAN, gitlab.naise.io, …), personal credentials. Platform
  endpoint recon and session notes live in `.devnotes/` which is **git-ignored
  in this repo** (unlike other repos) - adapters encode what's needed in code.
- **Supply chain: minimal deps; 7-day soak.** Never `@latest`. Pin exact
  versions ≥7 days old at pin time. Every new direct dep needs a justification
  row in `SUPPLY_CHAIN.md`. Prefer zero-dep: an extension doing fetch + forms
  needs very little.
- **License: WTFPL.** `LICENSE` stays intact; no incompatible code copied in.
- **MV3, dual-browser.** Chrome + Firefox from day one (Firefox MV3 /
  `browser.*` polyfill or WebExtension API). No Chrome-only APIs without a
  Firefox path. Minimal permissions: `host_permissions` only for the three
  platforms, no `<all_urls>`.
- **Platform adapters are isolated.** One adapter per platform implementing the
  shared event interchange schema; core/UI never talk to a platform directly.
  Adapter quirks (vrcpop CSRF header + `version` optimistic lock, vrc.tl Nette
  form encoding + server-assigned slot/performer ids, rave.page API) stay
  inside the adapter.
- **Typed everything, zero unchecked `any`.** TS `strict`; casts only at real
  boundaries with a comment.
- **Mozilla / TypeScript compliance.** Read `docs/mozilla-compliance.md` before
  extension, dependency, manifest or release changes. Keep third-party libraries
  unmodified; do not rewrite dependency code or conceal validator warnings.
  Render platform/user data through React children or `textContent`, never raw
  HTML. `test/security/extension-policy.test.ts` enforces source-level rules.
  Original TS/TSX, lockfile, vendored source and reproducible reviewer builds
  must accompany every release. Reassess permissions/data declarations when
  behavior changes; no remote code, eval or security-header relaxation.
- **Platform-neutral product.** event-bridge is an independent tool, not a
  product of any platform (user rule 2026-09-04, clarified 10:36). Neutrality
  is FUNCTIONAL: vrc.tl, vrcpop.com and rave.page are equal integrations - one
  identical card per platform (order vrc.tl, vrcpop.com, rave.page), no platform
  is a prerequisite for using the others, no flow starts with or requires a
  rave.page connection, and no copy implies that. The visual identity is
  intentionally rave.page's design system: the shared kit `@rave-page/ui` with
  its own brand tokens (pink base, Orbitron, mint/violet/amber intents) is used
  as-is - do NOT re-theme it. The product name stays plain "event-bridge" (never
  a rave.page-style wordmark).
- **Rich UI, resolved ids.** (user rule 2026-09-04 10:37) User-facing views use
  the kit's rich components (`DataTable`, `DashboardCard`/`StatCard`,
  `EmptyState`, `SmartSelect` search pickers, `DateTimePicker`, `Dialog`/`Sheet`,
  `Badge` intents) and show human-readable data: once a platform is connected
  or signed in, list own clubs/groups (name, avatar, role), own events (title,
  local date/time, status, poster thumb), performers via searchable pickers
  backed by the platform's own search. Raw ids (`grp_…`, numeric vrcpop /
  vrc.tl ids, "user 1022") appear only inside a collapsed details disclosure
  or the `#/dev/*` panels - never as the primary label. e2e asserts names, not
  ids. The extension is the full event-management surface (create, edit,
  search/filter, transfer, sync) - not a transfer side-tool.
- **Reuse rave.page's event-management components** (user 2026-09-04 10:49:
  "date pickers, dj slot selector/mover", "smart selects"): the lineup board
  (SlotBoard), event form fields, status/visibility controls, `SmartSelect`,
  `DateTimePicker`, uploader UI come from rave.page through the kit -
  decoupled upstream into `@rave-page/ui` (props + callbacks + `labels`, no
  react-query/api-client/i18n/router), consumed here, never re-implemented.
- **UI reuse over reinvention.** Dashboard/popup are built on `@rave-page/ui`,
  the shared design-system kit owned by the rave.page repo (`packages/ui`;
  user decision 2026-09-03), plus its `tokens.css`. No hand-rolled widgets or
  ad-hoc colours when a kit component/token exists; missing primitives are
  added upstream in the kit, never forked here. Until the kit is on npm the
  dependency is a vendored tarball under `vendor/` with `vendor/PROVENANCE.md`
  (`pnpm vendor:ui`; see docs).
- **Gates before any commit:**
  `pnpm check:pins && pnpm typecheck && pnpm test && pnpm build && pnpm e2e`
  clean (keep this row current as tooling lands).
- **Secrets hygiene.** Test credentials in git-ignored `.env` /
  `CLAUDE.local.md` only.
- **No test events on vrc.tl / vrcpop.** Never create or delete events on the
  third-party platforms during development or testing (user rule 2026-09-03:
  recon captured everything needed). Automated tests run against mocks only.
  Manual checks against real sessions are read-only by default; a write is
  allowed only as a reversible edit of the user's designated existing test
  events (ids in git-ignored `CLAUDE.local.md`), restored afterwards, with the
  exact request previewed first. rave.page **development** may be exercised
  freely with draft/unlisted events, cleaned up afterwards.
- **Pure `src/ui/lib`.** Modules there that node/happy-dom tests import
  (`event-filters`, `format`, `platform-meta`, `lineup-bridge`, form models)
  never import `runtime/*`, `adapters/registry` or `shared/webext` (the shim
  throws outside the extension). Settings-bound helpers go to
  `src/ui/lib/platform-urls.ts` or `src/ui/dashboard/lib/*`, which render
  tests mock.
- **Clean up scratch artefacts.** Repo root stays clean.
- **Root `.md` hygiene.** Root keeps only `README.md`, `CLAUDE.md`,
  `SUPPLY_CHAIN.md`, `LICENSE` + README-linked refs. User docs → `docs/`.
  Agent plans/notes/recon → `.devnotes/` (git-ignored here).

## Git / publishing

- Published at `dymattic/event-bridge`. User decision 2026-09-08: every push
  to `master` automatically publishes a versioned GitHub pre-release after all
  CI gates pass. Chrome/Firefox packages, matching Mozilla reviewer sources and
  checksums are required. See `docs/development.md` for versioning and rebuilds.
  This authorizes CI releases; agent pushes still require user authorization.
  Mozilla signing/listing is separate.
- **GitHub namespace: `dymattic/event-bridge`** (user's personal account, NOT a
  rave.page org) - user decision 2026-09-03.
- Commit after each logical unit once gates pass; don't batch features.
- **Signed commits required** (user decision 2026-09-08). `master` requires
  verified signatures; CI refuses unsigned release commits. Local commits use
  `commit.gpgsign=true` with a GitHub-registered signer. If no signer is available,
  use GitHub's signed `createCommitOnBranch` API after gates and explicit push
  approval; never fall back to unsigned commits or disable signature enforcement.
  Verify the resulting signature on GitHub. See `docs/development.md`.
- Never force-push; never leave broken state committed.

## Architecture (planned)

```
src/
  core/        event interchange schema + mapping (platform-agnostic, pure TS)
  adapters/
    vrcpop/    JSON API: POST /api/events/?action=create|update, x-csrf-token
               header, version read-before-write, taxonomies via /api/dj/
    vrctl/     Nette form POSTs (_do=form-form-submit), performer id lookup
               via /admin/ajax/performer, slot ids read back after create,
               promoted/published split
    ravepage/  official rave.page API (development.rave.page during dev)
  ui/          React 19 + Tailwind 4 on @rave-page/ui (shared kit owned by rave.page) + its tokens.css; only extension-specific views/components live here
  background/  session detection, fetch orchestration
e2e/           Playwright against the extension
docs/          user-facing docs
.devnotes/     recon + session notes (git-ignored)
```

Cross-platform club identity anchor: VRChat group id (same group id appears on
vrcpop and vrc.tl). Capability differences per platform are first-class in the
schema (see rave.page `.devnotes/PARTNER_FEDERATION_PREVIEW.md` for the
capability-mapping precedent: not every platform federates every concept).

## Environment

- Windows host, bash shell: forward slashes, `/dev/null` not `NUL`.
- Node 24.20.0 LTS (`.node-version`, exact) + pnpm 10.33.0 on PATH. Node upgrades
  select the newest LTS that is at least seven days old, record the official
  release date in `SUPPLY_CHAIN.md`, then pass all gates on that exact runtime.
- Manual verification via Playwright MCP with the user's logged-in sessions;
  the user logs in themselves - never ask for platform credentials.

## Commands

| Task | Command |
|---|---|
| Install | `pnpm install` |
| Typecheck | `pnpm typecheck` (DOM project + `tsconfig.background.json` WebWorker) |
| Test | `pnpm test` (vitest) |
| Build | `pnpm build` (esbuild -> `build/`, assemble -> `dist/{chrome,firefox}`) |
| Dev watch | `pnpm dev` (esbuild context.watch + `tailwindcss --watch` together) |
| E2E | `pnpm e2e` (first: `pnpm exec playwright install chromium`) |
| Check pins | `pnpm check:pins` (run on any `package.json` change) |
| Generate API | `pnpm generate-api` (live dev OpenAPI spec → `src/adapters/ravepage/{openapi.json,api-client/}`; idempotent; run before rave.page adapter work) |
| Regen icons | `pnpm icons` |
| Firefox lint | `pnpm lint:firefox` (`web-ext@10.6.0` via `pnpm dlx`) |
