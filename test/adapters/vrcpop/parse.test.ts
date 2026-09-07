// happy-dom parser tests over the sanitized fixtures.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  eventToOwn,
  parseCsrf,
  parseDashboard,
  parseEditPage,
  parseEventsList,
  parseOwnPerformerSlugs,
  parsePerformerProfile,
  parseVrcpopCardDate,
  parseVrcpopTimeRange,
} from '../../../src/adapters/vrcpop/parse';
import { isOwnEventRef, isOwnGroupRef, ownEventRef, type VrcpopEventRef } from '../../../src/adapters/vrcpop/types';
import { isBridgeError } from '../../../src/core/errors';

const FIX = join(process.cwd(), 'test', 'fixtures', 'vrcpop');
const fixture = (name: string): string => readFileSync(join(FIX, name), 'utf8');

const GRP1 = 'grp_00000000-0000-4000-8000-000000000001';
const GRP2 = 'grp_00000000-0000-4000-8000-000000000002';

function code(fn: () => unknown): string {
  try {
    fn();
  } catch (e) {
    return isBridgeError(e) ? e.code : 'NON_BRIDGE';
  }
  return 'NO_THROW';
}

describe('parseDashboard', () => {
  const out = parseDashboard(fixture('dashboard.html'));

  it('reads the CSRF meta', () => {
    expect(out.csrf).toBe('TEST_CSRF_TOKEN');
  });

  it('parses every Clubs-I-Manage card into a branded OwnGroupRef', () => {
    expect(out.clubs).toHaveLength(2);
    expect(out.clubs[0]).toMatchObject({ groupId: GRP1, name: 'Example Club' });
    expect(out.clubs[1]).toMatchObject({ groupId: GRP2, name: 'Example Club Two' });
    expect(isOwnGroupRef(out.clubs[0]?.ref)).toBe(true);
    expect(out.clubs[0]?.ref.id).toBe(GRP1);
  });
});

describe('parseEventsList', () => {
  const out = parseEventsList(fixture('events-list.html'));

  it('reads groupId/groupName from window.MANAGE_DATA', () => {
    expect(out.groupId).toBe(GRP1);
    expect(out.groupName).toBe('Example Club');
  });

  it('parses upcoming, draft and past cards with status + branded refs', () => {
    const byId = Object.fromEntries(out.events.map((e) => [e.id, e]));
    expect(byId[100001]).toMatchObject({ title: "what's poppin", status: 'upcoming' });
    expect(byId[100002]).toMatchObject({ title: 'draft night', status: 'draft' });
    expect(byId[100003]).toMatchObject({ title: 'old night', status: 'past' });
    expect(isOwnEventRef(byId[100002]?.ref)).toBe(true);
    expect(byId[100001]?.date).toContain('Sep 3, 2026');
  });

  it('draft id comes from data-draft-id', () => {
    const draft = out.events.find((e) => e.status === 'draft');
    expect(draft?.ref.id).toBe(100002);
  });
});

// The exact instant is owner-tz approximate → assertions stay timezone-independent
// (ISO shape + correct year-month + same instant as Date.parse), never a fixed UTC time.
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe('parseVrcpopCardDate', () => {
  it('parses the human card label to an ISO instant', () => {
    const r1 = parseVrcpopCardDate('Thu, Sep 3, 2026 at 10:00 PM');
    expect(r1).toMatch(ISO);
    expect(r1?.startsWith('2026-09')).toBe(true);
    expect(Date.parse(r1 ?? '')).toBe(Date.parse('Thu, Sep 3, 2026 10:00 PM'));
    expect(parseVrcpopCardDate('Sat, Jan 5, 2030 at 8:00 PM')?.startsWith('2030-01')).toBe(true);
  });
  it('undefined for garbage / empty (never NaN, never the raw label)', () => {
    expect(parseVrcpopCardDate('coming soon')).toBeUndefined();
    expect(parseVrcpopCardDate('')).toBeUndefined();
  });
});

describe('eventToOwn', () => {
  const ref = (over: Partial<VrcpopEventRef>): VrcpopEventRef => ({
    id: 100001,
    title: "what's poppin",
    date: 'Thu, Sep 3, 2026 at 10:00 PM',
    status: 'upcoming',
    ref: ownEventRef(100001),
    ...over,
  });

  it('start is an ISO instant, never the human label', () => {
    const own = eventToOwn(ref({}));
    expect(own.start).toMatch(ISO);
    expect(own.start).not.toContain('at'); // not the label
    expect(own.id).toBe('100001');
    expect(own.visibility).toBe('public');
  });
  it('undated label -> start undefined (not NaN); draft -> draft visibility', () => {
    const own = eventToOwn(ref({ date: 'soon™', status: 'draft' }));
    expect(own.start).toBeUndefined();
    expect(own.status).toBe('draft');
    expect(own.visibility).toBe('draft');
  });
});

