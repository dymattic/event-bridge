// Tiny adapter between runPlan's onStep and the persisted job store, so run-plan
// stays decoupled from persistence. Open a job with startJobRun, feed each
// target's runPlan an onStep from stepRecorder(platform), then finish(status).
// Writes are serialized through one promise chain per job so overlapping
// running/done events never lose an update (each recordStep is a read-modify-write).
//
// Wraps runtime/jobs (webext storage) -> NOT node-importable; render tests mock it.
import type { Platform } from '../../../shared/agent-protocol';
import type { EventRef } from '../../../runtime/link-store';
import {
  finishJob,
  recordStep,
  startJob,
  type JobInit,
  type JobStatus,
  type StepEventLike,
} from '../../../runtime/jobs';

export type StepRecorder = (evt: StepEventLike) => void;

export interface JobHandle {
  id: string;
  // An onStep for one platform's runPlan (records each step under this job).
  stepRecorder(platform: Platform): StepRecorder;
  finish(status: Exclude<JobStatus, 'running'>, refs?: EventRef[]): Promise<void>;
}

export async function startJobRun(init: JobInit): Promise<JobHandle> {
  const job = await startJob(init);
  let chain: Promise<unknown> = Promise.resolve();
  const enqueue = <T>(fn: () => Promise<T>): Promise<T> => {
    const next = chain.then(fn, fn);
    chain = next.catch(() => undefined);
    return next;
  };
  return {
    id: job.id,
    stepRecorder: (platform) => (evt) => {
      void enqueue(() => recordStep(job.id, evt, platform));
    },
    finish: (status, refs) => enqueue(() => finishJob(job.id, status, refs)),
  };
}
