// @rave-page/ui - public barrel. Source of truth for the rave.page design
// system. The rave.page web app re-exports these through thin shims in
// app/src/components/ui; external consumers import from "@rave-page/ui".

// ── utilities / hooks ───────────────────────────────────────────────
export {cn} from './lib/cn';
export {useFloatingPosition} from './hooks/useFloatingPosition';
export type {FloatingPlacement, FloatingPositionResult} from './hooks/useFloatingPosition';

// ── Badge ───────────────────────────────────────────────────────────
export {Badge, badgeVariants} from './base/Badge';
export type {BadgeProps} from './base/Badge';

// ── Chip + ChipGroup ────────────────────────────────────────────────
export {Chip, ChipGroup, chipVariants} from './base/Chip';
export type {ChipProps, ChipGroupProps, ChipGroupOption} from './base/Chip';

// ── Button + Tooltip ────────────────────────────────────────────────
export {Button, buttonVariants} from './base/Button';
export type {ButtonProps} from './base/Button';
export {Tooltip, TooltipTrigger, TooltipContent, TooltipProvider} from './base/Tooltip';
export {IconButtonWithTooltip} from './base/IconButtonWithTooltip';
export type {IconButtonWithTooltipProps} from './base/IconButtonWithTooltip';

// ── Card family ─────────────────────────────────────────────────────
export {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent} from './base/Card';
export type {CardProps, CardFx} from './base/Card';

// ── DashboardCard family + StatCard ─────────────────────────────────
export {DashboardCard, DashboardTile, DashboardListRow, dashboardCardVariants} from './base/DashboardCard';
export type {DashboardCardProps, DashboardListRowProps} from './base/DashboardCard';
export {StatCard} from './base/StatCard';
export type {StatCardProps} from './base/StatCard';

// ── EmptyState ──────────────────────────────────────────────────────
export {EmptyState} from './base/EmptyState';
export type {EmptyStateProps} from './base/EmptyState';

// ── form controls ───────────────────────────────────────────────────
export {Input} from './base/Input';
export type {InputProps} from './base/Input';
export {Textarea} from './base/Textarea';
export {Label} from './base/Label';
export {Checkbox} from './base/Checkbox';
export {Switch} from './base/Switch';
export {default as RangeSlider} from './base/RangeSlider';
export type {RangeSliderProps} from './base/RangeSlider';

// ── SmartSelect ─────────────────────────────────────────────────────
export {default as SmartSelect, smartSelectDefaultLabels} from './base/SmartSelect';
export type {SmartSelectOption, SmartSelectLabels, SmartSelectMenuWidth} from './base/SmartSelect';

// ── date/time pickers ───────────────────────────────────────────────
export {DatePicker, datePickerDefaultLabels} from './base/DatePicker';
export type {DatePickerLabels} from './base/DatePicker';
export {DateTimePicker, dateTimePickerDefaultLabels} from './base/DateTimePicker';
export type {DateTimePickerProps, DateTimePickerLabels} from './base/DateTimePicker';

// ── Dialog family ───────────────────────────────────────────────────
export {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogClose,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    dialogDefaultLabels,
} from './base/Dialog';
export type {PersistedSize, DialogLabels} from './base/Dialog';

// ── dialog compositions ─────────────────────────────────────────────
export {default as ConfirmDialog, confirmDialogDefaultLabels} from './base/ConfirmDialog';
export type {ConfirmDialogLabels} from './base/ConfirmDialog';
export {default as InputDialog, inputDialogDefaultLabels} from './base/InputDialog';
export type {InputDialogLabels} from './base/InputDialog';
export {default as RenameDialog, renameDialogDefaultLabels} from './base/RenameDialog';
export type {RenameDialogLabels} from './base/RenameDialog';

// ── Sheet family ────────────────────────────────────────────────────
export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    sheetDefaultLabels,
} from './base/Sheet';
export type {SheetLabels} from './base/Sheet';

// ── Popover family ──────────────────────────────────────────────────
export {Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose} from './base/Popover';

// ── DropdownMenu family ─────────────────────────────────────────────
export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
} from './base/DropdownMenu';

// ── Tabs family ─────────────────────────────────────────────────────
export {Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants} from './base/Tabs';

// ── Separator ───────────────────────────────────────────────────────
export {Separator} from './base/Separator';

// ── notifications (Toast + context) ─────────────────────────────────
export {default as Toast, toastDefaultLabels} from './base/Toast';
export type {ToastLabels} from './base/Toast';
export {NotificationProvider, useNotification} from './base/NotificationContext';
export type {NotificationType} from './base/NotificationContext';

// ── LoadingSpinner ──────────────────────────────────────────────────
export {default as LoadingSpinner} from './base/LoadingSpinner';

// ── DataTable ───────────────────────────────────────────────────────
export {DataTable} from './base/DataTable';
export type {Column} from './base/DataTable';

// ── ColorPicker ─────────────────────────────────────────────────────
export {ColorPicker, PRESET_COLORS, colorPickerDefaultLabels} from './base/ColorPicker';
export type {ColorPickerLabels} from './base/ColorPicker';

// ── Avatar ──────────────────────────────────────────────────
export {Avatar} from './base/Avatar';
export type {AvatarProps} from './base/Avatar';

// ── events: lineup model + pure helpers ─────────────────────
export type {
    LineupPerformer,
    LineupSlot,
    LineupIssue,
    LineupCapabilities,
    PerformerPick,
} from './events/lineup-types';
export {
    sortSlots,
    reorderSlots,
    movePerformer,
    generateSlots,
    layContiguous,
    detectIssues,
    totalDurationMinutes,
    slotDurationMinutes,
    shiftSlot,
    resizeSlot,
} from './events/lineup-math';
export type {MovePerformer, GenerateSlotsInput, LineupIssueReport} from './events/lineup-math';

// ── events: LineupBoard ─────────────────────────────────────
export {LineupBoard, lineupBoardDefaultLabels} from './events/LineupBoard';
export type {LineupBoardProps, LineupBoardLabels} from './events/LineupBoard';

// ── events: VisibilityBadge ─────────────────────────────────
export {VisibilityBadge, visibilityBadgeDefaultLabels} from './events/VisibilityBadge';
export type {Visibility, VisibilityBadgeProps, VisibilityBadgeLabels} from './events/VisibilityBadge';
