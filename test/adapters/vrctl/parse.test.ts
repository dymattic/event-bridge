// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  detectNetteError,
  isSignInRedirect,
  parseChooseCategory,
  parseChooseOrganizer,
  parseDetailForm,
  parseGrid,
  parsePerformerSearch,
  parseTimeline,
} from '../../../src/adapters/vrctl/parse';

const FIX = join(process.cwd(), 'test', 'fixtures', 'vrctl');
const html = (p: string): string => readFileSync(join(FIX, p), 'utf8');

describe('parseDetailForm', () => {
  const form = parseDetailForm(html('detail-form.html'));

  it('form header + organizers', () => {
    expect(form.actionUrl).toBe('/admin/event/detail/100002');
    expect(form.doValue).toBe('form-form-submit');
    expect(form.organizerOptions).toEqual([{ id: '9001', label: 'Example Club' }]);
    expect(form.selectedOrganizerIds).toEqual(['9001']);
  });

  it('current values', () => {
    expect(form.current.name).toBe("what's poppin");
    expect(form.current.start).toBe('2026-09-03T22:00');
    expect(form.current.timezone).toBe('Europe/Berlin');
    expect(form.current.showSlots).toBe(true);
    expect(form.current.published).toBe(false);
    expect(form.current.posterType).toBe('url');
    expect(form.current.instanceOpenMinutesBeforeStart).toBe(0);
    expect(form.current.description).toBe('');
  });

  it('timezone options (full list, placeholder dropped)', () => {
    expect(form.timezoneOptions).toContain('Europe/Berlin');
    expect(form.timezoneOptions).toContain('Asia/Tokyo');
    expect(form.timezoneOptions).toContain('UTC');
    expect(form.timezoneOptions).not.toContain('');
    expect(form.timezoneOptions.length).toBeGreaterThan(100);
  });

  it('howToJoin radio (label is the club name, not the shortcode link)', () => {
    expect(form.howToJoinOptions).toEqual([{ id: 'group-9001', label: 'Example Club' }]);
    expect(form.selectedHowToJoin).toBe('group-9001');
  });

  it('flag categories with kinds + scraped option ids', () => {
    expect(form.flagCategories['1']?.kind).toBe('radio');
    expect(form.flagCategories['1']?.name).toBe('NSFW / SFW');
    expect(form.flagCategories['1']?.options).toEqual([
      { id: '1', label: 'NSFW' },
      { id: '6', label: 'SFW' },
    ]);
    expect(form.flagCategories['2']?.kind).toBe('multi');
    expect(form.flagCategories['2']?.options.map((o) => o.id)).toEqual(['2', '7', '15']);
    expect(form.flagCategories['3']?.kind).toBe('checkbox');
    expect(form.flagCategories['4']?.kind).toBe('checkbox');
    expect(form.flagCategories['5']?.kind).toBe('radio');
    expect(form.flagCategories['5']?.options.some((o) => o.id === '' )).toBe(true); // "(no tag)"
    expect(form.flagCategories['6']?.name).toBe('Avatar restriction');
  });

  it('selected flags reflect the checked/selected controls', () => {
    expect(form.selectedFlags['1']).toEqual(['1']);
    expect(form.selectedFlags['2']).toEqual(['2']);
    expect(form.selectedFlags['3']).toEqual(['on']);
    expect(form.selectedFlags['4']).toEqual(['on']);
    expect(form.selectedFlags['5']).toEqual(['10']);
    expect(form.selectedFlags['6']).toEqual(['12']);
  });

  it('slots with server ids, duration, flag, performers', () => {
    expect(form.slots).toHaveLength(1);
    const s = form.slots[0]!;
    expect(s.id).toBe('136569');
    expect(s.duration).toBe(60);
    expect(s.flag).toBe('performers');
    expect(s.performers).toEqual([{ id: '300001', label: 'Example DJ' }]);
    expect(s.publicNote).toBe('');
    expect(s.privateNote).toBe('');
  });
});

describe('parseChooseOrganizer', () => {
  it('own clubs from the selectize options', () => {
    const orgs = parseChooseOrganizer(html('choose-organizer.html'));
    expect(orgs).toEqual([{ organizerId: '9001', name: 'Example Club' }]);
    // grp_ id is not exposed on this surface
    expect(orgs[0]?.vrchatGroupId).toBeUndefined();
  });
});

