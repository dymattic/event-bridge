// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type { HttpRequest, HttpResult } from '../../../src/shared/agent-protocol';
import type { EventCore, PosterFile } from '../../../src/core/schema';
import { fromVrctl } from '../../../src/core/mapping/from-vrctl';
import { parseDetailForm } from '../../../src/adapters/vrctl/parse';
import { asDeleteAction, asEventId, asOrganizerId } from '../../../src/adapters/vrctl/ids';
import {
  execute,
  planCreate,
  planDelete,
  planUpdate,
  runPlan,
  type StepResults,
  type VrctlExecCtx,
  type VrctlStep,
} from '../../../src/adapters/vrctl/planner';

const DETAIL = readFileSync(join(process.cwd(), 'test', 'fixtures', 'vrctl', 'detail-form.html'), 'utf8');
const ORG = asOrganizerId('9001');

function coreFromFixture(overrides: Partial<EventCore> = {}): EventCore {
  return { ...fromVrctl(parseDetailForm(DETAIL), { organizerName: 'Example Club' }), ...overrides };
}

interface MockOpts {
  createLanding?: string;
  createLocation?: string;
  submitBody?: string;
  signInOn?: 'detail' | 'create';
}

function mockSend(opts: MockOpts = {}): { send: (r: HttpRequest) => Promise<HttpResult>; calls: HttpRequest[] } {
  const calls: HttpRequest[] = [];
  const send = async (req: HttpRequest): Promise<HttpResult> => {
    calls.push(req);
    const ok = (finalUrl: string, body: string, headers: Record<string, string> = {}): HttpResult => ({ status: 200, finalUrl, headers, body });
    if (req.method === 'POST' && req.path.startsWith('/admin/event/create')) {
      if (opts.signInOn === 'create') return ok('https://vrc.tl/sign/in', '');
      return ok(opts.createLanding ?? 'https://vrc.tl/admin/event/detail/100002', DETAIL, opts.createLocation ? { location: opts.createLocation } : {});
    }
    if (req.method === 'POST' && req.path.startsWith('/admin/event/detail/')) {
      return ok(`https://vrc.tl${req.path}`, opts.submitBody ?? DETAIL);
    }
    if (req.method === 'GET' && req.path.startsWith('/admin/event/detail/')) {
      if (opts.signInOn === 'detail') return ok('https://vrc.tl/sign/in', '');
      return ok(`https://vrc.tl${req.path}`, DETAIL);
    }
    if (req.method === 'GET' && req.path.startsWith('/admin/event?')) return ok('https://vrc.tl/admin/event', '<table/>');
    return ok(`https://vrc.tl${req.path}`, '');
  };
  return { send, calls };
}

describe('planCreate validation', () => {
  it('throws VALIDATION before any request when NSFW/SFW is missing', () => {
    const core = coreFromFixture({ flags: {} });
    expect(() => planCreate(core, { organizerId: ORG })).toThrow(/nsfw/i);
  });
});

describe('runPlan create flow', () => {
  it('create -> detailRead -> detailWrite -> detailReadBack', async () => {
    const { send, calls } = mockSend();
    const steps = planCreate(coreFromFixture(), { organizerId: ORG, publish: false });
    const results = await runPlan(steps, { send, writeDelayMs: 0 });

    const create = results['create'];
    expect(create?.kind === 'create' && create.eventId).toBe('100002');

    // previewed create field list == the urlencoded body actually sent
    const createStep = steps[0];
    const sentCreate = calls.find((c) => c.method === 'POST' && c.path.startsWith('/admin/event/create'));
    expect(createStep?.kind === 'create' && sentCreate?.body).toEqual({
      kind: 'urlencoded',
      fields: createStep?.kind === 'create' ? createStep.fields : [],
    });

    const write = results['detailWrite'];
    const sentNames = write?.kind === 'detailWrite' ? write.sentFieldNames : [];
    expect(sentNames).toContain('flags[1]');
    expect(sentNames).toContain('organizers[]');
    expect(sentNames).not.toContain('published'); // publish:false

    const back = results['detailReadBack'];
    expect(back?.kind === 'detailReadBack' && back.slotIds).toEqual(['136569']);
  });

  it('detail POST is multipart and carries the scraped slot id', async () => {
    const { send, calls } = mockSend();
    await runPlan(planCreate(coreFromFixture(), { organizerId: ORG }), { send, writeDelayMs: 0 });
    const post = calls.find((c) => c.method === 'POST' && c.path.startsWith('/admin/event/detail/'));
    expect(post?.body?.kind).toBe('multipart');
    const parts = post?.body?.kind === 'multipart' ? post.body.parts : [];
    expect(parts.some((p) => p.name === 'slots[136569][duration]')).toBe(true);
  });
});

