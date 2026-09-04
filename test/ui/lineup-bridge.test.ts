import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { LineupSlot } from '@rave-page/ui';
import { asIsoUtc } from '../../src/core/time';
import type { Performer, Slot } from '../../src/core/schema';
import { capsFor, fromBoard, toBoard } from '../../src/ui/lib/lineup-bridge';

const sample = JSON.parse(readFileSync(join(process.cwd(), 'test', 'fixtures', 'core', 'lineup-sample.json'), 'utf8')) as { lineup: Slot[] };
const LINEUP: Slot[] = sample.lineup;

describe('lineup-bridge', () => {
  it('round-trips sanitized fixtures through the board and back', () => {
    const { slots, byRow } = toBoard(LINEUP);
    expect(fromBoard(slots, byRow, LINEUP)).toEqual(LINEUP);
  });

  it('assigns board-unique row ids even when one DJ holds two slots', () => {
    const dj: Performer = { name: 'Example DJ 1', aliases: [] };
    const lineup: Slot[] = [
      { order: 1, start: asIsoUtc('2026-09-10T20:00:00.000Z'), performers: [dj, dj], dancers: [] },
      { order: 2, start: asIsoUtc('2026-09-10T21:00:00.000Z'), performers: [dj], dancers: [] },
    ];
    const { slots } = toBoard(lineup);
    const ids = slots.flatMap((s) => s.performers.map((p) => p.id));
    expect(ids).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
  });

  it('derives performer subtitle from alias platform display names (never raw ids)', () => {
    const { byRow } = toBoard(LINEUP);
    const first = toBoard(LINEUP).slots[0]?.performers[0];
    expect(first?.subtitle).toBe('vrc.tl · vrcpop.com');
    // the stored Performer keeps its aliases; the subtitle exposes only names
    expect(byRow.get(first?.id ?? '')?.aliases.length).toBe(2);
  });

  it('capsFor intersects gapsAllowed across targets; empty is most permissive', () => {
    expect(capsFor(['vrctl']).gapsAllowed).toBe(false);
    expect(capsFor(['ravepage']).gapsAllowed).toBe(true);
    expect(capsFor(['vrctl', 'ravepage']).gapsAllowed).toBe(false);
    expect(capsFor([]).gapsAllowed).toBe(true);
    expect(capsFor([]).multiplePerformersPerSlot).toBe(true);
    const caps = capsFor(['vrctl']);
    expect(caps.overlapsAllowed).toBe(false);
    expect(caps.editableTimes).toBe(true);
    expect(caps.performerFreeText).toBe(true);
    expect(caps.maxSlots).toBeUndefined();
  });

  it('treats an unknown row id as a free-text add ({name, aliases: []})', () => {
    const { slots, byRow } = toBoard(LINEUP);
    const withFree: LineupSlot[] = slots.map((s, i) =>
      i === 0 ? { ...s, performers: [...s.performers, { id: 'free-typed', name: 'Typed Name' }] } : s,
    );
    const core = fromBoard(withFree, byRow, LINEUP);
    const added = core[0]?.performers.find((p) => p.name === 'Typed Name');
    expect(added).toEqual({ name: 'Typed Name', aliases: [] });
  });

  it('carries board-untouched fields through a slot reorder (matched by slot id)', () => {
    const { slots, byRow } = toBoard(LINEUP);
    // simulate the kit reorderSlots(0->1): move slot 1 down, renumber order 0..n-1
    const reordered: LineupSlot[] = [slots[1], slots[0], slots[2]]
      .filter((s): s is LineupSlot => s !== undefined)
      .map((s, i) => ({ ...s, order: i }));
    const core = fromBoard(reordered, byRow, LINEUP);
    const opening = core.find((s) => s.title === 'Opening');
    expect(opening?.order).toBe(2); // now the second slot
    expect(opening?.genre).toBe('Techno');
    expect(opening?.energy).toBe('High');
    expect(opening?.vj?.name).toBe('Example VJ');
    expect(opening?.dancers[0]?.name).toBe('Example Dancer');
    expect(opening?.publicNote).toBe('Doors at 8');
    expect(opening?.privateNote).toBe('Backstage code 42');
  });
});
