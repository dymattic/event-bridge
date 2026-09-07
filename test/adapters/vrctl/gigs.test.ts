// @vitest-environment happy-dom
// vrc.tl listGigs: scan the admin grid, read upcoming detail forms, keep events
// whose lineup names a matching performer. Fake `send` serves the sanitized grid
// + detail fixtures and records every request.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { HttpRequest, HttpResult } from '../../../src/shared/agent-protocol';
import { listGigs, MAX_EVENT_READS } from '../../../src/adapters/vrctl/adapter';

const FIX = join(process.cwd(), 'test', 'fixtures', 'vrctl');
const GRID = readFileSync(join(FIX, 'admin-grid.html'), 'utf8');
const DETAIL = readFileSync(join(FIX, 'detail-form.html'), 'utf8');
const noPace = async (): Promise<void> => undefined;

function mockSend(): { send: (r: HttpRequest) => Promise<HttpResult>; calls: HttpRequest[] } {
  const calls: HttpRequest[] = [];
  const send = async (req: HttpRequest): Promise<HttpResult> => {
    calls.push(req);
    const okr = (finalUrl: string, body: string): HttpResult => ({ status: 200, finalUrl, headers: {}, body });
    if (req.method === 'GET' && req.path.startsWith('/admin/event/detail/')) return okr(`https://vrc.tl${req.path}`, DETAIL);
    if (req.method === 'GET' && req.path === '/admin/event') return okr('https://vrc.tl/admin/event', GRID);
    return okr(`https://vrc.tl${req.path}`, '');
  };
  return { send, calls };
}

const detailReads = (calls: HttpRequest[]): HttpRequest[] => calls.filter((c) => c.path.startsWith('/admin/event/detail/'));
const gridReads = (calls: HttpRequest[]): HttpRequest[] => calls.filter((c) => c.path === '/admin/event');

describe('vrctl listGigs', () => {
  it('names empty -> [] with no requests', async () => {
    const { send, calls } = mockSend();
    const gigs = await listGigs(send, [], { now: Date.parse('2026-09-02T12:00:00Z'), pace: noPace });
    expect(gigs).toEqual([]);
    expect(calls).toHaveLength(0);
  });

  it('matches by slot performer name; past grid rows are skipped (no detail read)', async () => {
    const { send, calls } = mockSend();
    // 2026-09-02: only the 2030 row is upcoming; the two 2026-08/09 rows are past.
    const gigs = await listGigs(send, ['Example DJ'], { now: Date.parse('2026-09-02T12:00:00Z'), pace: noPace });

    expect(gridReads(calls)).toHaveLength(1);
    expect(detailReads(calls)).toHaveLength(1); // only the upcoming row was read
    expect(detailReads(calls)[0]?.path).toBe('/admin/event/detail/100002');

    expect(gigs).toHaveLength(1);
    const g = gigs[0]!;
    expect(g.eventId).toBe('100002');
    expect(g.title).toBe("what's poppin");
    expect(g.eventUrl).toBe('https://vrc.tl/event/100002');
    expect(g.clubName).toBe('Example Club');
    expect(g.matchedName).toBe('Example DJ');
    expect(g.source).toBe('own-event');
    expect(g.status).toBe('confirmed');
  });

  it('non-matching name -> no gigs (all upcoming rows read, none kept)', async () => {
    const { send, calls } = mockSend();
    const gigs = await listGigs(send, ['Nobody At All'], { now: 0, pace: noPace });
    expect(gigs).toEqual([]);
    expect(detailReads(calls).length).toBeGreaterThan(0);
  });

  it('caps detail reads at maxEventReads', async () => {
    const { send, calls } = mockSend();
    // now=0 -> all three grid rows count as upcoming; cap to 2 reads.
    const gigs = await listGigs(send, ['Example DJ'], { now: 0, pace: noPace, maxEventReads: 2 });
    expect(detailReads(calls)).toHaveLength(2);
    expect(gigs).toHaveLength(2);
    expect(MAX_EVENT_READS).toBe(25);
  });
});
