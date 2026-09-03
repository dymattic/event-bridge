# vendor/ provenance - @rave-page/ui

Vendored tarball of the rave.page design-system kit `@rave-page/ui`. Committed
so `pnpm install` is self-contained for outside contributors (no sibling
rave.page checkout needed). Interim until the kit ships on npm (plan P8).

| Field | Value |
|---|---|
| Package | `@rave-page/ui@0.1.0` |
| Tarball | `vendor/rave-page-ui-0.1.0.tgz` |
| sha256 | `eb5bb6cc096b9bab2e0d25b7a03c9db401b1813cd6269d2ff51c04c68143ecdf` |
| Kit commit | `8dc7613977866cefe33c8e92db2d63e6b2ecb9a1` |
| Kit branch | `wt-uikit` |
| Vendored (UTC) | 2026-09-03T17:43:14Z |

The packed tarball ships `dist/` (compiled ESM + `.d.ts`), `src/` (Tailwind
scans it via `@source`), `src/styles/{tokens,font}.css`, `fonts/` (Orbitron +
OFL), and `LICENSE` (MIT). event-bridge consumes the compiled `.` export
(`dist/index.js` / `dist/index.d.ts`) - not the kit TS sources, whose tsconfig
is looser than ours.

## Refresh

```sh
pnpm vendor:ui                                     # default kit: ../rave.page/packages/ui
pnpm vendor:ui ../rave.page-wt-uikit/packages/ui   # or a worktree/explicit path
# then, if the spec/tarball changed:
pnpm install
```

Re-vendoring the SAME version replaces the tarball in place; if node_modules
still holds the old copy, `pnpm install --force`. Never hand-edit files under
`vendor/`; re-run `pnpm vendor:ui`. Never edit the kit worktree from this repo.
