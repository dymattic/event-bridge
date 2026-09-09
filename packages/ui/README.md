# @rave-page/ui

rave.page design-system UI primitives. React 19 + Tailwind v4 + Radix, `cva` +
`cn` (clsx + tailwind-merge). **This package is the source of truth**;
`app/src/components/ui/*` in the rave.page web app are thin shims that re-export
from here (injecting app i18n, the ui-preferences store, the consent-gated
`Image`, and WebGL FX).

## Install (workspace)

Workspace consumers use `"@rave-page/ui": "workspace:*"`. Before an npm publish,
an external repo can point at a local checkout with
`"@rave-page/ui": "link:../rave.page/packages/ui"` (or `file:`), then switch to
the published version once it's on the registry.

## Setup (Tailwind v4 consumer)

1. Import the tokens and tell Tailwind to scan the kit source for classes:

   ```css
   @import "tailwindcss";
   @import "@rave-page/ui/tokens.css";
   @source "../node_modules/@rave-page/ui/src";
   ```

   `@source` is required - Tailwind only generates the utility classes it can
   see, and the kit's class strings live in its `src/`. Adjust the relative
   path to point at wherever `@rave-page/ui` resolves from your CSS file.

   Filled surfaces carrying white text use `bg-brand-base-fill` (`#DB0759`,
   hover `bg-brand-base-fill-hover` `#C7064F`); `--color-brand-base` `#F70864`
   fails AA under white (4.05:1) and stays a text/border/icon/glow accent.

2. Fonts. Two roles (2026-09-07 split): **Orbitron** is display-only
   (`font-display`: h1/h2, wordmark, eyebrows, numerals); **Inter** is the
   body/UI face (`font-body`, the `html, body` default).

   - Body face - always import Inter (self-hosted, OFL, no CDN):

     ```css
     @import "@fontsource-variable/inter";
     ```

   - Display face - if your app doesn't already load Orbitron, add:

     ```css
     @import "@rave-page/ui/font.css";
     ```

     and copy `node_modules/@rave-page/ui/fonts/` next to your bundled CSS (the
     `@font-face` `url()` is relative to the CSS file), or rewrite the url to
     your bundler's asset path. The rave.page app already serves Orbitron, so it
     imports `tokens.css` only (no `font.css`) to avoid double-loading.

3. Mount the providers once near your app root:

   ```tsx
   import {TooltipProvider, NotificationProvider} from "@rave-page/ui";

   <TooltipProvider>
     <NotificationProvider>
       {/* app; render <Toast/> somewhere inside */}
     </NotificationProvider>
   </TooltipProvider>
   ```

   `TooltipProvider` is required by any `Button`/`IconButtonWithTooltip` that
   uses `tooltip`. `NotificationProvider` + `<Toast/>` back `useNotification()`.

### External esbuild + Tailwind CLI consumer (e.g. event-bridge)

