// Shared sequential plan runner for the event editor (create/edit, any platform).
// Resolves {$ref} against accumulated results, paces third-party hosts, dispatches
// each step through the adapter's own `execute` (which self-binds its agent/CSRF
// context), and STOPS at the first failure — no silent retry. Emits a StepEvent
// per transition for a live UI log. `opts.results` seeds prior results so
// "Retry from failed step" resumes without re-running completed steps.
//
// Wraps the adapter registry (webext) -> NOT node-importable; render tests mock it.
// P7 (jobs.ts) extends this with persistence/resume; poster BYTES ride the
// adapter's imperative setPoster (see the editor), not a JSON step.
import type { PlannedStep } from '../../../core/planner';
import { resolveRefs } from '../../../core/planner';
import type { JsonValue } from '../../../core/hash';
import { BridgeError } from '../../../core/errors';
import type { Platform } from '../../../shared/agent-protocol';
import { getAdapter } from '../../../adapters/registry';
import { paceHost } from './event-data';

export type StepStatus = 'running' | 'done' | 'error';

export interface StepEvent {
  stepId: string;
  status: StepStatus;
  request: JsonValue; // resolved request (safe to preview)
  result?: JsonValue;
  error?: BridgeError;
}

export interface RunPlanOpts {
  onStep?: (evt: StepEvent) => void;
  results?: Record<string, JsonValue>; // prior results (retry-from-failed)
}

export interface RunPlanResult {
  results: Record<string, JsonValue>;
  ok: boolean;
  failedStepId?: string;
  error?: BridgeError;
}

function toBridgeError(e: unknown): BridgeError {
  if (e instanceof BridgeError) return e;
  return new BridgeError('UNKNOWN', e instanceof Error ? e.message : String(e));
}

export async function runPlan(platform: Platform, steps: PlannedStep[], opts: RunPlanOpts = {}): Promise<RunPlanResult> {
  const results: Record<string, JsonValue> = { ...(opts.results ?? {}) };
  const adapter = getAdapter(platform);

  for (const step of steps) {
    if (step.id in results) continue; // already done (resume)

    let resolved: PlannedStep;
    try {
      resolved = resolveRefs(step, results);
    } catch (e) {
      const error = toBridgeError(e);
      opts.onStep?.({ stepId: step.id, status: 'error', request: step.request, error });
      return { results, ok: false, failedStepId: step.id, error };
    }

    opts.onStep?.({ stepId: step.id, status: 'running', request: resolved.request });
    await paceHost(platform);

    try {
      const result = await adapter.execute(resolved);
      results[step.id] = result;
      opts.onStep?.({ stepId: step.id, status: 'done', request: resolved.request, result });
    } catch (e) {
      const error = toBridgeError(e);
      opts.onStep?.({ stepId: step.id, status: 'error', request: resolved.request, error });
      return { results, ok: false, failedStepId: step.id, error };
    }
  }

  return { results, ok: true };
}
