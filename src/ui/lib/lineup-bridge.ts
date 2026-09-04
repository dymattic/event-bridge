// Pure mapping between core `Slot[]` and the kit `LineupBoard` model. Node-
// testable: only type-only imports from @rave-page/ui, no React/DOM/webext.
//
// Row + slot ids are ASSIGNMENT ids (position-derived), never the performer
// identity — one DJ can hold two slots, so each row needs a board-unique id.
// Board-editable fields (order/start/end/title/note/performers) round-trip
// through the board; everything else (vj/dancers/genre/energy/public+private
// note) is carried from the matching previous slot, keyed by the stable slot id.
import type { IsoUtc, Performer, Slot } from '../../core/schema';
import type { Platform } from '../../shared/agent-protocol';
import { asIsoUtc } from '../../core/time';
import { CAPS } from '../../core/capabilities';
import type { LineupCapabilities, LineupPerformer, LineupSlot, PerformerPick } from '@rave-page/ui';
import { PLATFORM_NAME, PLATFORM_ORDER } from './platform-meta';

// Stable slot id from the 1-based core order (survives reorder: reorderSlots
// keeps the id, only renumbers `order`). fromBoard matches `previous` by it.
function slotKey(order: number): string {
  return `s${order}`;
}

// Alias-platform hint via display names, fixed order, deduped. null when none.
function aliasHint(performer: Performer): string | null {
  const names = PLATFORM_ORDER.filter((pl) => performer.aliases.some((a) => a.platform === pl)).map((pl) => PLATFORM_NAME[pl]);
  return names.length ? names.join(' · ') : null;
}

export interface BoardModel {
  slots: LineupSlot[];
  byRow: Map<string, Performer>;
}

// core slots -> kit slots + a row-id -> Performer map (for fromBoard).
export function toBoard(lineup: Slot[]): BoardModel {
  const byRow = new Map<string, Performer>();
  const slots: LineupSlot[] = lineup.map((slot) => {
    const id = slotKey(slot.order);
    const performers: LineupPerformer[] = slot.performers.map((p, i) => {
      const rowId = `${id}:p${i}`;
      byRow.set(rowId, p);
      return { id: rowId, name: p.name, subtitle: aliasHint(p) };
    });
    return {
      id,
      order: slot.order - 1,
      title: slot.title ?? null,
      startsAt: slot.start,
      endsAt: slot.end ?? null,
      note: slot.notes ?? null,
      performers,
    };
  });
  return { slots, byRow };
}

// kit slots -> core slots. Unknown row id = free-text add ({name, aliases:[]}).
// Non-board fields carried from the previous slot matched by id.
export function fromBoard(slots: LineupSlot[], byRow: Map<string, Performer>, previous: Slot[]): Slot[] {
  const prevById = new Map<string, Slot>(previous.map((s) => [slotKey(s.order), s]));
  return slots.map((bs) => {
    const prev = prevById.get(bs.id);
    const performers: Performer[] = bs.performers.map((p) => byRow.get(p.id) ?? { name: p.name, aliases: [] });
    const startIso = bs.startsAt ?? prev?.start ?? null;
    if (!startIso) throw new Error(`lineup slot ${bs.id} has no start`);
    const out: Slot = {
      order: bs.order + 1,
      start: asIsoUtc(startIso),
      performers,
      dancers: prev?.dancers ?? [],
    };
    if (bs.endsAt) out.end = asIsoUtc(bs.endsAt);
    if (bs.title) out.title = bs.title;
    if (bs.note) out.notes = bs.note;
    // carried (board never touches these)
    if (prev?.vj) out.vj = prev.vj;
    if (prev?.genre !== undefined) out.genre = prev.genre;
    if (prev?.energy !== undefined) out.energy = prev.energy;
    if (prev?.publicNote !== undefined) out.publicNote = prev.publicNote;
    if (prev?.privateNote !== undefined) out.privateNote = prev.privateNote;
    return out;
  });
}

// Board capabilities intersected across target platforms. Empty -> permissive.
export function capsFor(targets: Platform[]): LineupCapabilities {
  return {
    multiplePerformersPerSlot: targets.every((p) => CAPS[p].b2b),
    gapsAllowed: targets.every((p) => CAPS[p].slotGaps),
    overlapsAllowed: false,
    editableTimes: true,
    performerFreeText: true,
    maxSlots: undefined,
  };
}

// A search/free-text pick -> a core Performer. id + platform -> one alias.
export function pickToPerformer(pick: PerformerPick, platform?: Platform): Performer {
  const aliases = pick.id && platform ? [{ platform, id: pick.id, name: pick.name }] : [];
  return { name: pick.name, aliases };
}

// Anchor for a freshly added slot: after the last slot, else eventStart, else now.
export function nextSlotStart(slots: LineupSlot[], eventStart: IsoUtc | null): string {
  const timed = slots.filter((s) => s.startsAt);
  const last = timed[timed.length - 1];
  return last?.endsAt ?? last?.startsAt ?? eventStart ?? new Date().toISOString();
}
