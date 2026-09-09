// Run: node --experimental-strip-types --test src/events/lineup-math.test.ts
// Pure-helper coverage - no React/DOM. Value imports carry the `.ts` extension
// (Node ESM needs it); type imports are erased by type-stripping.
import assert from 'node:assert/strict';
import {test} from 'node:test';

import {
    reorderSlots,
    movePerformer,
    generateSlots,
    layContiguous,
    detectIssues,
    totalDurationMinutes,
    slotDurationMinutes,
    shiftSlot,
    resizeSlot,
    sortSlots,
} from './lineup-math.ts';
import type {LineupCapabilities, LineupPerformer, LineupSlot} from './lineup-types.ts';

const caps = (over: Partial<LineupCapabilities> = {}): LineupCapabilities => ({
    multiplePerformersPerSlot: true,
    gapsAllowed: true,
    overlapsAllowed: true,
    editableTimes: true,
    performerFreeText: true,
    ...over,
});

const perf = (id: string, name = id): LineupPerformer => ({id, name});

const slot = (
    id: string,
    order: number,
    startsAt: string | null,
    endsAt: string | null,
    performers: LineupPerformer[] = [],
): LineupSlot => ({id, order, startsAt, endsAt, performers});

test('reorderSlots moves a slot and renumbers order 0..n-1', () => {
    const s = [slot('a', 0, null, null), slot('b', 1, null, null), slot('c', 2, null, null)];
    const r = reorderSlots(s, 0, 2);
    assert.deepEqual(r.map((x) => x.id), ['b', 'c', 'a']);
    assert.deepEqual(r.map((x) => x.order), [0, 1, 2]);
});

test('reorderSlots with an out-of-range index only sorts + renumbers', () => {
    const s = [slot('b', 5, null, null), slot('a', 1, null, null)];
    const r = reorderSlots(s, -1, 9);
    assert.deepEqual(r.map((x) => x.id), ['a', 'b']);
    assert.deepEqual(r.map((x) => x.order), [0, 1]);
});

test('movePerformer reorders within a slot', () => {
    const s = [slot('a', 0, null, null, [perf('p1'), perf('p2'), perf('p3')])];
    const {slots} = movePerformer(s, {performerId: 'p1', fromSlotId: 'a', toSlotId: 'a', toIndex: 2});
    assert.deepEqual(slots[0].performers.map((p) => p.id), ['p2', 'p3', 'p1']);
});

test('movePerformer moves across slots at a target index', () => {
    const s = [
        slot('a', 0, null, null, [perf('p1'), perf('p2')]),
        slot('b', 1, null, null, [perf('p3')]),
    ];
    const {slots} = movePerformer(s, {performerId: 'p1', fromSlotId: 'a', toSlotId: 'b', toIndex: 0});
    assert.deepEqual(slots[0].performers.map((p) => p.id), ['p2']);
    assert.deepEqual(slots[1].performers.map((p) => p.id), ['p1', 'p3']);
});

test('movePerformer moves a performer to the unscheduled tray', () => {
    const s = [slot('a', 0, null, null, [perf('p1'), perf('p2')])];
    const {slots, unscheduled} = movePerformer(s, {performerId: 'p1', fromSlotId: 'a', toSlotId: null}, []);
    assert.deepEqual(slots[0].performers.map((p) => p.id), ['p2']);
    assert.deepEqual(unscheduled.map((p) => p.id), ['p1']);
});

test('movePerformer schedules a performer from the unscheduled tray', () => {
    const s = [slot('a', 0, null, null, [])];
    const {slots, unscheduled} = movePerformer(s, {performerId: 'u1', fromSlotId: null, toSlotId: 'a'}, [perf('u1')]);
    assert.deepEqual(slots[0].performers.map((p) => p.id), ['u1']);
    assert.equal(unscheduled.length, 0);
});

test('movePerformer does not mutate its inputs', () => {
    const s = [slot('a', 0, null, null, [perf('p1')])];
    movePerformer(s, {performerId: 'p1', fromSlotId: 'a', toSlotId: null}, []);
    assert.equal(s[0].performers.length, 1);
});

test('generateSlots builds N contiguous slots from an anchor (UTC instants)', () => {
    const g = generateSlots({startsAt: '2026-09-04T20:00:00Z', count: 3, lengthMinutes: 45});
    assert.equal(g.length, 3);
    assert.equal(g[0].startsAt, '2026-09-04T20:00:00.000Z');
    assert.equal(g[0].endsAt, '2026-09-04T20:45:00.000Z');
    assert.equal(g[1].startsAt, '2026-09-04T20:45:00.000Z');
    assert.equal(g[2].endsAt, '2026-09-04T22:15:00.000Z');
    assert.deepEqual(g.map((s) => s.order), [0, 1, 2]);
});

