import * as React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    GripVertical,
    Pencil,
    Plus,
    Sparkles,
    Trash2,
    UserPlus,
} from 'lucide-react';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    getFirstCollision,
    pointerWithin,
    rectIntersection,
    useDroppable,
    useSensor,
    useSensors,
    type CollisionDetection,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core';
import {SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {cn} from '../lib/cn';
import {Avatar} from '../base/Avatar';
import {Badge} from '../base/Badge';
import {Button} from '../base/Button';
import ConfirmDialog from '../base/ConfirmDialog';
import {DateTimePicker} from '../base/DateTimePicker';
import {Input} from '../base/Input';
import {Label} from '../base/Label';
import {Textarea} from '../base/Textarea';
import SmartSelect, {type SmartSelectOption} from '../base/SmartSelect';
import type {LineupCapabilities, LineupIssue, LineupPerformer, LineupSlot, PerformerPick} from './lineup-types';
import {detectIssues, layContiguous, reorderSlots, slotDurationMinutes, sortSlots, type MovePerformer} from './lineup-math';

dayjs.extend(utc);
dayjs.extend(timezone);

// ── labels ──────────────────────────────────────────────────
export interface LineupBoardLabels {
    title: string;
    addSlot: string;
    generate: string;
    regenerate: string;
    slotsField: string;
    lengthField: string;
    makeContiguous: string;
    setStartHint: string;
    emptyBoard: string;
    unscheduled: string;
    dragToSchedule: string;
    addPerformer: string;
    searchPerformers: string;
    searching: string;
    noResults: string;
    singlePerformerHint: string;
    maxSlotsHint: string;
    editSlot: string;
    removeSlot: string;
    removePerformer: string;
    editPerformer: string;
    moveUp: string;
    moveDown: string;
    dragHandle: string;
    cancel: string;
    save: string;
    slotTitle: string;
    stage: string;
    startTime: string;
    endTime: string;
    note: string;
    timesReadOnly: string;
    noTime: string;
    remove: string;
    statusConfirmed: string;
    statusPending: string;
    statusDeclined: string;
    confirmRemoveSlotTitle: string;
    confirmRemoveSlotMessage: string;
    confirmRemovePerformerTitle: string;
    confirmRemovePerformerMessage: string;
    minutesShort: (n: number) => string;
    slotLabel: (order: number) => string;
    slotCount: (n: number) => string;
    performerCount: (n: number) => string;
}

export const lineupBoardDefaultLabels: LineupBoardLabels = {
    title: 'Lineup',
    addSlot: 'Add slot',
    generate: 'Generate',
    regenerate: 'Regenerate',
    slotsField: 'Slots',
    lengthField: 'Length (min)',
    makeContiguous: 'Make contiguous',
    setStartHint: 'Set an event start time to generate slots.',
    emptyBoard: 'No slots yet.',
    unscheduled: 'Unscheduled',
    dragToSchedule: 'Drag into a slot to schedule',
    addPerformer: 'Add performer',
    searchPerformers: 'Search performers…',
    searching: 'Searching…',
    noResults: 'No matches.',
    singlePerformerHint: 'This platform allows one performer per slot.',
    maxSlotsHint: 'Slot limit reached.',
    editSlot: 'Edit slot',
    removeSlot: 'Remove slot',
    removePerformer: 'Remove performer',
    editPerformer: 'Edit performer',
    moveUp: 'Move up',
    moveDown: 'Move down',
    dragHandle: 'Drag to reorder',
    cancel: 'Cancel',
    save: 'Save',
    slotTitle: 'Title',
    stage: 'Stage',
    startTime: 'Start',
    endTime: 'End',
    note: 'Note',
    timesReadOnly: 'Times are fixed on this platform.',
    noTime: 'No time set',
    remove: 'Remove',
    statusConfirmed: 'Confirmed',
    statusPending: 'Pending',
    statusDeclined: 'Declined',
    confirmRemoveSlotTitle: 'Remove slot?',
    confirmRemoveSlotMessage: 'This removes the slot and unschedules its performers.',
    confirmRemovePerformerTitle: 'Remove performer?',
    confirmRemovePerformerMessage: 'Remove this performer from the slot.',
    minutesShort: (n) => `${n} min`,
    slotLabel: (order) => `Slot ${order + 1}`,
    slotCount: (n) => `${n} ${n === 1 ? 'slot' : 'slots'}`,
    performerCount: (n) => `${n} ${n === 1 ? 'performer' : 'performers'}`,
};

// ── props ───────────────────────────────────────────────────
export interface LineupBoardProps {
    slots: LineupSlot[];
    unscheduled?: LineupPerformer[];
    /** ISO instant - anchors the generator + start hints. */
    eventStartsAt: string | null;
    /** IANA tz - display only. */
    timezone: string;
    capabilities: LineupCapabilities;
    labels?: Partial<LineupBoardLabels>;
    readOnly?: boolean;
    busy?: boolean;
    onReorderSlots: (next: LineupSlot[]) => void;
    onUpdateSlot: (id: string, patch: Partial<Pick<LineupSlot, 'title' | 'stage' | 'startsAt' | 'endsAt' | 'note'>>) => void;
    onAddSlot: (afterSlotId?: string | null) => void;
    onRemoveSlot: (id: string) => void;
    onGenerateSlots?: (input: {count: number; lengthMinutes: number}) => void;
    onMovePerformer: (move: MovePerformer) => void;
    onAddPerformer: (slotId: string, pick: PerformerPick) => void;
    onRemovePerformer: (slotId: string, performerId: string) => void;
    onEditPerformer?: (slotId: string, performerId: string) => void;
    searchPerformers: (query: string) => Promise<PerformerPick[]>;
    renderPerformerExtra?: (performer: LineupPerformer, slot: LineupSlot) => React.ReactNode;
}

const ISSUE_VARIANT: Record<LineupIssue['kind'], 'warning' | 'secondary'> = {
    gap: 'warning',
    overlap: 'warning',
    warning: 'warning',
    unsupported: 'secondary',
};

// ── performer row ───────────────────────────────────────────
interface RowCtx {
    l: LineupBoardLabels;
    readOnly: boolean;
    busy: boolean;
    canMoveUp: boolean;
    canMoveDown: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onEdit?: () => void;
    onRemove: () => void;
    extra?: React.ReactNode;
}

function statusBadge(l: LineupBoardLabels, status: LineupPerformer['status']) {
    if (status === 'confirmed') return <Badge variant="success">{l.statusConfirmed}</Badge>;
    if (status === 'pending') return <Badge variant="warning">{l.statusPending}</Badge>;
    if (status === 'declined') return <Badge variant="error">{l.statusDeclined}</Badge>;
    return null;
}

function PerformerRow({
    performer,
    ctx,
    dragHandleProps,
}: {
    performer: LineupPerformer;
    ctx: RowCtx;
    dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}) {
    const {l, readOnly, busy} = ctx;
    return (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-background/55 ring-1 ring-border/40">
            {!readOnly && (
                <button
                    type="button"
                    {...(dragHandleProps ?? {})}
                    aria-label={ctx.l.dragHandle}
                    className="h-11 w-8 sm:h-9 flex items-center justify-center text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing shrink-0 touch-none"
                >
                    <GripVertical className="h-4 w-4"/>
                </button>
            )}
            <Avatar src={performer.avatarUrl} name={performer.name} size={40}/>
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-semibold truncate">{performer.name}</span>
                    {statusBadge(l, performer.status)}
                </div>
                {performer.subtitle && (
                    <div className="text-xs text-muted-foreground truncate">{performer.subtitle}</div>
                )}
                {performer.tags && performer.tags.length > 0 && (
                    <div className="mt-0.5 flex flex-wrap gap-1">
                        {performer.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-muted px-1.5 py-0.5 text-3xs text-muted-foreground">{tag}</span>
                        ))}
                    </div>
                )}
                {ctx.extra}
            </div>
            {!readOnly && (
                <div className="flex items-center shrink-0">
                    <div className="flex flex-col">
                        <button type="button" aria-label={l.moveUp} disabled={busy || !ctx.canMoveUp} onClick={ctx.onMoveUp}
                                className="h-6 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30">
                            <ChevronUp className="h-3.5 w-3.5"/>
                        </button>
                        <button type="button" aria-label={l.moveDown} disabled={busy || !ctx.canMoveDown} onClick={ctx.onMoveDown}
                                className="h-6 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30">
                            <ChevronDown className="h-3.5 w-3.5"/>
                        </button>
                    </div>
                    {ctx.onEdit && (
                        <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8" onClick={ctx.onEdit} disabled={busy} aria-label={l.editPerformer}>
                            <Pencil className="h-3.5 w-3.5"/>
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive" onClick={ctx.onRemove} disabled={busy} aria-label={l.removePerformer}>
                        <Trash2 className="h-3.5 w-3.5"/>
                    </Button>
                </div>
            )}
        </div>
    );
}

function SortablePerformer({performer, ctx, disabled}: {performer: LineupPerformer; ctx: RowCtx; disabled: boolean}) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: performer.id,
        disabled,
    });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };
    return (
        <div ref={setNodeRef} style={style}>
            <PerformerRow performer={performer} ctx={ctx} dragHandleProps={disabled ? undefined : {...attributes, ...listeners}}/>
        </div>
    );
}

