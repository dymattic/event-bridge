// Adapter reads + write execution against a fake in-tab agent that serves the
// sanitized fixtures and records every request. No real transport.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { vrcpopAdapter } from '../../../src/adapters/vrcpop/adapter';
import { ownEventRef, ownGroupRef } from '../../../src/adapters/vrcpop/types';
import { asIanaZone, asIsoUtc } from '../../../src/core/time';
import type { EventCore } from '../../../src/core/schema';
import type { HttpRequest, HttpResult } from '../../../src/shared/agent-protocol';
import { makeFakeAgent, html, ok } from './fake-agent';

const FIX = join(process.cwd(), 'test', 'fixtures', 'vrcpop');
const fixture = (n: string): string => readFileSync(join(FIX, n), 'utf8');

const GRP = ownGroupRef('grp_00000000-0000-4000-8000-000000000001', 'Example Club');
const EVT = ownEventRef(100001);

interface SiteState {
  stale: boolean;
}

function site(state: SiteState = { stale: false }) {
  return (req: HttpRequest): HttpResult => {
    const { method, path } = req;
    if (method === 'GET' && path === '/dashboard') return html(fixture('dashboard.html'));
    if (method === 'GET' && /\/events$/.test(path)) return html(fixture('events-list.html'));
    if (method === 'GET' && /\/edit$/.test(path)) return html(fixture('edit-page.html'));
    if (method === 'GET' && path.startsWith('/api/event-lineup.php')) return ok(JSON.parse(fixture('lineup.json')));
    if (method === 'GET' && path.startsWith('/api/dj/?action=genres')) return ok(JSON.parse(fixture('genres.json')));
    if (method === 'GET' && path.startsWith('/api/dj/?action=energy')) return ok(JSON.parse(fixture('energy.json')));
    if (method === 'GET' && path.startsWith('/api/dj/?action=search-all')) {
      return ok({ success: true, profiles: [], historical: [{ name: 'Example DJ', use_count: 4, source: 'historical' }] });
    }
    if (method === 'POST' && path === '/api/events/?action=create') {
      if (!req.headers?.['X-CSRF-Token']) return ok({ success: false, error: 'missing csrf' }, 403);
      return ok({ success: true, event_id: 100009, message: 'created' }, 201);
    }
    if (method === 'POST' && path === '/api/events/?action=update') {
      if (state.stale) return { status: 500, finalUrl: 'https://vrcpop.com/api/events/', headers: {}, body: 'Concurrent edit detected' };
      return ok({ success: true });
    }
    if (method === 'POST' && path === '/api/events/?action=delete') return ok({ success: true });
    if (method === 'POST' && path === '/api/events/upload-flyer.php') return ok({ success: true, flyer_url: '/flyers/x.png' });
    return ok({ success: false, error: `unhandled ${method} ${path}` }, 404);
  };
}

function sampleCore(): EventCore {
  const start = asIsoUtc('2026-09-03T20:00:00Z');
  return {
    title: "what's poppin",
    description: '',
    start,
    end: asIsoUtc('2026-09-03T21:00:00Z'),
    zone: asIanaZone('Europe/Berlin'),
    organizer: { name: 'Example Club', vrchatGroupId: GRP.id, platformIds: { vrcpop: GRP.id } },
    lineup: [{ order: 1, start, end: asIsoUtc('2026-09-03T21:00:00Z'), performers: [{ name: 'Example DJ', aliases: [{ platform: 'vrcpop', name: 'Example DJ' }] }], dancers: [] }],
    hosts: [],
    dancers: [],
    visibility: { publish: false, audience: 'public' },
    flags: {},
    music: { genres: [], sceneType: 'rave' },
    links: {},
    extras: {},
  };
}

describe('adapter reads', () => {
  it('lists own clubs from /dashboard', async () => {
    const { agent } = makeFakeAgent(site());
    const clubs = await vrcpopAdapter.listOwnClubs(agent);
    expect(clubs.map((c) => c.name)).toEqual(['Example Club', 'Example Club Two']);
  });

  it('lists own events (incl. the draft) from the manage listing', async () => {
    const { agent } = makeFakeAgent(site());
    const events = await vrcpopAdapter.listOwnEvents(agent, GRP);
    expect(events.map((e) => e.status).sort()).toEqual(['draft', 'past', 'upcoming']);
  });

  it('reads an event -> EventCore + version from the edit page', async () => {
    const { agent } = makeFakeAgent(site());
    const out = await vrcpopAdapter.readEvent(agent, GRP, EVT);
    expect(out.core.title).toBe("what's poppin");
    expect(out.version).toBe(2);
    expect(out.core.lineup[0]?.genre).toBe('Open Genre'); // enriched from the lineup body
  });

  it('a failed lineup fetch throws (never silently degrades the core)', async () => {
    const failing = (req: HttpRequest): HttpResult => {
      if (req.method === 'GET' && req.path.startsWith('/api/event-lineup.php')) {
        return { status: 500, finalUrl: 'https://vrcpop.com/api/event-lineup.php', headers: {}, body: 'boom' };
      }
      return site()(req);
    };
    const { agent } = makeFakeAgent(failing);
    await expect(vrcpopAdapter.readEvent(agent, GRP, EVT)).rejects.toMatchObject({ code: 'UNKNOWN' });
  });

  it('loads vocab + resolves a performer', async () => {
    const { agent } = makeFakeAgent(site());
    const vocab = await vrcpopAdapter.loadVocab(agent);
    expect(vocab.energies).toHaveLength(4);
    const hits = await vrcpopAdapter.resolvePerformer(agent, 'Example');
    expect(hits[0]?.name).toBe('Example DJ');
  });
});

