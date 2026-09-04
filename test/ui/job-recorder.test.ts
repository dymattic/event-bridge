import { beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ ext: undefined as unknown }));
vi.mock('../../src/shared/webext', () => ({
  get ext() {
    return h.ext;
  },
}));

import { startJobRun } from '../../src/ui/dashboard/lib/job-recorder';
import { listJobs } from '../../src/runtime/jobs';
import { createFake } from '../runtime/fake-ext';

beforeEach(() => {
  h.ext = createFake().ext;
});

describe('job-recorder', () => {
  it('records steps under the job per platform and finishes it', async () => {
    const job = await startJobRun({ kind: 'sync', title: 'Rave', targets: ['vrctl'] });
    const rec = job.stepRecorder('vrctl');
    rec({ stepId: 'finalize', status: 'running', request: { name: 'Rave' } });
    rec({ stepId: 'finalize', status: 'done', request: { name: 'Rave' } });
    await job.finish('done', [{ platform: 'vrctl', id: '2' }]);

    const jobs = await listJobs();
    const j = jobs.find((x) => x.id === job.id)!;
    expect(j.kind).toBe('sync');
    expect(j.status).toBe('done');
    expect(j.steps).toHaveLength(1);
    expect(j.steps[0]).toMatchObject({ stepId: 'finalize', platform: 'vrctl', status: 'done' });
    expect(j.refs).toEqual([{ platform: 'vrctl', id: '2' }]);
  });

  it('serializes overlapping writes (finish runs after queued steps)', async () => {
    const job = await startJobRun({ kind: 'create', title: 'A', targets: ['vrcpop'] });
    const rec = job.stepRecorder('vrcpop');
    rec({ stepId: 's1', status: 'running', request: {} });
    rec({ stepId: 's1', status: 'done', request: {} });
    rec({ stepId: 's2', status: 'done', request: {} });
    await job.finish('done');
    const j = (await listJobs()).find((x) => x.id === job.id)!;
    expect(j.steps.map((s) => s.stepId)).toEqual(['s1', 's2']);
    expect(j.status).toBe('done');
  });
});
