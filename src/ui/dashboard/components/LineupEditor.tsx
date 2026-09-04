// Reusable lineup/slot editor for the extension, built on the kit `LineupBoard`.
// Edits core `Slot[]` for one or more target platforms; resolves performers by
// name through each platform's adapter search. The board is fully controlled
// from `value` (re-derived via toBoard each render); only the unscheduled tray
// is editor-local. Every board callback runs a kit pure helper and emits
// onChange(fromBoard(...)). The P6.2 event editor embeds this.
import { useMemo, useRef, useState } from 'react';
import {
  LineupBoard,
  lineupBoardDefaultLabels,
  generateSlots,
  movePerformer,
  type LineupPerformer,
  type LineupSlot,
  type MovePerformer,
  type PerformerPick,
} from '@rave-page/ui';
// reorderSlots + layContiguous run inside LineupBoard; their results arrive via onReorderSlots.
import type { IanaZone, IsoUtc, Performer, Slot } from '../../../core/schema';
import type { Platform } from '../../../shared/agent-protocol';
import { addMinutes } from '../../../core/time';
import { capsFor, DEFAULT_SLOT_MINUTES, fromBoard, nextSlotStart, pickToPerformer, toBoard } from '../../lib/lineup-bridge';
import { createPerformerSearch } from '../lib/performer-search';

type SlotPatch = Partial<Pick<LineupSlot, 'title' | 'stage' | 'startsAt' | 'endsAt' | 'note'>>;

export interface LineupEditorProps {
  value: Slot[];
  onChange: (next: Slot[]) => void;
  eventStart: IsoUtc | null;
  zone: IanaZone;
  targets: Platform[];
  readOnly?: boolean;
  busy?: boolean;
  searchPerformers?: (query: string) => Promise<PerformerPick[]>;
}

export function LineupEditor(props: LineupEditorProps): React.JSX.Element {
  const { value, onChange, eventStart, zone, targets, readOnly = false, busy = false, searchPerformers } = props;

  const { slots, byRow } = useMemo(() => toBoard(value), [value]);
  const capabilities = useMemo(() => capsFor(targets), [targets]);
  const controller = useMemo(() => createPerformerSearch(targets), [targets]);
  const search = searchPerformers ?? controller.search;
  const resolvePick = searchPerformers ? undefined : controller.resolve;

  const [unscheduled, setUnscheduled] = useState<LineupPerformer[]>([]);
  const trayById = useRef<Map<string, Performer>>(new Map());
  const seq = useRef(0);
  const nextId = (): number => seq.current++;

  const withTray = (): Map<string, Performer> => new Map<string, Performer>([...byRow, ...trayById.current]);
  const emit = (next: LineupSlot[], map: Map<string, Performer>): void => onChange(fromBoard(next, map, value));

  const onReorderSlots = (next: LineupSlot[]): void => emit(next, byRow);

  const onUpdateSlot = (id: string, patch: SlotPatch): void => {
    emit(slots.map((s) => (s.id === id ? { ...s, ...patch } : s)), byRow);
  };

  const onAddSlot = (): void => {
    const startsAt = nextSlotStart(slots, eventStart);
    const slot: LineupSlot = {
      id: `s-new-${nextId()}`,
      order: slots.length,
      title: null,
      startsAt,
      endsAt: addMinutes(startsAt, DEFAULT_SLOT_MINUTES),
      performers: [],
    };
    emit([...slots, slot], byRow);
  };

  const onRemoveSlot = (id: string): void => emit(slots.filter((s) => s.id !== id), byRow);

  const onGenerateSlots = (input: { count: number; lengthMinutes: number }): void => {
    emit(generateSlots({ startsAt: eventStart, count: input.count, lengthMinutes: input.lengthMinutes, timezone: zone }), byRow);
  };

  const onMovePerformer = (move: MovePerformer): void => {
    const map = withTray();
    const { slots: next, unscheduled: tray } = movePerformer(slots, move, unscheduled);
    // re-id tray members into their own namespace so regenerated slot row ids
    // can never collide with a parked performer; keep the resolved Performer.
    const nextTrayById = new Map<string, Performer>();
    const nextTray = tray.map((m) => {
      const perf = map.get(m.id) ?? { name: m.name, aliases: [] };
      const id = m.id.startsWith('tray:') ? m.id : `tray:${nextId()}`;
      nextTrayById.set(id, perf);
      return { ...m, id };
    });
    trayById.current = nextTrayById;
    setUnscheduled(nextTray);
    emit(next, map);
  };

  const onAddPerformer = (slotId: string, pick: PerformerPick): void => {
    const performer = resolvePick?.(pick.id) ?? pickToPerformer(pick, targets[0]);
    const rowId = `${slotId}:add-${nextId()}`;
    const next = slots.map((s) => (s.id === slotId ? { ...s, performers: [...s.performers, { id: rowId, name: performer.name }] } : s));
    const map = withTray();
    map.set(rowId, performer);
    emit(next, map);
  };

  const onRemovePerformer = (slotId: string, performerId: string): void => {
    if (slotId === '') {
      // unscheduled tray removal — the tray is editor-local, not part of core.
      trayById.current.delete(performerId);
      setUnscheduled((cur) => cur.filter((p) => p.id !== performerId));
      return;
    }
    emit(slots.map((s) => (s.id === slotId ? { ...s, performers: s.performers.filter((p) => p.id !== performerId) } : s)), byRow);
  };

  return (
    <LineupBoard
      slots={slots}
      unscheduled={unscheduled}
      eventStartsAt={eventStart}
      timezone={zone}
      capabilities={capabilities}
      labels={lineupBoardDefaultLabels}
      readOnly={readOnly}
      busy={busy}
      onReorderSlots={onReorderSlots}
      onUpdateSlot={onUpdateSlot}
      onAddSlot={onAddSlot}
      onRemoveSlot={onRemoveSlot}
      onGenerateSlots={onGenerateSlots}
      onMovePerformer={onMovePerformer}
      onAddPerformer={onAddPerformer}
      onRemovePerformer={onRemovePerformer}
      searchPerformers={search}
    />
  );
}
