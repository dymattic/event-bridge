import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { clearFinishedJobs, finishJob, listJobs, markInterrupted, recordStep, startJob } from '../../src/runtime/jobs';
import { createFake } from './fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('jobs store', () => {
  it('startJob prepends newest-first and returns a running record', async () => {
    const a = await startJob({ kind: 'create', title: 'A', targets: ['vrctl'] });
    await startJob({ kind: 'edit', title: 'B', targets: ['vrcpop'] });
    const jobs = await listJobs();
    expect(jobs.map((j) => j.title)).toEqual(['B', 'A']); // newest first
    expect(a.status).toBe('running');
  });

  it('recordStep upserts a step by stepId (running -> done in place)', async () => {
    const job = await startJob({ kind: 'sync', title: 'S', targets: ['vrctl'] });
    await recordStep(job.id, { stepId: 'finalize', status: 'running', request: { a: 1 } }, 'vrctl');
    await recordStep(job.id, { stepId: 'finalize', status: 'done', request: { a: 1 } }, 'vrctl');
    const j = (await listJobs()).find((x) => x.id === job.id)!;
    expect(j.steps).toHaveLength(1);
    expect(j.steps[0]?.status).toBe('done');
    expect(j.steps[0]?.preview).toContain('"a": 1'); // resolved request preview
  });

  it('records a step error code + message', async () => {
    const job = await startJob({ kind: 'delete', title: 'D', targets: ['vrctl'] });
    await recordStep(job.id, { stepId: 'delete', status: 'error', request: {}, error: { code: 'NETWORK', message: 'boom' } }, 'vrctl');
    const step = (await listJobs())[0]?.steps[0];
    expect(step?.error).toEqual({ code: 'NETWORK', message: 'boom' });
  });

  it('finishJob sets status + finishedAt + refs', async () => {
    const job = await startJob({ kind: 'create', title: 'A', targets: ['vrctl'] });
    await finishJob(job.id, 'done', [{ platform: 'vrctl', id: '9' }]);
    const j = (await listJobs())[0]!;
    expect(j.status).toBe('done');
    expect(typeof j.finishedAt).toBe('string');
    expect(j.refs).toEqual([{ platform: 'vrctl', id: '9' }]);
  });

  it('caps at 50, newest kept', async () => {
    for (let i = 0; i < 55; i++) await startJob({ kind: 'create', title: `t${i}`, targets: [] });
    const jobs = await listJobs();
    expect(jobs).toHaveLength(50);
    expect(jobs[0]?.title).toBe('t54');
    expect(jobs.at(-1)?.title).toBe('t5'); // t0..t4 dropped
  });

  it('clearFinishedJobs keeps only running jobs', async () => {
    const a = await startJob({ kind: 'create', title: 'A', targets: [] });
    await finishJob(a.id, 'done');
    await startJob({ kind: 'sync', title: 'B', targets: [] }); // stays running
    const remaining = await clearFinishedJobs();
    expect(remaining.map((j) => j.title)).toEqual(['B']);
    expect(await listJobs()).toHaveLength(1);
  });

  it('markInterrupted flips running -> interrupted', async () => {
    const a = await startJob({ kind: 'create', title: 'A', targets: [] });
    await finishJob(a.id, 'done');
    await startJob({ kind: 'sync', title: 'B', targets: [] });
    await markInterrupted();
    const jobs = await listJobs();
    expect(jobs.find((j) => j.title === 'B')?.status).toBe('interrupted');
    expect(jobs.find((j) => j.title === 'A')?.status).toBe('done'); // finished untouched
  });
});