describe('adapter write execution', () => {
  it('runPlan(create draft): fetches fresh CSRF, records a create body equal to the preview', async () => {
    const { agent, httpCalls } = makeFakeAgent(site());
    const plan = vrcpopAdapter.planCreate(sampleCore(), { group: GRP, publish: false });
    const plannedBody = (plan[0]!.request as { body: unknown }).body;
    const sleep = vi.fn(async () => undefined);
    const results = await vrcpopAdapter.runPlan(plan, { agent, sleep });

    // fresh CSRF read happened before the write:
    expect(httpCalls[0]?.path).toBe('/dashboard');
    const createReq = httpCalls.find((r) => r.path === '/api/events/?action=create')!;
    expect(createReq.headers?.['X-CSRF-Token']).toBe('TEST_CSRF_TOKEN');
    expect(createReq.body).toEqual({ kind: 'json', json: plannedBody });
    expect((results.create as { event_id: number }).event_id).toBe(100009);
    // human-scale gap awaited before the write (default 300 ms):
    expect(sleep).toHaveBeenCalledWith(300);
  });

  it('runPlan(update): re-reads version 2 and submits it', async () => {
    const { agent, httpCalls } = makeFakeAgent(site());
    const plan = vrcpopAdapter.planUpdate(sampleCore(), { group: GRP, event: EVT, publish: false });
    await vrcpopAdapter.runPlan(plan, { agent, sleep: async () => undefined });
    const updateReq = httpCalls.find((r) => r.path === '/api/events/?action=update')!;
    const sent = (updateReq.body as { json: Record<string, unknown> }).json;
    expect(sent.version).toBe(2);
    expect(sent.event_id).toBe(100001);
  });

  it('a stale version -> VERSION_CONFLICT', async () => {
    const { agent } = makeFakeAgent(site({ stale: true }));
    const plan = vrcpopAdapter.planUpdate(sampleCore(), { group: GRP, event: EVT, publish: false });
    await expect(vrcpopAdapter.runPlan(plan, { agent, sleep: async () => undefined })).rejects.toMatchObject({ code: 'VERSION_CONFLICT' });
  });

  it('runPlan(set poster): uploads the flyer blob then attaches flyer_url via update', async () => {
    const { agent, httpCalls, blobs } = makeFakeAgent(site());
    const plan = vrcpopAdapter.planPoster(sampleCore(), { group: GRP, event: EVT, publish: false, poster: { filename: 'f.png', mime: 'image/png' } });
    const posterBytes = new Uint8Array([1, 2, 3, 4]);
    await vrcpopAdapter.runPlan(plan, { agent, posterBytes, sleep: async () => undefined });
    expect(blobs).toHaveLength(1);
    expect(blobs[0]?.mime).toBe('image/png');
    const flyerReq = httpCalls.find((r) => r.path === '/api/events/upload-flyer.php')!;
    expect(flyerReq.body?.kind).toBe('multipart');
    const updateReq = httpCalls.find((r) => r.path === '/api/events/?action=update')!;
    const sent = (updateReq.body as { json: Record<string, unknown> }).json;
    expect(sent.flyer_url).toBe('/flyers/x.png');
  });

  it('runPlan(delete): records {event_id}', async () => {
    const { agent, httpCalls } = makeFakeAgent(site());
    await vrcpopAdapter.runPlan(vrcpopAdapter.planDelete(EVT), { agent, sleep: async () => undefined });
    const del = httpCalls.find((r) => r.path === '/api/events/?action=delete')!;
    expect((del.body as { json: unknown }).json).toEqual({ event_id: 100001 });
  });

  it('execute() applies the injectable write delay', async () => {
    const { agent } = makeFakeAgent(site());
    const sleep = vi.fn(async () => undefined);
    await vrcpopAdapter.execute(vrcpopAdapter.planDelete(EVT)[0]!, { agent, csrf: 'T', sleep, writeDelayMs: 300 });
    expect(sleep).toHaveBeenCalledWith(300);
  });
});