function DroppableZone({id, children, className}: {id: string; children: React.ReactNode; className?: string}) {
    const {setNodeRef, isOver} = useDroppable({id});
    return (
        <div ref={setNodeRef} className={cn(className, isOver && 'ring-2 ring-brand-base/50 rounded-2xl')}>
            {children}
        </div>
    );
}

// ── add-performer panel (async search + free-text) ──────────
function AddPerformerPanel({
    l,
    capabilities,
    searchPerformers,
    onAdd,
    onCancel,
    busy,
}: {
    l: LineupBoardLabels;
    capabilities: LineupCapabilities;
    searchPerformers: (query: string) => Promise<PerformerPick[]>;
    onAdd: (pick: PerformerPick) => void;
    onCancel: () => void;
    busy: boolean;
}) {
    const [options, setOptions] = React.useState<SmartSelectOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const picks = React.useRef(new Map<string, PerformerPick>());
    const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const seq = React.useRef(0);

    const runSearch = React.useCallback((q: string) => {
        const query = q.trim();
        if (query.length < 2) {
            setOptions([]);
            setLoading(false);
            return;
        }
        const mine = ++seq.current;
        setLoading(true);
        searchPerformers(query)
            .then((res) => {
                if (mine !== seq.current) return; // stale response
                const map = new Map<string, PerformerPick>();
                const opts = res.map((p) => {
                    const value = p.id ?? `name::${p.name}`;
                    map.set(value, p);
                    return {value, label: p.name, meta: p.subtitle ?? undefined, image: p.avatarUrl ?? undefined};
                });
                picks.current = map;
                setOptions(opts);
            })
            .catch(() => {
                if (mine === seq.current) setOptions([]);
            })
            .finally(() => {
                if (mine === seq.current) setLoading(false);
            });
    }, [searchPerformers]);

    const onQueryChange = (q: string) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => runSearch(q), 250);
    };
    React.useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const handleChange = (v: string | string[] | null) => {
        if (typeof v !== 'string' || !v) return;
        onAdd(picks.current.get(v) ?? {name: v});
    };

    return (
        <div className="p-2 rounded-xl border border-border/50 bg-muted/15 space-y-2">
            <SmartSelect
                options={options}
                value={null}
                onChange={handleChange}
                onQueryChange={onQueryChange}
                allowCreate={capabilities.performerFreeText}
                filterOption={() => true}
                disabled={busy}
                placeholder={l.searchPerformers}
                labels={{search: l.searchPerformers, empty: loading ? l.searching : l.noResults}}
            />
            <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={onCancel}>{l.cancel}</Button>
            </div>
        </div>
    );
}

