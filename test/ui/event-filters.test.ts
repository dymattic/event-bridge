import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTERS,
  distinctStatuses,
  filterAndSort,
  filterEvents,
  filtersToQuery,
  queryToFilters,
  sortEvents,
  type EventRow,
} from '../../src/ui/lib/event-filters';

const NOW = Date.parse('2026-09-04T12:00:00Z');

const rows: EventRow[] = [
  { platform: 'vrcpop', id: '100001', title: "what's poppin", start: '2026-09-10T20:00:00Z', status: 'published', clubId: 'grp_a', clubName: 'Example Club' },
  { platform: 'vrcpop', id: '100002', title: 'draft night', start: '2026-09-12T21:00:00Z', status: 'draft', clubId: 'grp_a', clubName: 'Example Club' },
  { platform: 'vrctl', id: '29778', title: 'just spinnin', start: '2026-09-01T20:00:00Z', status: 'promoted', clubId: '9001', clubName: 'Example Club Two' },
  { platform: 'ravepage', id: 'evt_1', title: 'rave night', start: '2026-08-20T18:00:00Z', status: 'published', clubId: 'grp_b', clubName: 'Third Club' },
];

describe('filterEvents', () => {
  it('time: upcoming keeps only future, past only past', () => {
    const up = filterEvents(rows, { ...DEFAULT_FILTERS, time: 'upcoming' }, NOW);
    expect(up.map((r) => r.id).sort()).toEqual(['100001', '100002']);
    const past = filterEvents(rows, { ...DEFAULT_FILTERS, time: 'past' }, NOW);
    expect(past.map((r) => r.id).sort()).toEqual(['29778', 'evt_1']);
    expect(filterEvents(rows, { ...DEFAULT_FILTERS, time: 'all' }, NOW)).toHaveLength(4);
  });

  it('platform + club + status narrow', () => {
    expect(filterEvents(rows, { ...DEFAULT_FILTERS, time: 'all', platforms: ['vrcpop'] }, NOW)).toHaveLength(2);
    expect(filterEvents(rows, { ...DEFAULT_FILTERS, time: 'all', clubIds: ['9001'] }, NOW)).toHaveLength(1);
    expect(filterEvents(rows, { ...DEFAULT_FILTERS, time: 'all', statuses: ['draft'] }, NOW)).toHaveLength(1);
  });

  it('search matches title or club name (case-insensitive)', () => {
    expect(filterEvents(rows, { ...DEFAULT_FILTERS, time: 'all', q: 'POPPIN' }, NOW).map((r) => r.id)).toEqual(['100001']);
    expect(filterEvents(rows, { ...DEFAULT_FILTERS, time: 'all', q: 'third club' }, NOW).map((r) => r.id)).toEqual(['evt_1']);
  });

  it('date range (inclusive) bounds by start', () => {
    const r = filterEvents(rows, { ...DEFAULT_FILTERS, time: 'all', from: '2026-09-10', to: '2026-09-10' }, NOW);
    expect(r.map((x) => x.id)).toEqual(['100001']);
  });
});

describe('sortEvents', () => {
  it('upcoming ascending, past descending', () => {
    const up = sortEvents(rows.filter((r) => r.platform === 'vrcpop'), 'upcoming');
    expect(up.map((r) => r.id)).toEqual(['100001', '100002']);
    const down = sortEvents(rows, 'past');
    expect(down[0]?.id).toBe('100002'); // latest start first
  });

  it('undated rows sink to the end', () => {
    const withUndated: EventRow[] = [...rows, { platform: 'vrctl', id: 'x', title: 'z', clubId: '1', clubName: 'c' }];
    expect(sortEvents(withUndated, 'upcoming').at(-1)?.id).toBe('x');
  });
});

describe('filterAndSort', () => {
  it('composes filter + sort', () => {
    const out = filterAndSort(rows, { ...DEFAULT_FILTERS, time: 'upcoming', platforms: ['vrcpop'] }, NOW);
    expect(out.map((r) => r.id)).toEqual(['100001', '100002']);
  });
});

describe('distinctStatuses', () => {
  it('unique sorted statuses', () => {
    expect(distinctStatuses(rows)).toEqual(['draft', 'promoted', 'published']);
  });
});

describe('URL sync round-trip', () => {
  it('serialises and parses back', () => {
    const f = { platforms: ['vrcpop' as const], clubIds: ['grp_a'], statuses: ['draft'], time: 'past' as const, from: '2026-09-01', to: '2026-09-30', q: 'hi' };
    const q = filtersToQuery(f);
    expect(queryToFilters(q)).toEqual(f);
  });
  it('defaults when empty', () => {
    expect(filtersToQuery(DEFAULT_FILTERS)).toBe('');
    expect(queryToFilters('')).toEqual(DEFAULT_FILTERS);
  });
  it('ignores unknown platform tokens', () => {
    expect(queryToFilters('platform=bogus,vrctl').platforms).toEqual(['vrctl']);
  });
});
