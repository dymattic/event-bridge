// listGigs against a fake in-tab agent serving the sanitized fixtures. Covers the
// request sequence, 404-slug skip, the detail-read cap, profile/own-event dedupe,
// and the names-empty shortcut. No real transport.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MAX_EVENT_READS, vrcpopAdapter } from '../../../src/adapters/vrcpop/adapter';
import type { HttpRequest, HttpResult } from '../../../src/shared/agent-protocol';
import { makeFakeAgent, html, ok } from './fake-agent';

const FIX = join(process.cwd(), 'test', 'fixtures', 'vrcpop');
const fixture = (n: string): string => readFileSync(join(FIX, n), 'utf8');

const GRP1 = 'grp_00000000-0000-4000-8000-000000000001';
const GRP2 = 'grp_00000000-0000-4000-8000-000000000002';
const NOW = Date.parse('2026-08-01T00:00:00Z');
const noPace = async (): Promise<void> => undefined;

function notFound(): HttpResult {
  return { status: 404, finalUrl: 'https://vrcpop.com/u/missing', headers: {}, body: 'Not found' };
}

// Minimal upcoming events-list body carrying the given (future-dated) event ids.
function eventsListHtml(grp: string, ids: number[]): string {
  const cards = ids
    .map(
      (id) =>
        `<div class="event-card"><div class="event-card-info"><h4>Event ${id}</h4>` +
        `<div class="event-card-meta"><span>Wed, Sep 10, 2030 at 10:00 PM</span></div></div>` +
        `<div class="event-card-actions"><a href="/manage/club/${grp}/events/${id}" class="btn">Edit</a></div></div>`,
    )
    .join('');
  return (
    `<!doctype html><html><head><meta name="csrf-token" content="T"></head><body>` +
    `<div class="event-list">${cards}</div>` +
    `<script>window.MANAGE_DATA={groupId:"${grp}",groupName:"Example Club"};</script></body></html>`
  );
}

interface SiteCfg {
  slug404?: boolean;
  eventsByGrp?: Record<string, number[]>;
}

function site(cfg: SiteCfg = {}) {
  const eventsByGrp = cfg.eventsByGrp ?? {};
  return (req: HttpRequest): HttpResult => {
    const { method, path } = req;
    if (method === 'GET' && path === '/dashboard') return html(fixture('dashboard.html'));
    if (method === 'GET' && path.startsWith('/api/dj/?action=search-all')) {
      return ok({ success: true, profiles: [{ name: 'Example DJ', slug: 'example-dj', profile_id: 42 }], historical: [] });
    }
    if (method === 'GET' && /^\/u\//.test(path)) return cfg.slug404 ? notFound() : html(fixture('performer-profile.html'));
    if (method === 'GET' && /\/events$/.test(path)) {
      const grp = /club\/(grp_[0-9a-fA-F-]+)\/events$/.exec(path)?.[1] ?? 'grp';
      return html(eventsListHtml(grp, eventsByGrp[grp] ?? []));
    }
    if (method === 'GET' && /\/edit$/.test(path)) return html(fixture('edit-page.html'));
    if (method === 'GET' && path.startsWith('/api/event-lineup.php')) return ok(JSON.parse(fixture('lineup.json')));
    return ok({ success: false, error: `unhandled ${method} ${path}` }, 404);
  };
}

describe('vrcpop listGigs', () => {
  it('names empty -> [] with no requests', async () => {
    const { agent, httpCalls } = makeFakeAgent(site());
    const gigs = await vrcpopAdapter.listGigs(agent, [], { now: NOW, pace: noPace });
    expect(gigs).toEqual([]);
    expect(httpCalls).toHaveLength(0);
  });

  it('reads dashboard -> search-all -> profile -> events, and dedupe keeps the profile entry', async () => {
    const { agent, httpCalls } = makeFakeAgent(site({ eventsByGrp: { [GRP1]: [100777], [GRP2]: [] } }));
    const gigs = await vrcpopAdapter.listGigs(agent, ['Example DJ'], { now: NOW, pace: noPace });

    // request sequence
    expect(httpCalls[0]?.path).toBe('/dashboard');
    expect(httpCalls[1]?.path).toMatch(/^\/api\/dj\/\?action=search-all/);
    expect(httpCalls[2]?.path).toBe('/u/example-dj');
    expect(httpCalls.some((r) => r.path === `/manage/club/${GRP1}/events`)).toBe(true);
    expect(httpCalls.some((r) => r.path === `/manage/club/${GRP2}/events`)).toBe(true);
    expect(httpCalls.some((r) => /\/events\/100777\/edit$/.test(r.path))).toBe(true);

    // 100777 seen both as a profile hero AND an own event -> profile wins on dedupe.
    const byId = Object.fromEntries(gigs.map((g) => [g.eventId, g]));
    expect(Object.keys(byId).sort()).toEqual(['100777', '100778']);
    expect(byId['100777']?.source).toBe('profile');
    expect(byId['100777']?.eventUrl).toBe('https://vrcpop.com/event/100777');
    expect(byId['100777']?.matchedName).toBe('Example DJ');
    expect(byId['100778']?.clubName).toBe('Other Club');
  });

  it('a 404 profile slug is skipped (not thrown); the own-event complement still returns', async () => {
    const { agent, httpCalls } = makeFakeAgent(site({ slug404: true, eventsByGrp: { [GRP1]: [200001], [GRP2]: [] } }));
    const gigs = await vrcpopAdapter.listGigs(agent, ['Example DJ'], { now: NOW, pace: noPace });
    expect(httpCalls.some((r) => r.path === '/u/example-dj')).toBe(true); // attempted
    expect(gigs.map((g) => g.eventId)).toEqual(['200001']);
    expect(gigs[0]?.source).toBe('own-event');
  });

  it('caps detail reads at maxEventReads', async () => {
    const many = Array.from({ length: 30 }, (_, i) => i + 1);
    const { agent, httpCalls } = makeFakeAgent(site({ slug404: true, eventsByGrp: { [GRP1]: many } }));
    const gigs = await vrcpopAdapter.listGigs(agent, ['Example DJ'], { now: NOW, pace: noPace, maxEventReads: 3 });
    const edits = httpCalls.filter((r) => /\/edit$/.test(r.path));
    expect(edits).toHaveLength(3);
    expect(gigs).toHaveLength(3);
    expect(MAX_EVENT_READS).toBe(25);
  });
});