describe('parseChooseCategory', () => {
  const cats = parseChooseCategory(html('choose-category.html'));

  it('extracts (category x promoted) create links, deduped', () => {
    const music = cats.filter((c) => c.categoryId === '1');
    expect(music.map((c) => c.promoted).sort()).toEqual([false, true]);
    const promotedMusic = music.find((c) => c.promoted);
    expect(promotedMusic?.createPath).toBe('/admin/event/create?categoryId=1&organizerId=9001');
    const notMusic = music.find((c) => !c.promoted);
    expect(notMusic?.createPath).toContain('promoted=0');
  });

  it('captures categories offered only in one mode (community not-promoted only)', () => {
    const community = cats.filter((c) => c.categoryId === '9');
    expect(community).toHaveLength(1);
    expect(community[0]?.promoted).toBe(false);
  });

  it('no duplicate (category,promoted) pairs', () => {
    const keys = cats.map((c) => `${c.categoryId}:${c.promoted}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('parseGrid', () => {
  const rows = parseGrid(html('admin-grid.html'));

  it('parses rows with id/name/start/organizer/promoted', () => {
    expect(rows).toHaveLength(3);
    const r = rows.find((x) => x.eventId === '100002')!;
    expect(r.name).toBe("what's poppin");
    expect(r.start).toBe('2030-01-05 22:00');
    expect(r.organizerName).toBe('Example Club');
    expect(r.organizerId).toBe('9001');
    expect(r.promoted).toBe(true);
    expect(r.published).toBeUndefined(); // grid does not expose published
  });

  it('exposes a delete action only for a manageable (own) row', () => {
    const own = rows.find((x) => x.eventId === '100002')!;
    expect(own.deleteAction).toBe('/admin/event?grid-grid-__id=100002&grid-grid-__key=delete&do=grid-grid-actionCallback');
    const other = rows.find((x) => x.eventId === '29489')!; // The Cauldron: no delete link
    expect(other.deleteAction).toBeUndefined();
  });
});

describe('parsePerformerSearch', () => {
  it('maps the select2 JSON to {id,text}', () => {
    const raw = JSON.parse(readFileSync(join(FIX, 'performer-search.json'), 'utf8')) as { exact: { body: string } };
    const results = parsePerformerSearch(raw.exact.body);
    expect(results).toEqual([{ id: '300001', text: 'Example DJ' }]);
  });
  it('throws PARSE on non-JSON', () => {
    expect(() => parsePerformerSearch('<html>403</html>')).toThrow();
  });
});

describe('parseTimeline', () => {
  const page1 = parseTimeline(html('timeline-page.json'));
  const page2 = parseTimeline(html('timeline-page-2.json'));

  it('days come from lastUpdates', () => {
    expect(page1.days).toEqual(['2030-06-14', '2030-06-15', '2030-06-16']);
  });

  it('resolves performer + organizer names, ISO-Z times, slot end from duration', () => {
    const e = page1.events.find((x) => x.id === '300001')!;
    expect(e.name).toBe('Timeline Night');
    expect(e.organizerName).toBe('Other Club'); // hostOrganizer 9002
    expect(e.promoted).toBe(true);
    expect(e.start).toBe('2030-06-15T22:00:00Z');
    expect(e.end).toBe('2030-06-16T02:00:00Z');
    expect(e.slots).toEqual([{ start: '2030-06-15T22:00:00Z', end: '2030-06-15T23:00:00Z', performerNames: ['Example DJ'] }]);
  });

  it('drops slots for a showSlots:false event (lineup hidden publicly)', () => {
    const e = page1.events.find((x) => x.id === '300002')!;
    expect(e.slots).toEqual([]);
  });

  it('keeps a hidden performer (the user may be one)', () => {
    const e = page2.events.find((x) => x.id === '300004')!;
    expect(e.slots[0]?.performerNames).toEqual(['Other DJ']); // performer 5002 hidden:true
  });

  it('skips unknown performer ids without failing', () => {
    const e = page2.events.find((x) => x.id === '300005')!;
    expect(e.slots[0]?.performerNames).toEqual(['Someone Else']); // 5999 unknown -> skipped
  });

  it('PARSE on non-JSON or a payload missing lastUpdates/eventData', () => {
    expect(() => parseTimeline('<html>500</html>')).toThrow();
    expect(() => parseTimeline('{"nope":true}')).toThrow();
  });
});

describe('detectNetteError', () => {
  it('null on a clean (successful) detail render', () => {
    expect(detectNetteError(html('detail-form.html'))).toBeNull();
  });
  it('flags a Bootstrap danger flash', () => {
    const err = detectNetteError('<html><body><div class="alert alert-danger">You need to choose one event tag from category NSFW / SFW.</div></body></html>');
    expect(err).toContain('NSFW / SFW');
  });
  it('flags an invalid-feedback field error', () => {
    const err = detectNetteError('<html><body><div class="invalid-feedback">Please enter slot duration.</div></body></html>');
    expect(err).toContain('slot duration');
  });
});

describe('isSignInRedirect', () => {
  it('true when a followed request lands outside /admin/', () => {
    expect(isSignInRedirect({ finalUrl: 'https://vrc.tl/sign/in', status: 200 })).toBe(true);
  });
  it('false for an admin detail/ajax landing', () => {
    expect(isSignInRedirect({ finalUrl: 'https://vrc.tl/admin/event/detail/100002', status: 200 })).toBe(false);
    expect(isSignInRedirect({ finalUrl: 'https://vrc.tl/admin/ajax/performer?term=x', status: 200 })).toBe(false);
  });
  it('true when the body is the sign-in page even if the url stayed on /admin', () => {
    expect(isSignInRedirect({ finalUrl: 'https://vrc.tl/admin/event', status: 200, body: '<form action="/sign/in" method="post"></form>' })).toBe(true);
  });
});