describe('parseEditPage', () => {
  const out = parseEditPage(fixture('edit-page.html'));

  it('extracts the optimistic-lock version + ids from #event-wizard-container', () => {
    expect(out.version).toBe(2);
    expect(out.eventId).toBe(100001);
    expect(out.groupId).toBe(GRP1);
    expect(out.sceneType).toBe('rave');
  });

  it('decodes data-event JSON and maps it to EventCore', () => {
    expect(out.dataEvent.event_name).toBe("what's poppin");
    expect(out.core.title).toBe("what's poppin");
    expect(out.core.start).toBe('2026-09-03T20:00:00Z');
    expect(out.core.lineup[0]?.performers[0]?.name).toBe('Example DJ');
    expect(out.core.extras.vrcpop).toMatchObject({ version: 2, status: 'published' });
  });
});

describe('parseOwnPerformerSlugs', () => {
  it('reads /manage/performer/<slug> links from the dashboard, validated + deduped', () => {
    expect(parseOwnPerformerSlugs(fixture('dashboard.html'))).toEqual(['example-dj']);
  });
  it('drops invalid slugs and dedupes', () => {
    const html =
      '<a href="/manage/performer/good-one"></a>' +
      '<a href="/manage/performer/good-one"></a>' + // dupe
      '<a href="/manage/performer/Bad Slug"></a>' + // space -> invalid
      '<a href="/manage/performer/UPPER"></a>'; // uppercase -> invalid
    expect(parseOwnPerformerSlugs(html)).toEqual(['good-one']);
  });
});

describe('parseVrcpopTimeRange', () => {
  const start = '2030-09-08T03:00:00Z';
  it('derives the end from a clock range + UTC start', () => {
    expect(parseVrcpopTimeRange('10:00 PM-11:00 PM (CDT)', start)).toBe('2030-09-08T04:00:00Z');
  });
  it('wraps past midnight', () => {
    expect(parseVrcpopTimeRange('11:00 PM-1:00 AM EDT', start)).toBe('2030-09-08T05:00:00Z');
  });
  it('undefined when unparseable or zero-length', () => {
    expect(parseVrcpopTimeRange('doors soon', start)).toBeUndefined();
    expect(parseVrcpopTimeRange('10:00 PM-10:00 PM', start)).toBeUndefined();
    expect(parseVrcpopTimeRange('10:00 PM-11:00 PM', 'not-a-date')).toBeUndefined();
  });
});

describe('parsePerformerProfile', () => {
  const now = Date.parse('2026-09-07T00:00:00Z');
  const sets = parsePerformerProfile(fixture('performer-profile.html'), now);

  it('keeps the hero + future rows, ignores upcoming_nights RSVPs and past history', () => {
    expect(sets.map((s) => s.eventId).sort((a, b) => a - b)).toEqual([100777, 100778]);
  });
  it('parses the hero (event/club/times, end derived from the clock range)', () => {
    const hero = sets.find((s) => s.eventId === 100777)!;
    expect(hero.fromHero).toBe(true);
    expect(hero.title).toBe('Example Night');
    expect(hero.eventPath).toBe('/event/100777');
    expect(hero.clubName).toBe('Example Club');
    expect(hero.clubPath).toBe('/club/example-club');
    expect(hero.start).toBe('2030-09-08T03:00:00Z');
    expect(hero.end).toBe('2030-09-08T04:00:00Z');
  });
  it('parses set rows with data-start/data-end and the group-href club', () => {
    const row = sets.find((s) => s.eventId === 100778)!;
    expect(row.fromHero).toBe(false);
    expect(row.clubName).toBe('Other Club');
    expect(row.clubPath).toContain('/group.php?id=grp_');
    expect(row.start).toBe('2030-09-15T01:00:00Z');
    expect(row.end).toBe('2030-09-15T05:00:00Z');
  });
  it('dedupes by event id, hero winning', () => {
    const html =
      '<section class="dj-section dj-section--upcoming">' +
      '<div class="dj-next-hero" data-utc="2030-09-08T03:00:00Z">' +
      '<span class="dj-next-hero__time">10:00 PM-11:00 PM</span>' +
      '<a class="dj-next-hero__event" href="/event/555">Hero Title</a>' +
      '<a class="dj-next-hero__club" href="/club/x">Club X</a></div>' +
      '<div class="dj-set-row"><a class="dj-set-event" href="/event/555">Row Title</a>' +
      '<div class="dj-set-sub"><a href="/club/x">Club X</a>' +
      '<span class="dj-set-time" data-start="2030-09-08T02:00:00Z" data-end="2030-09-08T03:00:00Z"></span></div></div>' +
      '</section>';
    const out = parsePerformerProfile(html, now);
    expect(out).toHaveLength(1);
    expect(out[0]?.title).toBe('Hero Title');
    expect(out[0]?.fromHero).toBe(true);
  });
});

describe('parser PARSE errors name the missing marker', () => {
  it('missing csrf meta', () => {
    expect(code(() => parseCsrf('<html><head></head><body></body></html>'))).toBe('PARSE');
  });
  it('missing #event-wizard-container', () => {
    expect(code(() => parseEditPage('<html><body><div></div></body></html>'))).toBe('PARSE');
  });
  it('data-event without version', () => {
    const html = '<div id="event-wizard-container" data-event=\'{"id":1,"group_id":"g","event_name":"x","owner_timezone":"UTC"}\'></div>';
    expect(code(() => parseEditPage(html))).toBe('PARSE');
  });
  it('empty events list with no MANAGE_DATA', () => {
    expect(code(() => parseEventsList('<html><body></body></html>'))).toBe('PARSE');
  });
});
