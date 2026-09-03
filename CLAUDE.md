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
- **Gates before any commit:** `pnpm typecheck && pnpm test && pnpm build`
  clean (once scaffolded; keep this row current as tooling lands).
- **Secrets hygiene.** Test credentials in git-ignored `.env` /
  `CLAUDE.local.md` only.
- **Never create public events on third-party platforms during testing**
  without the user's explicit go-ahead. vrcpop has NO draft state (every save
  publishes); vrc.tl has "Publish to Timeline" unchecked = draft. Prefer
  drafts, prefer the user's own club, name test events clearly.
- **Clean up scratch artefacts.** Repo root stays clean.
- **Root `.md` hygiene.** Root keeps only `README.md`, `CLAUDE.md`,
  `SUPPLY_CHAIN.md`, `LICENSE` + README-linked refs. User docs → `docs/`.
  Agent plans/notes/recon → `.devnotes/` (git-ignored here).

## Git / publishing

- Local repo for now; **no remote until the user explicitly approves the GitHub
  publish** (workspace rule: never publish beyond repository policy and
  explicit approval). Before first push: audit history for anything violating
  public-repo hygiene - history is forever on GitHub.
- Commit after each logical unit once gates pass; don't batch features.
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
  ui/          popup + options (framework-light)
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
- node ≥22 + pnpm ≥10 on PATH.
- Manual verification via Playwright MCP with the user's logged-in sessions;
  the user logs in themselves - never ask for platform credentials.
