// Persisted job log (storage.local `jobs`, newest first, capped). Every plan run
// (editor create/edit/transfer, delete, poster, sync) opens a JobRecord and
// feeds runPlan's onStep through the job-recorder adapter into recordStep, so the
// user can review what the extension did — the EXACT resolved request per step,
// never auth tokens (those are added by the transport, never in a step request).
//
// Page/background side (webext storage); tested with a fake `ext.storage` like
// runtime/settings + runtime/link-store.
import { ext } from '../shared/webext';
import type { Platform } from '../shared/agent-protocol';
import type { EventRef } from './link-store';

export type JobKind = 'create' | 'edit' | 'transfer' | 'sync' | 'delete' | 'poster';
export type JobStatus = 'running' | 'done' | 'failed' | 'interrupted';
export type JobStepStatus = 'running' | 'done' | 'error';

export interface JobStepError {
  code?: string;
  message: string;
}

export interface JobStep {
  stepId: string;
  platform: Platform;
  status: JobStepStatus;
  preview: string; // resolved request JSON (never tokens)
  error?: JobStepError;
}

export interface JobRecord {
  id: string;
  kind: JobKind;
  title: string;
  startedAt: string; // ISO 8601
  finishedAt?: string;
  status: JobStatus;
  targets: Platform[];
  steps: JobStep[];
  refs: EventRef[];
}

// The subset of runPlan's StepEvent the recorder feeds in. Structural, so a real
// StepEvent (with a BridgeError) satisfies it without jobs.ts importing the ui.
export interface StepEventLike {
  stepId: string;
  status: JobStepStatus;
  request: unknown; // resolved request body (safe to preview)
  error?: { code?: string; message?: string };
}

export interface JobInit {
  kind: JobKind;
  title: string;
  targets: Platform[];
  refs?: EventRef[];
}

const KEY = 'jobs';
const CAP = 50;

async function readAll(): Promise<JobRecord[]> {
  const got = await ext.storage.local.get(KEY);
  const v = got[KEY];
  return Array.isArray(v) ? (v as JobRecord[]) : [];
}

async function writeAll(jobs: JobRecord[]): Promise<void> {
  await ext.storage.local.set({ [KEY]: jobs.slice(0, CAP) });
}

function newId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `job-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Resolved request -> preview text. Never includes tokens: a PlannedStep request
// carries only the platform payload; auth rides the transport layer.
function previewOf(request: unknown): string {
  try {
    return JSON.stringify(request, null, 2);
  } catch {
    return String(request);
  }
}

// Open a job (running). Prepends newest-first, capped.
export async function startJob(init: JobInit): Promise<JobRecord> {
  const job: JobRecord = {
    id: newId(),
    kind: init.kind,
    title: init.title,
    startedAt: new Date().toISOString(),
    status: 'running',
    targets: init.targets,
    steps: [],
    refs: init.refs ?? [],
  };
  await writeAll([job, ...(await readAll())]);
  return job;
}

// Upsert a step by stepId (running -> done/error replaces in place).
export async function recordStep(jobId: string, evt: StepEventLike, platform: Platform): Promise<void> {
  const all = await readAll();
  const job = all.find((j) => j.id === jobId);
  if (!job) return;
  const step: JobStep = { stepId: evt.stepId, platform, status: evt.status, preview: previewOf(evt.request) };
  if (evt.error) step.error = { code: evt.error.code, message: evt.error.message ?? 'error' };
  job.steps = [...job.steps.filter((s) => s.stepId !== evt.stepId), step];
  await writeAll(all);
}

export async function finishJob(jobId: string, status: Exclude<JobStatus, 'running'>, refs?: EventRef[]): Promise<void> {
  const all = await readAll();
  const job = all.find((j) => j.id === jobId);
  if (!job) return;
  job.status = status;
  job.finishedAt = new Date().toISOString();
  if (refs && refs.length) job.refs = refs;
  await writeAll(all);
}

export async function listJobs(): Promise<JobRecord[]> {
  return readAll();
}

export async function clearFinishedJobs(): Promise<JobRecord[]> {
  const remaining = (await readAll()).filter((j) => j.status === 'running');
  await writeAll(remaining);
  return remaining;
}

// Called once on dashboard boot: a job left 'running' from a previous session
// (page closed mid-run) can never resume, so mark it interrupted.
export async function markInterrupted(): Promise<void> {
  const all = await readAll();
  let changed = false;
  for (const job of all) {
    if (job.status === 'running') {
      job.status = 'interrupted';
      job.finishedAt = new Date().toISOString();
      changed = true;
    }
  }
  if (changed) await writeAll(all);
}
