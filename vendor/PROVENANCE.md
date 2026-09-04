# vendor/ provenance - @rave-page/ui

Vendored tarball of the rave.page design-system kit `@rave-page/ui`. Committed
so `pnpm install` is self-contained for outside contributors (no sibling
rave.page checkout needed). Interim until the kit ships on npm (plan P8).

| Field | Value |
|---|---|
| Package | `@rave-page/ui@0.1.1` |
| Tarball | `vendor/rave-page-ui-0.1.1.tgz` |
| sha256 | `2721183830e12d607130f5f0d0e542ece49bf1124bf61188ab09077f022bf82b` |
| Kit commit | `b0c4e0e19a945c27922e93b010a640c0e721e2ec` |
| Kit branch | `wt-uikit-glow` |
| Vendored (UTC) | 2026-09-04T08:07:41Z |

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
