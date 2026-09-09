// Pure lineup helpers - no React, no DOM. Node-testable
// (`node --experimental-strip-types --test`). All time math is UTC-instant
// based: parse ISO with dayjs.utc, emit ISO ("…Z") via toISOString. No locale
// mutation. `timezone` inputs are display hints and never shift an instant.
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import type {LineupSlot, LineupPerformer, LineupCapabilities, LineupIssue} from './lineup-types';

dayjs.extend(utc);

const parse = (iso: string | null | undefined) => {
    if (!iso) return null;
    const d = dayjs.utc(iso);
    return d.isValid() ? d : null;
};

export interface MovePerformer {
    performerId: string;
    /** null = coming from the unscheduled tray. */
    fromSlotId: string | null;
    /** null = going to the unscheduled tray. */
    toSlotId: string | null;
    /** insert position in target list; appended when omitted. */
    toIndex?: number;
}

export interface GenerateSlotsInput {
    startsAt: string | null;
    count: number;
    lengthMinutes: number;
    /** IANA tz - display hint only, does not shift the emitted instants. */
    timezone?: string;
}

export interface LineupIssueReport {
    bySlot: Record<string, LineupIssue[]>;
    board: LineupIssue[];
}

/** Minutes between a slot's start and end (0 if untimed/invalid/negative). */
export function slotDurationMinutes(slot: LineupSlot): number {
    const s = parse(slot.startsAt);
    const e = parse(slot.endsAt);
    if (!s || !e) return 0;
    const diff = e.diff(s, 'minute');
    return diff > 0 ? diff : 0;
}

/** Copy sorted by `order` ascending. */
export function sortSlots(slots: LineupSlot[]): LineupSlot[] {
    return [...slots].sort((a, b) => a.order - b.order);
}

/** Move a slot between display positions and renumber `order` 0..n-1. */
export function reorderSlots(slots: LineupSlot[], fromIndex: number, toIndex: number): LineupSlot[] {
    const next = sortSlots(slots);
    const valid = fromIndex >= 0 && fromIndex < next.length
        && toIndex >= 0 && toIndex < next.length && fromIndex !== toIndex;
    if (valid) {
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
    }
    return next.map((s, i) => ({...s, order: i}));
}

/** Move a performer within/between slots and the unscheduled tray. Immutable. */
export function movePerformer(
    slots: LineupSlot[],
    move: MovePerformer,
    unscheduled: LineupPerformer[] = [],
): {slots: LineupSlot[]; unscheduled: LineupPerformer[]} {
    const {performerId, fromSlotId, toSlotId, toIndex} = move;
    const nextSlots = slots.map((s) => ({...s, performers: [...s.performers]}));
    const nextUnscheduled = [...unscheduled];

    const listFor = (slotId: string | null): LineupPerformer[] | undefined =>
        slotId === null ? nextUnscheduled : nextSlots.find((s) => s.id === slotId)?.performers;

    const source = listFor(fromSlotId);
    if (!source) return {slots: nextSlots, unscheduled: nextUnscheduled};
    const idx = source.findIndex((p) => p.id === performerId);
    if (idx < 0) return {slots: nextSlots, unscheduled: nextUnscheduled};
    const [moved] = source.splice(idx, 1);

    const target = listFor(toSlotId);
    if (!target) {
        source.splice(idx, 0, moved); // target gone - restore, lose nothing
        return {slots: nextSlots, unscheduled: nextUnscheduled};
    }
    const at = toIndex == null ? target.length : Math.max(0, Math.min(toIndex, target.length));
    target.splice(at, 0, moved);
    return {slots: nextSlots, unscheduled: nextUnscheduled};
}

