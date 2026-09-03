// Plan/execute split. A plan is an ordered list of PlannedSteps whose request
// bodies may reference earlier steps' results via {$ref:'<stepId>.<path>'}
// placeholders (e.g. a slot payload referencing the just-created event id).
import type { PlatformId } from './schema';
import type { JsonValue } from './hash';
import { BridgeError } from './errors';

export type StepKind = 'create' | 'update' | 'delete' | 'poster' | 'lineup' | 'performer' | 'genres';

export interface PlannedStep {
  id: string; // unique within a plan; no dots
  platform: PlatformId;
  kind: StepKind;
  routeId: string; // adapter ROUTES key (allowlisted transport)
  request: JsonValue; // may contain {$ref:'stepId.path'} placeholders
  previewLabel: string;
}

interface RefNode {
  $ref: string;
}

function isRefNode(v: unknown): v is RefNode {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    Object.keys(v).length === 1 &&
    typeof (v as Record<string, unknown>).$ref === 'string'
  );
}

// Make a ref placeholder for use in a step request. Typed as JsonValue so it
// slots directly into a request body (a RefNode is a plain JSON object).
export function ref(stepId: string, path: string): JsonValue {
  return { $ref: `${stepId}.${path}` };
}

function drill(root: JsonValue, segments: string[], refStr: string): JsonValue {
  let cur: JsonValue = root;
  for (const seg of segments) {
    if (Array.isArray(cur)) {
      const idx = Number(seg);
      if (!Number.isInteger(idx) || idx < 0 || idx >= cur.length) {
        throw new BridgeError('UNRESOLVED_REF', `ref ${refStr}: index ${seg} out of range`);
      }
      cur = cur[idx] as JsonValue;
    } else if (typeof cur === 'object' && cur !== null) {
      if (!(seg in cur)) throw new BridgeError('UNRESOLVED_REF', `ref ${refStr}: key ${seg} missing`);
      cur = (cur as Record<string, JsonValue>)[seg] as JsonValue;
    } else {
      throw new BridgeError('UNRESOLVED_REF', `ref ${refStr}: cannot descend into ${seg}`);
    }
  }
  return cur;
}

function resolveValue(v: JsonValue, results: Record<string, JsonValue>): JsonValue {
  if (isRefNode(v)) {
    const dot = v.$ref.indexOf('.');
    const stepId = dot === -1 ? v.$ref : v.$ref.slice(0, dot);
    const path = dot === -1 ? '' : v.$ref.slice(dot + 1);
    if (!(stepId in results)) throw new BridgeError('UNRESOLVED_REF', `ref ${v.$ref}: no result for step ${stepId}`);
    const base = results[stepId] as JsonValue;
    return path ? drill(base, path.split('.'), v.$ref) : base;
  }
  if (Array.isArray(v)) return v.map((e) => resolveValue(e, results));
  if (typeof v === 'object' && v !== null) {
    const out: Record<string, JsonValue> = {};
    for (const [k, val] of Object.entries(v)) out[k] = resolveValue(val as JsonValue, results);
    return out;
  }
  return v;
}

// Return a copy of the step with every {$ref} replaced by the referenced value.
// Throws BridgeError('UNRESOLVED_REF') if a ref has no matching result.
export function resolveRefs(step: PlannedStep, results: Record<string, JsonValue>): PlannedStep {
  return { ...step, request: resolveValue(step.request, results) };
}

function humanizeRef(refStr: string): string {
  const seg = refStr.split('.').pop() ?? refStr;
  return `<new ${seg.replace(/_/g, ' ')}>`;
}

function previewValue(v: JsonValue): JsonValue {
  if (isRefNode(v)) return humanizeRef(v.$ref);
  if (Array.isArray(v)) return v.map(previewValue);
  if (typeof v === 'object' && v !== null) {
    const out: Record<string, JsonValue> = {};
    for (const [k, val] of Object.entries(v)) out[k] = previewValue(val as JsonValue);
    return out;
  }
  return v;
}

// Human-readable preview: refs become `<new event id>`-style tokens.
export function renderPreview(step: PlannedStep): string {
  const body = JSON.stringify(previewValue(step.request), null, 2);
  return `${step.previewLabel} [${step.platform}:${step.kind}]\n${body}`;
}