test('generateSlots returns [] for missing anchor or non-positive input', () => {
    assert.deepEqual(generateSlots({startsAt: null, count: 3, lengthMinutes: 45}), []);
    assert.deepEqual(generateSlots({startsAt: '2026-09-04T20:00:00Z', count: 0, lengthMinutes: 45}), []);
    assert.deepEqual(generateSlots({startsAt: '2026-09-04T20:00:00Z', count: 3, lengthMinutes: 0}), []);
});

test('layContiguous shifts later slots to close gaps, keeping durations', () => {
    const s = [
        slot('a', 0, '2026-09-04T20:00:00Z', '2026-09-04T21:00:00Z'),
        slot('b', 1, '2026-09-04T22:00:00Z', '2026-09-04T22:30:00Z'),
    ];
    const r = layContiguous(s);
    assert.equal(r[0].startsAt, '2026-09-04T20:00:00.000Z');
    assert.equal(r[0].endsAt, '2026-09-04T21:00:00.000Z');
    assert.equal(r[1].startsAt, '2026-09-04T21:00:00.000Z');
    assert.equal(r[1].endsAt, '2026-09-04T21:30:00.000Z');
});

test('detectIssues flags a gap on the later slot when gaps disallowed', () => {
    const s = [
        slot('a', 0, '2026-09-04T20:00:00Z', '2026-09-04T21:00:00Z'),
        slot('b', 1, '2026-09-04T22:00:00Z', '2026-09-04T23:00:00Z'),
    ];
    const r = detectIssues(s, caps({gapsAllowed: false}));
    assert.ok(r.bySlot['b']?.some((i) => i.kind === 'gap'));
    assert.equal(r.bySlot['a'], undefined);
});

test('detectIssues flags an overlap when overlaps disallowed', () => {
    const s = [
        slot('a', 0, '2026-09-04T20:00:00Z', '2026-09-04T21:00:00Z'),
        slot('b', 1, '2026-09-04T20:30:00Z', '2026-09-04T21:30:00Z'),
    ];
    const r = detectIssues(s, caps({overlapsAllowed: false}));
    assert.ok(r.bySlot['b']?.some((i) => i.kind === 'overlap'));
});

test('detectIssues flags B2B as unsupported when single-performer only', () => {
    const s = [slot('a', 0, null, null, [perf('p1'), perf('p2')])];
    const r = detectIssues(s, caps({multiplePerformersPerSlot: false}));
    assert.ok(r.bySlot['a']?.some((i) => i.kind === 'unsupported'));
});

test('detectIssues flags exceeding maxSlots at board level', () => {
    const s = [slot('a', 0, null, null), slot('b', 1, null, null), slot('c', 2, null, null)];
    const r = detectIssues(s, caps({maxSlots: 2}));
    assert.ok(r.board.some((i) => i.kind === 'warning'));
});

test('shiftSlot moves start and end; leaves untimed edges untouched', () => {
    const r = shiftSlot(slot('a', 0, '2026-09-04T20:00:00Z', '2026-09-04T21:00:00Z'), 30);
    assert.equal(r.startsAt, '2026-09-04T20:30:00.000Z');
    assert.equal(r.endsAt, '2026-09-04T21:30:00.000Z');
    assert.equal(shiftSlot(slot('a', 0, null, null), 30).startsAt, null);
});

test('resizeSlot sets end to start + length; no-ops without a start', () => {
    assert.equal(resizeSlot(slot('a', 0, '2026-09-04T20:00:00Z', '2026-09-04T21:00:00Z'), 90).endsAt, '2026-09-04T21:30:00.000Z');
    assert.equal(resizeSlot(slot('a', 0, null, null), 90).endsAt, null);
});

test('totalDurationMinutes + slotDurationMinutes + sortSlots', () => {
    const s = [
        slot('b', 2, '2026-09-04T21:00:00Z', '2026-09-04T21:30:00Z'),
        slot('a', 1, '2026-09-04T20:00:00Z', '2026-09-04T21:00:00Z'),
    ];
    assert.equal(totalDurationMinutes(s), 90);
    assert.equal(slotDurationMinutes(s[0]), 30);
    assert.deepEqual(sortSlots(s).map((x) => x.id), ['a', 'b']);
    assert.equal(s[0].id, 'b'); // sortSlots did not mutate
});