/** N contiguous empty slots of `lengthMinutes`, anchored at `startsAt`. */
export function generateSlots(input: GenerateSlotsInput): LineupSlot[] {
    const {startsAt, count, lengthMinutes} = input;
    const base = parse(startsAt);
    if (!base || count <= 0 || lengthMinutes <= 0) return [];
    const out: LineupSlot[] = [];
    for (let i = 0; i < count; i++) {
        out.push({
            id: `slot-${i + 1}`,
            order: i,
            title: null,
            stage: null,
            startsAt: base.add(i * lengthMinutes, 'minute').toISOString(),
            endsAt: base.add((i + 1) * lengthMinutes, 'minute').toISOString(),
            performers: [],
        });
    }
    return out;
}

/** Re-time slots so each starts when the previous ends, keeping durations. */
export function layContiguous(slots: LineupSlot[]): LineupSlot[] {
    const sorted = sortSlots(slots);
    const anchor = sorted.map((s) => parse(s.startsAt)).find((d) => d !== null) ?? null;
    if (!anchor) return sorted;
    let cursor = anchor;
    return sorted.map((slot) => {
        const start = cursor;
        const end = cursor.add(slotDurationMinutes(slot), 'minute');
        cursor = end;
        return {...slot, startsAt: start.toISOString(), endsAt: end.toISOString()};
    });
}

/** Gaps/overlaps/B2B-unsupported per slot + max-slots at board level. */
export function detectIssues(slots: LineupSlot[], caps: LineupCapabilities): LineupIssueReport {
    const bySlot: Record<string, LineupIssue[]> = {};
    const board: LineupIssue[] = [];
    const push = (id: string, issue: LineupIssue) => {
        (bySlot[id] ??= []).push(issue);
    };

    if (!caps.multiplePerformersPerSlot) {
        for (const slot of slots) {
            if (slot.performers.length > 1) {
                push(slot.id, {
                    kind: 'unsupported',
                    message: `Platform allows one performer per slot (has ${slot.performers.length}).`,
                });
            }
        }
    }

    if (!caps.gapsAllowed || !caps.overlapsAllowed) {
        const timed = sortSlots(slots).filter((s) => parse(s.startsAt) && parse(s.endsAt));
        for (let i = 1; i < timed.length; i++) {
            const prev = timed[i - 1];
            const cur = timed[i];
            const diff = parse(cur.startsAt)!.diff(parse(prev.endsAt)!, 'minute');
            if (diff > 0 && !caps.gapsAllowed) {
                push(cur.id, {kind: 'gap', message: `Starts ${diff} min after the previous slot ends.`});
            } else if (diff < 0 && !caps.overlapsAllowed) {
                push(cur.id, {kind: 'overlap', message: `Overlaps the previous slot by ${-diff} min.`});
            }
        }
    }

    if (caps.maxSlots != null && slots.length > caps.maxSlots) {
        board.push({kind: 'warning', message: `Exceeds the ${caps.maxSlots}-slot limit (${slots.length}).`});
    }

    return {bySlot, board};
}

/** Sum of slot durations in minutes. */
export function totalDurationMinutes(slots: LineupSlot[]): number {
    return slots.reduce((sum, s) => sum + slotDurationMinutes(s), 0);
}

/** Shift a slot's start and end by `minutes` (untimed edges left as-is). */
export function shiftSlot(slot: LineupSlot, minutes: number): LineupSlot {
    const s = parse(slot.startsAt);
    const e = parse(slot.endsAt);
    return {
        ...slot,
        startsAt: s ? s.add(minutes, 'minute').toISOString() : slot.startsAt,
        endsAt: e ? e.add(minutes, 'minute').toISOString() : slot.endsAt,
    };
}

/** Set a slot's end to start + `newLengthMinutes` (no-op without a start). */
export function resizeSlot(slot: LineupSlot, newLengthMinutes: number): LineupSlot {
    const s = parse(slot.startsAt);
    if (!s || newLengthMinutes <= 0) return {...slot};
    return {...slot, endsAt: s.add(newLengthMinutes, 'minute').toISOString()};
}
