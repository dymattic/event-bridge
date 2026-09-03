// happy-dom parser tests over the sanitized fixtures.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseCsrf, parseDashboard, parseEditPage, parseEventsList } from '../../../src/adapters/vrcpop/parse';
import { isOwnEventRef, isOwnGroupRef } from '../../../src/adapters/vrcpop/types';
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
