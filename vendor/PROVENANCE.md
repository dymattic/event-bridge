# vendor/ provenance - @rave-page/ui

Vendored tarball of the rave.page design-system kit `@rave-page/ui`. Committed
so `pnpm install` is self-contained for outside contributors (no sibling
rave.page checkout needed). Interim until the kit ships on npm (plan P8).

| Field | Value |
|---|---|
| Package | `@rave-page/ui@0.2.0` |
| Tarball | `vendor/rave-page-ui-0.2.0.tgz` |
| sha256 | `dbdae9079f298d5357a409f6dcbd4d966dc794cdd93becfac4da169a070ccd17` |
| Kit commit | `edb56e8c5568fa0bad8a129b427323cdd3ff4b5c` |
| Kit branch | `wt-uikit-events` |
| Vendored (UTC) | 2026-09-04T09:41:43Z |

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
