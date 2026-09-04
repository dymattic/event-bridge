import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { JsonValue } from '../../src/core/hash';
import type { PlannedStep } from '../../src/core/planner';
import { ref } from '../../src/core/planner';

const h = vi.hoisted(() => ({
  execOrder: [] as string[],
  execRequests: {} as Record<string, JsonValue>,
  paceCalls: [] as string[],
  failAt: null as string | null,
  results: {} as Record<string, JsonValue>,
}));

vi.mock('../../src/ui/dashboard/lib/event-data', () => ({
  paceHost: (p: string) => {
    h.paceCalls.push(p);
    return Promise.resolve();
  },
}));

vi.mock('../../src/adapters/registry', () => ({
  getAdapter: () => ({
    execute: (step: PlannedStep): Promise<JsonValue> => {
      h.execOrder.push(step.id);
      h.execRequests[step.id] = step.request;
      if (h.failAt === step.id) return Promise.reject(new Error(`boom at ${step.id}`));
      return Promise.resolve(h.results[step.id] ?? ({ id: `id-${step.id}` } as JsonValue));
    },
  }),
}));

import { runPlan, type StepEvent } from '../../src/ui/dashboard/lib/run-plan';

function step(id: string, request: JsonValue): PlannedStep {
  return { id, platform: 'vrctl', kind: 'create', routeId: 'r', request, previewLabel: id };
}

beforeEach(() => {
  h.execOrder = [];
  h.execRequests = {};
  h.paceCalls = [];
  h.failAt = null;
  h.results = { s1: { id: 'e1' } };
});

describe('runPlan', () => {
  it('runs steps in order, resolves $ref against prior results, paces each step', async () => {
    const steps = [
      step('s1', { n: 1 }),
      step('s2', { parent: ref('s1', 'id'), n: 2 }),
      step('s3', { n: 3 }),
    ];
    const out = await runPlan('vrctl', steps);
    expect(out.ok).toBe(true);
    expect(h.execOrder).toEqual(['s1', 's2', 's3']);
    expect((h.execRequests.s2 as { parent: string }).parent).toBe('e1'); // $ref resolved
    expect(h.paceCalls).toEqual(['vrctl', 'vrctl', 'vrctl']); // paced per step
    expect(out.results.s1).toEqual({ id: 'e1' });
  });

  it('emits running/done onStep events per step', async () => {
    const events: StepEvent[] = [];
    await runPlan('vrctl', [step('s1', { n: 1 })], { onStep: (e) => events.push(e) });
    expect(events.map((e) => `${e.stepId}:${e.status}`)).toEqual(['s1:running', 's1:done']);
    expect(events[1]?.result).toEqual({ id: 'e1' });
  });

  it('stops at the first failure with failedStepId + error and does not run later steps', async () => {
    h.failAt = 's2';
    const events: StepEvent[] = [];
    const out = await runPlan('vrctl', [step('s1', {}), step('s2', {}), step('s3', {})], { onStep: (e) => events.push(e) });
    expect(out.ok).toBe(false);
    expect(out.failedStepId).toBe('s2');
    expect(out.error?.message).toContain('boom at s2');
    expect(h.execOrder).toEqual(['s1', 's2']); // s3 never runs
    expect(events.some((e) => e.stepId === 's2' && e.status === 'error')).toBe(true);
  });

  it('resumes with prior results (retry from failed step skips completed steps)', async () => {
    const steps = [step('s1', {}), step('s2', {}), step('s3', {})];
    const out = await runPlan('vrctl', steps, { results: { s1: { id: 'e1' } } });
    expect(out.ok).toBe(true);
    expect(h.execOrder).toEqual(['s2', 's3']); // s1 already done
    expect(h.paceCalls).toEqual(['vrctl', 'vrctl']);
  });
});
