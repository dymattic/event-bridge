import { describe, expect, it } from 'vitest';
import type { EventRow, EventFilterState } from '../../src/ui/lib/event-filters';
import { DEFAULT_FILTERS } from '../../src/ui/lib/event-filters';
import {
  filterLogical,
  groupLogicalEvents,
  normalizeTitle,
  titleSimilarity,
  type MatchLink,
} from '../../src/ui/lib/event-match';

const NOW = Date.parse('2027-01-01T00:00:00Z');
const T1 = '2027-02-01T20:00:00Z';
const T1b = '2027-02-01T20:15:00Z'; // +15 min -> strong
const T1c = '2027-02-01T23:00:00Z'; // +3 h -> within 24 h, not strong
const FAR = '2027-02-08T20:00:00Z'; // +7 days

function row(p: EventRow['platform'], id: string, title: string, clubId: string, start?: string, status?: string): EventRow {
  return { platform: p, id, title, clubId, clubName: 'Example Club', start, status };
}

// club-x = the linked Example Club (vrctl 9001 + vrcpop grp1); club-r = ravepage.
const anchorOf = (p: EventRow['platform'], clubId: string): string =>
  clubId === '9001' || clubId === 'grp1' ? 'club-x' : `solo:${p}:${clubId}`;

const filters = (patch: Partial<EventFilterState> = {}): EventFilterState => ({ ...DEFAULT_FILTERS, time: 'all', ...patch });

describe('normalizeTitle', () => {
  it('lowercases, strips the test prefix, drops punctuation/emoji, collapses spaces', () => {
    expect(normalizeTitle("[event-bridge test] What's Poppin! 🎧", '[event-bridge test] ')).toBe('what s poppin');
    expect(normalizeTitle('  Techno   Night  ')).toBe('techno night');
  });
});

describe('titleSimilarity', () => {
  it('is 1 for identical, 0 for disjoint, and in between for partial overlap', () => {
    expect(titleSimilarity("what's poppin", "what's poppin")).toBe(1);
    expect(titleSimilarity("what's poppin", 'just spinnin type shi')).toBe(0);
    const partial = titleSimilarity('one two three four', 'one two three five six');
    expect(partial).toBeGreaterThanOrEqual(0.6);
    expect(partial).toBeLessThan(1);
    expect(titleSimilarity('one two three', 'four five six seven')).toBeLessThan(0.6);
  });
});

describe('groupLogicalEvents — links', () => {
  it('collapses linked refs into one logical event with a cell per platform', () => {
    const rows = [row('vrcpop', '100001', "what's poppin", 'grp1', T1), row('vrctl', '100002', "what's poppin", '9001', T1b)];
    const links: MatchLink[] = [{ anchorId: 'link-1', refs: [{ platform: 'vrcpop', id: '100001' }, { platform: 'vrctl', id: '100002' }] }];
    const { logical, suggestions } = groupLogicalEvents({ rows, links, anchorOf, dismissed: [], now: NOW });
    expect(logical).toHaveLength(1);
    expect(logical[0]?.linkId).toBe('link-1');
    expect(Object.keys(logical[0]!.cells).sort()).toEqual(['vrcpop', 'vrctl']);
    expect(suggestions).toHaveLength(0); // linked rows are not suggested
  });

  it('ignores a ref with no matching row but counts it in staleRefs', () => {
    const rows = [row('vrcpop', '100001', "what's poppin", 'grp1', T1)];
    const links: MatchLink[] = [{ anchorId: 'link-1', refs: [{ platform: 'vrcpop', id: '100001' }, { platform: 'vrctl', id: 'gone' }] }];
    const { logical } = groupLogicalEvents({ rows, links, anchorOf, dismissed: [], now: NOW });
    expect(logical).toHaveLength(1);
    expect(logical[0]?.staleRefs).toBe(1);
    expect(Object.keys(logical[0]!.cells)).toEqual(['vrcpop']);
  });
});