// ── slot editor ─────────────────────────────────────────────
function SlotEditor({
    slot,
    l,
    capabilities,
    busy,
    onSave,
    onCancel,
    toLocal,
    toInstant,
}: {
    slot: LineupSlot;
    l: LineupBoardLabels;
    capabilities: LineupCapabilities;
    busy: boolean;
    onSave: (patch: Partial<Pick<LineupSlot, 'title' | 'stage' | 'startsAt' | 'endsAt' | 'note'>>) => void;
    onCancel: () => void;
    toLocal: (iso: string | null) => string;
    toInstant: (local: string) => string | null;
}) {
    const [title, setTitle] = React.useState(slot.title ?? '');
    const [stage, setStage] = React.useState(slot.stage ?? '');
    const [start, setStart] = React.useState(toLocal(slot.startsAt));
    const [end, setEnd] = React.useState(toLocal(slot.endsAt));
    const [note, setNote] = React.useState(slot.note ?? '');

    return (
        <div className="p-3 space-y-3 bg-muted/15 rounded-xl border border-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label className="text-2xs text-muted-foreground" htmlFor={`slot-title-${slot.id}`}>{l.slotTitle}</Label>
                    <Input id={`slot-title-${slot.id}`} value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="space-y-1">
                    <Label className="text-2xs text-muted-foreground" htmlFor={`slot-stage-${slot.id}`}>{l.stage}</Label>
                    <Input id={`slot-stage-${slot.id}`} value={stage} onChange={(e) => setStage(e.target.value)}/>
                </div>
            </div>
            {capabilities.editableTimes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-2xs text-muted-foreground" htmlFor={`slot-start-${slot.id}`}>{l.startTime}</Label>
                        <DateTimePicker id={`slot-start-${slot.id}`} value={start} onChange={setStart}/>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-2xs text-muted-foreground" htmlFor={`slot-end-${slot.id}`}>{l.endTime}</Label>
                        <DateTimePicker id={`slot-end-${slot.id}`} value={end} onChange={setEnd} min={start || undefined}/>
                    </div>
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">{l.timesReadOnly}</p>
            )}
            <div className="space-y-1">
                <Label className="text-2xs text-muted-foreground" htmlFor={`slot-note-${slot.id}`}>{l.note}</Label>
                <Textarea id={`slot-note-${slot.id}`} value={note} onChange={(e) => setNote(e.target.value)} rows={2}/>
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={onCancel}>{l.cancel}</Button>
                <Button
                    size="sm"
                    disabled={busy}
                    onClick={() => onSave({
                        title: title.trim() || null,
                        stage: stage.trim() || null,
                        note: note.trim() || null,
                        ...(capabilities.editableTimes ? {startsAt: toInstant(start), endsAt: toInstant(end)} : {}),
                    })}
                >
                    {l.save}
                </Button>
            </div>
        </div>
    );
}