describe('created id extraction', () => {
  it('reads the id from a Location header when present', async () => {
    const { send } = mockSend({ createLanding: '', createLocation: '/admin/event/detail/100003' });
    const step = planCreate(coreFromFixture(), { organizerId: ORG })[0]!;
    const r = await execute(step, { send, writeDelayMs: 0 }, {});
    expect(r.kind === 'create' && r.eventId).toBe('100003');
  });
  it('falls back to finalUrl when the agent followed the redirect', async () => {
    const { send } = mockSend({ createLanding: 'https://vrc.tl/admin/event/detail/100009' });
    const step = planCreate(coreFromFixture(), { organizerId: ORG })[0]!;
    const r = await execute(step, { send, writeDelayMs: 0 }, {});
    expect(r.kind === 'create' && r.eventId).toBe('100009');
  });
});

describe('human-scale write spacing', () => {
  it('sleeps between consecutive writes (create -> detailWrite)', async () => {
    const sleep = vi.fn(async () => undefined);
    const { send } = mockSend();
    await runPlan(planCreate(coreFromFixture(), { organizerId: ORG }), { send, sleep, writeDelayMs: 300 });
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(sleep).toHaveBeenCalledWith(300);
  });
});

describe('error mapping', () => {
  it('sign-in redirect -> NOT_LOGGED_IN', async () => {
    const { send } = mockSend({ signInOn: 'detail' });
    const step: VrctlStep = { id: 'detailRead', kind: 'detailRead', event: { kind: 'literal', id: asEventId('100002') }, preview: '' };
    await expect(execute(step, { send }, {})).rejects.toMatchObject({ code: 'NOT_LOGGED_IN' });
  });

  it('Nette error markers in the response -> VALIDATION', async () => {
    const { send } = mockSend({ submitBody: '<html><body><div class="alert alert-danger">You need to choose one event tag from category NSFW / SFW.</div></body></html>' });
    const results: StepResults = { detailRead: { kind: 'detailRead', form: parseDetailForm(DETAIL) } };
    const step: VrctlStep = {
      id: 'detailWrite',
      kind: 'detailWrite',
      event: { kind: 'literal', id: asEventId('100002') },
      formFrom: 'detailRead',
      core: coreFromFixture(),
      publish: false,
      preview: '',
    };
    await expect(execute(step, { send, writeDelayMs: 0 }, results)).rejects.toMatchObject({ code: 'VALIDATION' });
  });
});

describe('delete', () => {
  it('runs the exact grid delete action URL', async () => {
    const { send, calls } = mockSend();
    const action = '/admin/event?grid-grid-__id=100002&grid-grid-__key=delete&do=grid-grid-actionCallback';
    await runPlan(planDelete(asDeleteAction(action)), { send, writeDelayMs: 0 });
    const del = calls.find((c) => c.path.includes('grid-grid-__key=delete'));
    expect(del?.path).toBe(action);
  });
});

describe('poster upload', () => {
  it('uploads bytes via sendBlob and posts a multipart posterUpload part', async () => {
    const poster: PosterFile = { bytes: new Uint8Array([9, 8, 7]), mimeType: 'image/png', filename: 'poster.png' };
    const sendBlob = vi.fn(async () => ({ blobId: 'blob-xyz' }));
    const { send, calls } = mockSend();
    const ctx: VrctlExecCtx = { send, sendBlob, writeDelayMs: 0 };
    await runPlan(planUpdate(coreFromFixture(), { eventId: asEventId('100002'), poster }), ctx);
    expect(sendBlob).toHaveBeenCalledTimes(1);
    const post = calls.find((c) => c.method === 'POST' && c.path.startsWith('/admin/event/detail/'));
    const parts = post?.body?.kind === 'multipart' ? post.body.parts : [];
    const upload = parts.find((p) => p.name === 'posterUpload');
    expect(upload && 'blobId' in upload ? upload.blobId : null).toBe('blob-xyz');
  });
});