Same three steps. With the Tailwind CLI, run e.g.
`tailwindcss -i src/app.css -o dist/app.css` where `src/app.css` contains the
`@import`/`@source` lines above (path relative to `src/app.css`, e.g.
`@source "../node_modules/@rave-page/ui/src";`). Copy the font file into your
output dir. React 19 and a lucide-react in `>=0.560 <2` are peer deps you
provide (event-bridge's 1.34 is fine). esbuild bundles the kit's ESM from
`@rave-page/ui` (its `.` export resolves to `dist/` once published, or `src/`
in a workspace/`link:` setup).

## Peers

`react` ^19, `react-dom` ^19, `lucide-react` `>=0.560.0 <2` (you pick the copy;
the kit imports only icons present in both 0.562 and 1.34).

## The `labels` pattern (i18n-agnostic)

Components carry no i18n. User-visible strings are optional `labels` props with
English defaults exported per component as `<component>DefaultLabels` (e.g.
`dialogDefaultLabels`, `smartSelectDefaultLabels`, `confirmDialogDefaultLabels`,
`datePickerDefaultLabels`, `dateTimePickerDefaultLabels`, `toastDefaultLabels`,
`sheetDefaultLabels`, `colorPickerDefaultLabels`, `inputDialogDefaultLabels`,
`renameDialogDefaultLabels`). Pass a partial `labels` object to localize; the
rave.page app shim passes `t('…')` strings.

## Inventory

| Group | Exports |
|---|---|
| Utilities | `cn`, `useFloatingPosition` |
| Badge | `Badge`, `badgeVariants` |
| Chip | `Chip`, `ChipGroup`, `chipVariants` - every pill (filter/tag/jump-nav/genre); `Badge` stays status-only |
| Button + Tooltip | `Button`, `buttonVariants`, `IconButtonWithTooltip`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` |
| Card | `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, `CardContent` (`renderFx` prop for WebGL overlays) |
| Dashboard | `DashboardCard`, `DashboardTile`, `DashboardListRow`, `dashboardCardVariants`, `StatCard` |
| Feedback | `EmptyState`, `LoadingSpinner`, `Toast`, `NotificationProvider`, `useNotification` |
| Form controls | `Input`, `Textarea`, `Label`, `Checkbox`, `Switch`, `RangeSlider`, `SmartSelect` (`renderOptionImage`, `menuWidth` props), `ColorPicker`, `PRESET_COLORS` |
| Date/time | `DatePicker`, `DateTimePicker` |
| Overlays | `Dialog` family, `ConfirmDialog`, `InputDialog`, `RenameDialog`, `Sheet` family, `Popover` family, `DropdownMenu` family |
| Layout | `Tabs` family, `Separator`, `DataTable` |
| Avatar | `Avatar` (plain image + deterministic initials, no media-URL logic) |
| Events | `LineupBoard`, `lineupBoardDefaultLabels`, `VisibilityBadge`, `visibilityBadgeDefaultLabels`; lineup model types; pure helpers (`sortSlots`, `reorderSlots`, `movePerformer`, `generateSlots`, `layContiguous`, `detectIssues`, `totalDurationMinutes`, `slotDurationMinutes`, `shiftSlot`, `resizeSlot`) |

`LineupBoard` is a fully controlled, platform-agnostic lineup/slot editor
derived from the app's SlotBoard: dnd-kit reorder (drag + keyboard/mobile
up/down buttons), slot time editing via `DateTimePicker`, async performer
search via `SmartSelect`, a bulk generator, and capability-driven affordances
(`LineupCapabilities`: B2B, gaps/overlaps, editable times, max slots, free
text) with `detectIssues` badges + a "Make contiguous" action. All strings via
`labels`. Requires `TooltipProvider` mounted (its icon buttons auto-tooltip).
Depends on dnd-kit; the pure `lineup-math` helpers are React-free.

### Chip / ChipGroup

Every pill (filter, tag, jump nav, lineup credit, genre) uses `Chip`; `Badge`
is status-only. `tone` colours the *selected* state (`neutral | brand | live |
soon`); unselected is always neutral. `size` `sm | md` (44px touch floor on
mobile). `Chip` renders as `button` / `a` (`href`) / `span` (neither `onClick`
nor `href`).

```tsx
import {Chip, ChipGroup} from "@rave-page/ui";

// standalone toggle / jump-nav item
<Chip as="button" size="sm" tone="neutral" count={12} onClick={jump}>Today</Chip>

// single-select filter row (radiogroup + roving focus)
<ChipGroup
  aria-label="Event status"
  value={status}                      // string | null
  onChange={v => setStatus(v as Status)}
  options={[
    {value: 'all', label: 'All'},
    {value: 'live', label: 'Live', count: 2},
    {value: 'upcoming', label: 'Upcoming'},
  ]}
/>

// multi-select (role=group, aria-pressed); onChange gets a string[]
<ChipGroup aria-label="Platform" multiple value={platforms}
  onChange={v => setPlatforms(v as string[])} options={platformOptions}/>
```

### SmartSelect menu width

`menuWidth="trigger"` (default) matches the menu to the trigger; `"auto"`
floors the menu at the trigger width and grows to its content (up to the
viewport minus gutters) - use it when option labels are wider than a narrow
trigger (e.g. a timezone picker).

Left in the app (not extracted): `Image`, `Markdown`, `LinkedMedia`,
`MediaSkeleton`, `Resizable`/`ResizableBox`, `EventCalendarPicker`,
`MiniCalendarPicker`, `UiPreferencesPanel`, `FlowCard` (router dep). See
`PROVENANCE.md`.

## Dev playground

`dev/` is a git-tracked, never-published Vite harness for eyeballing kit
components without a storybook (the app doesn't consume `LineupBoard` yet). It
mounts `LineupBoard` with sample slots, an unscheduled tray, a fake async
`searchPerformers`, and two capability presets (rave.page-like: B2B + gaps
allowed; vrc.tl-like: single performer, contiguous only, capped).

```
pnpm --filter @rave-page/ui exec vite --config dev/vite.config.ts --port 5175
# open http://localhost:5175/lineup-board.html
```

## License

MIT (`LICENSE`). rave.page has no root LICENSE yet - confirm licensing before
any public npm publish.