// ── main ────────────────────────────────────────────────────
type PendingRemoval = {kind: 'slot'; id: string} | {kind: 'performer'; slotId: string; performerId: string};

export function LineupBoard(props: LineupBoardProps) {
    const {
        slots,
        unscheduled = [],
        eventStartsAt,
        timezone: tz,
        capabilities,
        readOnly = false,
        busy = false,
        onReorderSlots,
        onUpdateSlot,
        onAddSlot,
        onRemoveSlot,
        onGenerateSlots,
        onMovePerformer,
        onAddPerformer,
        onRemovePerformer,
        onEditPerformer,
        searchPerformers,
        renderPerformerExtra,
    } = props;
    const l = React.useMemo(() => ({...lineupBoardDefaultLabels, ...props.labels}), [props.labels]);

    const inZone = React.useCallback((iso: string) => {
        const d = dayjs.utc(iso);
        try {
            return d.tz(tz);
        } catch {
            return d;
        }
    }, [tz]);

    const toLocal = React.useCallback((iso: string | null) => {
        if (!iso) return '';
        const d = dayjs.utc(iso);
        if (!d.isValid()) return '';
        return inZone(iso).format('YYYY-MM-DDTHH:mm');
    }, [inZone]);

    const toInstant = React.useCallback((local: string): string | null => {
        if (!local) return null;
        try {
            const d = dayjs.tz(local, tz);
            return d.isValid() ? d.toISOString() : null;
        } catch {
            const d = dayjs(local);
            return d.isValid() ? d.toISOString() : null;
        }
    }, [tz]);

    const fmtRange = React.useCallback((slot: LineupSlot) => {
        if (!slot.startsAt) return l.noTime;
        const s = inZone(slot.startsAt);
        const start = s.format('MMM D, HH:mm');
        const end = slot.endsAt ? ` - ${inZone(slot.endsAt).format('HH:mm')}` : '';
        return `${start}${end}`;
    }, [inZone, l]);

    const ordered = React.useMemo(() => sortSlots(slots), [slots]);
    const report = React.useMemo(() => detectIssues(ordered, capabilities), [ordered, capabilities]);
    const hasGaps = React.useMemo(
        () => Object.values(report.bySlot).some((issues) => issues.some((i) => i.kind === 'gap')),
        [report],
    );
    const totalPerformers = ordered.reduce((n, s) => n + s.performers.length, 0) + unscheduled.length;
    const atMaxSlots = capabilities.maxSlots != null && ordered.length >= capabilities.maxSlots;

    const [editingSlotId, setEditingSlotId] = React.useState<string | null>(null);
    const [addingToSlot, setAddingToSlot] = React.useState<string | null>(null);
    const [pending, setPending] = React.useState<PendingRemoval | null>(null);
    const [genCount, setGenCount] = React.useState(4);
    const [genLength, setGenLength] = React.useState(60);

    // ── dnd ──
    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 6}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
    );
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const locate = React.useCallback((perfId: string): {slotId: string | null; index: number} | null => {
        for (const s of ordered) {
            const i = s.performers.findIndex((p) => p.id === perfId);
            if (i >= 0) return {slotId: s.id, index: i};
        }
        const ui = unscheduled.findIndex((p) => p.id === perfId);
        return ui >= 0 ? {slotId: null, index: ui} : null;
    }, [ordered, unscheduled]);

    const activePerformer = activeId
        ? (ordered.flatMap((s) => s.performers).concat(unscheduled)).find((p) => p.id === activeId) ?? null
        : null;

    const collision: CollisionDetection = React.useCallback((args) => {
        const p = pointerWithin(args);
        if (p.length > 0) return p;
        const r = rectIntersection(args);
        if (r.length > 0) return r;
        const f = getFirstCollision(closestCenter(args));
        return f ? [f] : [];
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        setActiveId(null);
        if (!over) return;
        const activeKey = String(active.id);
        const overKey = String(over.id);
        if (activeKey === overKey) return;
        const from = locate(activeKey);
        if (!from) return;

        let toSlotId: string | null;
        let toIndex: number | undefined;
        if (overKey === 'unscheduled') {
            toSlotId = null;
            toIndex = undefined;
        } else if (overKey.startsWith('slot::')) {
            toSlotId = overKey.slice('slot::'.length);
            toIndex = undefined;
        } else {
            const overLoc = locate(overKey);
            if (!overLoc) return;
            toSlotId = overLoc.slotId;
            toIndex = overLoc.index;
        }
        onMovePerformer({performerId: activeKey, fromSlotId: from.slotId, toSlotId, toIndex});
    };

    const rowCtx = (performer: LineupPerformer, slot: LineupSlot | null, index: number, list: LineupPerformer[]): RowCtx => {
        const slotId = slot ? slot.id : null;
        return {
            l,
            readOnly,
            busy,
            canMoveUp: index > 0,
            canMoveDown: index < list.length - 1,
            onMoveUp: () => onMovePerformer({performerId: performer.id, fromSlotId: slotId, toSlotId: slotId, toIndex: index - 1}),
            onMoveDown: () => onMovePerformer({performerId: performer.id, fromSlotId: slotId, toSlotId: slotId, toIndex: index + 1}),
            onEdit: onEditPerformer && slot ? () => onEditPerformer(slot.id, performer.id) : undefined,
            onRemove: () => setPending(slot
                ? {kind: 'performer', slotId: slot.id, performerId: performer.id}
                : {kind: 'performer', slotId: '', performerId: performer.id}),
            extra: slot && renderPerformerExtra ? renderPerformerExtra(performer, slot) : undefined,
        };
    };

    const dndDisabled = readOnly || busy;

    return (
        <section className="space-y-3" data-testid="lineup-board">
            {/* header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    {l.title}
                    {ordered.length > 0 && <Badge variant="outline" className="text-2xs">{l.slotCount(ordered.length)}</Badge>}
                    {totalPerformers > 0 && <Badge variant="outline" className="text-2xs">{l.performerCount(totalPerformers)}</Badge>}
                </h3>
                {!readOnly && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        disabled={busy || atMaxSlots}
                        onClick={() => onAddSlot()}
                        aria-label={l.addSlot}
                    >
                        <Plus className="h-3.5 w-3.5 mr-1"/>{l.addSlot}
                    </Button>
                )}
            </div>

            {/* board-level issues + contiguous action */}
            {(report.board.length > 0 || (!capabilities.gapsAllowed && hasGaps)) && (
                <div className="flex flex-wrap items-center gap-2">
                    {report.board.map((issue, i) => (
                        <Badge key={i} variant={ISSUE_VARIANT[issue.kind]} className="text-2xs">
                            <AlertTriangle className="h-3 w-3 mr-1"/>{issue.message}
                        </Badge>
                    ))}
                    {!readOnly && !capabilities.gapsAllowed && hasGaps && (
                        <Button type="button" variant="warn" size="sm" className="text-xs" disabled={busy} onClick={() => onReorderSlots(layContiguous(ordered))}>
                            {l.makeContiguous}
                        </Button>
                    )}
                </div>
            )}

            {/* generator */}
            {!readOnly && onGenerateSlots && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-lg border border-dashed border-border/60 bg-muted/20 p-3">
                    <div className="space-y-1">
                        <Label htmlFor="lineup-gen-count" className="text-2xs">{l.slotsField}</Label>
                        <Input id="lineup-gen-count" type="number" min={1} max={50} value={genCount}
                               onChange={(e) => setGenCount(parseInt(e.target.value, 10) || 1)}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="lineup-gen-length" className="text-2xs">{l.lengthField}</Label>
                        <Input id="lineup-gen-length" type="number" min={5} max={480} step={5} value={genLength}
                               onChange={(e) => setGenLength(parseInt(e.target.value, 10) || 30)}/>
                    </div>
                    <div className="flex items-end">
                        <Button type="button" className="w-full" disabled={busy || !eventStartsAt}
                                onClick={() => onGenerateSlots({count: genCount, lengthMinutes: genLength})}>
                            <Sparkles className="h-4 w-4 mr-1"/>{ordered.length > 0 ? l.regenerate : l.generate}
                        </Button>
                    </div>
                </div>
            )}
            {!readOnly && onGenerateSlots && !eventStartsAt && (
                <p className="text-xs text-brand-amber">{l.setStartHint}</p>
            )}

            {ordered.length === 0 && unscheduled.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-muted/10 py-6 text-center">
                    <p className="text-sm text-muted-foreground">{l.emptyBoard}</p>
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={collision}
                onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
            >
                <div className="space-y-2">
                    {ordered.map((slot, slotIndex) => {
                        const issues = [...(report.bySlot[slot.id] ?? []), ...(slot.issues ?? [])];
                        const dur = slotDurationMinutes(slot);
                        const singleFull = !capabilities.multiplePerformersPerSlot && slot.performers.length >= 1;
                        return (
                            <DroppableZone key={slot.id} id={`slot::${slot.id}`}>
                                <div className="rounded-2xl bg-card/55 ring-1 ring-border/40 overflow-hidden" data-testid={`lineup-slot-${slotIndex}`}>
                                    {/* slot header */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 bg-muted/20 border-b border-border/35">
                                        <Badge variant="outline" className="text-2xs font-mono">{l.slotLabel(slot.order)}</Badge>
                                        <span className="text-xs text-muted-foreground tabular-nums">{fmtRange(slot)}</span>
                                        {dur > 0 && <span className="text-2xs text-muted-foreground/70">{l.minutesShort(dur)}</span>}
                                        {(slot.title || slot.stage) && (
                                            <span className="text-xs text-muted-foreground truncate">
                                                {slot.title}{slot.title && slot.stage ? ' · ' : ''}{slot.stage}
                                            </span>
                                        )}
                                        <div className="flex-1"/>
                                        {!readOnly && (
                                            <div className="flex items-center">
                                                <div className="flex flex-col">
                                                    <button type="button" aria-label={l.moveUp} disabled={busy || slotIndex === 0}
                                                            onClick={() => onReorderSlots(reorderSlots(ordered, slotIndex, slotIndex - 1))}
                                                            className="h-6 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30">
                                                        <ChevronUp className="h-3.5 w-3.5"/>
                                                    </button>
                                                    <button type="button" aria-label={l.moveDown} disabled={busy || slotIndex === ordered.length - 1}
                                                            onClick={() => onReorderSlots(reorderSlots(ordered, slotIndex, slotIndex + 1))}
                                                            className="h-6 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30">
                                                        <ChevronDown className="h-3.5 w-3.5"/>
                                                    </button>
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8"
                                                        onClick={() => setEditingSlotId((cur) => (cur === slot.id ? null : slot.id))} aria-label={l.editSlot}>
                                                    <Pencil className="h-3.5 w-3.5"/>
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => setPending({kind: 'slot', id: slot.id})} disabled={busy} aria-label={l.removeSlot}>
                                                    <Trash2 className="h-3.5 w-3.5"/>
                                                </Button>
                                                {!singleFull && (
                                                    <Button type="button" variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8 text-primary"
                                                            onClick={() => setAddingToSlot((cur) => (cur === slot.id ? null : slot.id))} aria-label={l.addPerformer}>
                                                        <UserPlus className="h-3.5 w-3.5"/>
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* per-slot issues */}
                                    {issues.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 px-3 py-1.5 border-b border-border/25">
                                            {issues.map((issue, i) => (
                                                <Badge key={i} variant={ISSUE_VARIANT[issue.kind]} className="text-3xs">{issue.message}</Badge>
                                            ))}
                                        </div>
                                    )}

                                    {editingSlotId === slot.id && !readOnly && (
                                        <div className="p-2">
                                            <SlotEditor
                                                slot={slot}
                                                l={l}
                                                capabilities={capabilities}
                                                busy={busy}
                                                toLocal={toLocal}
                                                toInstant={toInstant}
                                                onCancel={() => setEditingSlotId(null)}
                                                onSave={(patch) => {
                                                    onUpdateSlot(slot.id, patch);
                                                    setEditingSlotId(null);
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* performers */}
                                    <div className="p-2 space-y-1">
                                        <SortableContext items={slot.performers.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                                            {slot.performers.map((p, i) => (
                                                <SortablePerformer key={p.id} performer={p} disabled={dndDisabled}
                                                                   ctx={rowCtx(p, slot, i, slot.performers)}/>
                                            ))}
                                        </SortableContext>
                                        {slot.performers.length === 0 && addingToSlot !== slot.id && (
                                            <p className="text-xs text-muted-foreground/70 italic px-1 py-1.5">{l.dragToSchedule}</p>
                                        )}
                                        {singleFull && addingToSlot !== slot.id && (
                                            <p className="text-3xs text-muted-foreground/70 px-1">{l.singlePerformerHint}</p>
                                        )}
                                        {addingToSlot === slot.id && !readOnly && (
                                            <AddPerformerPanel
                                                l={l}
                                                capabilities={capabilities}
                                                searchPerformers={searchPerformers}
                                                busy={busy}
                                                onCancel={() => setAddingToSlot(null)}
                                                onAdd={(pick) => {
                                                    onAddPerformer(slot.id, pick);
                                                    setAddingToSlot(null);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </DroppableZone>
                        );
                    })}
                </div>

                {/* unscheduled tray */}
                {(unscheduled.length > 0 || !readOnly) && (
                    <DroppableZone id="unscheduled" className="mt-2">
                        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 overflow-hidden" data-testid="lineup-unscheduled">
                            <div className="px-3 py-2 border-b border-border/35 flex items-center gap-2">
                                <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">{l.unscheduled}</span>
                                <Badge variant="outline" className="text-3xs">{unscheduled.length}</Badge>
                                <span className="text-3xs text-muted-foreground/70">{l.dragToSchedule}</span>
                            </div>
                            <div className="p-2 space-y-1 min-h-11">
                                <SortableContext items={unscheduled.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                                    {unscheduled.map((p, i) => (
                                        <SortablePerformer key={p.id} performer={p} disabled={dndDisabled}
                                                           ctx={rowCtx(p, null, i, unscheduled)}/>
                                    ))}
                                </SortableContext>
                            </div>
                        </div>
                    </DroppableZone>
                )}

                <DragOverlay dropAnimation={null}>
                    {activePerformer ? (
                        <div className="rounded-xl bg-card/95 ring-2 ring-brand-base px-3 py-2 flex items-center gap-2">
                            <Avatar src={activePerformer.avatarUrl} name={activePerformer.name} size={28}/>
                            <span className="text-sm font-semibold">{activePerformer.name}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <ConfirmDialog
                isOpen={pending !== null}
                title={pending?.kind === 'slot' ? l.confirmRemoveSlotTitle : l.confirmRemovePerformerTitle}
                message={pending?.kind === 'slot' ? l.confirmRemoveSlotMessage : l.confirmRemovePerformerMessage}
                confirmText={l.remove}
                cancelText={l.cancel}
                type="danger"
                onCancel={() => setPending(null)}
                onConfirm={() => {
                    if (pending?.kind === 'slot') onRemoveSlot(pending.id);
                    else if (pending?.kind === 'performer') onRemovePerformer(pending.slotId, pending.performerId);
                    setPending(null);
                }}
            />
        </section>
    );
}