describe('groupLogicalEvents — suggestions', () => {
  const twoWhatsPoppin = [row('vrcpop', '100001', "what's poppin", 'grp1', T1), row('vrctl', '100002', "what's poppin", '9001', T1b)];

  it('suggests same-anchor cross-platform rows with similar title + close start (strong)', () => {
    const { suggestions } = groupLogicalEvents({ rows: twoWhatsPoppin, links: [], anchorOf, dismissed: [], now: NOW });
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]?.strong).toBe(true);
    expect(suggestions[0]?.key).toBe('vrcpop:100001|vrctl:100002');
    expect(suggestions[0]?.rows.map((r) => r.platform)).toEqual(['vrctl', 'vrcpop']);
  });

  it('within 24 h but > 30 min is a non-strong suggestion', () => {
    const rows = [row('vrcpop', '100001', "what's poppin", 'grp1', T1), row('vrctl', '100002', "what's poppin", '9001', T1c)];
    const { suggestions } = groupLogicalEvents({ rows, links: [], anchorOf, dismissed: [], now: NOW });
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]?.strong).toBe(false);
  });

  it('does NOT suggest across different club anchors', () => {
    const rows = [row('vrcpop', '100001', "what's poppin", 'grp1', T1), row('vrctl', '100002', "what's poppin", 'other', T1b)];
    const { suggestions } = groupLogicalEvents({ rows, links: [], anchorOf, dismissed: [], now: NOW });
    expect(suggestions).toHaveLength(0);
  });

  it('does NOT suggest when starts are > 24 h apart and titles are not near-identical enough for the fallback', () => {
    const rows = [row('vrcpop', '100001', "what's poppin tonight extra", 'grp1', T1), row('vrctl', '100002', "what's poppin", '9001', FAR)];
    const { suggestions } = groupLogicalEvents({ rows, links: [], anchorOf, dismissed: [], now: NOW });
    expect(suggestions).toHaveLength(0);
  });

  it('falls back to similarity >= 0.9 when a start is unparseable', () => {
    const rows = [row('vrcpop', '100001', "what's poppin", 'grp1', undefined), row('vrctl', '100002', "what's poppin", '9001', T1)];
    const { suggestions } = groupLogicalEvents({ rows, links: [], anchorOf, dismissed: [], now: NOW });
    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]?.strong).toBe(false);
  });

  it('does NOT suggest below the 0.6 similarity threshold', () => {
    const rows = [row('vrcpop', '100001', 'one two three', 'grp1', T1), row('vrctl', '100002', 'four five six seven', '9001', T1b)];
    const { suggestions } = groupLogicalEvents({ rows, links: [], anchorOf, dismissed: [], now: NOW });
    expect(suggestions).toHaveLength(0);
  });

  it('suppresses a dismissed suggestion by key', () => {
    const { suggestions } = groupLogicalEvents({ rows: twoWhatsPoppin, links: [], anchorOf, dismissed: ['vrcpop:100001|vrctl:100002'], now: NOW });
    expect(suggestions).toHaveLength(0);
  });
});

describe('filterLogical', () => {
  const rows = [
    row('vrcpop', '100001', "what's poppin", 'grp1', T1, 'published'),
    row('vrctl', '29778', 'just spinnin', '9001', T1, 'promoted'),
    row('ravepage', 'evtR', 'neon cathedral', 'grpR', T1, 'published'),
  ];
  const present: EventRow['platform'][] = ['vrctl', 'vrcpop', 'ravepage'];
  const grouped = () => groupLogicalEvents({ rows, links: [], anchorOf, dismissed: [], now: NOW }).logical;

  it('platform filter keeps logical events with a cell on a selected platform', () => {
    const out = filterLogical(grouped(), filters({ platforms: ['ravepage'] }), present, NOW);
    expect(out.map((l) => l.title)).toEqual(['neon cathedral']);
  });

  it('missing filter keeps rows with fewer cells than the present platforms', () => {
    const link: MatchLink = { anchorId: 'l', refs: [{ platform: 'vrcpop', id: '100001' }, { platform: 'vrctl', id: '29778' }, { platform: 'ravepage', id: 'evtR' }] };
    const full = groupLogicalEvents({ rows, links: [link], anchorOf, dismissed: [], now: NOW }).logical;
    const out = filterLogical(full, filters({ missing: true }), present, NOW);
    expect(out).toHaveLength(0); // the only logical event has all three cells
    const singles = filterLogical(grouped(), filters({ missing: true }), present, NOW);
    expect(singles).toHaveLength(3); // each singleton is missing two platforms
  });

  it('search matches a cell title', () => {
    const out = filterLogical(grouped(), filters({ q: 'poppin' }), present, NOW);
    expect(out.map((l) => l.title)).toEqual(["what's poppin"]);
  });
});
