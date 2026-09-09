# packages/ui provenance — @rave-page/ui (vendored source)

First-party design-system kit source, vendored **as source files** into
event-bridge (not a tarball, not a submodule) so the repo is self-contained and
AMO reviewers get the complete, unmodified source that produces the bundle.

| Field | Value |
|---|---|
| Package | `@rave-page/ui` |
| Upstream | rave.page repo, `packages/ui` (branch `wt-uikit-events`) |
| Source commit | `c71216293ac5bc6274cdd81242787a774f17af32` |
| Vendored (UTC) | 2026-09-09 |
| Local version | `0.3.0` (event-bridge snapshot) |

## How it's consumed

`packages/ui` is a pnpm **workspace package** (`workspace:*`). Its `prepare`
script compiles `src/**` to `dist/` with its own `tsconfig.build.json`; event-
bridge bundles the compiled `dist/` (and imports its `.d.ts`). `dist/` is
git-ignored — the reviewable truth is `src/`, and `pnpm install` / `pnpm build`
reproduce `dist/` from it. Consuming the compiled output keeps the kit's looser
tsconfig separate from this repo's stricter one (`noUncheckedIndexedAccess`
etc.), so the kit source is never edited to satisfy the app's compiler.

Versions were aligned to event-bridge on vendoring: React 19 peer, `@types/react`
19.2.18, `@types/react-dom` 19.2.5, TypeScript 6.0.3, Node 24.20.0. The kit's own
exact-pinned runtime deps (Radix, dnd-kit, cva, clsx, dayjs, tailwind-merge) are
listed in `../../SUPPLY_CHAIN.md` and age-gated by pnpm `minimumReleaseAge`.

## Refresh from upstream

Re-copy the tracked source from the rave.page kit worktree (drop `dev/`), then
reinstall and re-run gates:

```sh
git -C ../rave.page-wt-uikit-events archive HEAD packages/ui | tar -x --strip-components=2 -C packages/ui
rm -rf packages/ui/dev
pnpm install && pnpm build && pnpm typecheck && pnpm test && pnpm e2e
```

Update the source commit + date above. Do not hand-edit kit source to fix app
type errors — fix upstream in rave.page and re-vendor. LICENSE (MIT) stays intact.
