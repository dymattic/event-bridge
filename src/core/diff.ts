// Field-level diff of two EventCores -> dot-path change list.
// Arrays (incl. slots) diffed by index/order.
import type { EventCore } from './schema';
import type { JsonValue } from './hash';

export interface ChangedPath {
  path: string; // dot path, array indices as `.N`
  from: JsonValue | undefined; // undefined = key/element added in `b`
  to: JsonValue | undefined; // undefined = key/element removed in `b`
}

function isPlainObject(v: unknown): v is Record<string, JsonValue> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// Normalize to JsonValue, dropping `undefined` so it never shows as a change.
function norm(v: unknown): JsonValue | undefined {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const t = typeof v;
  if (t === 'number' || t === 'boolean' || t === 'string') return v as JsonValue;
  if (v instanceof Uint8Array) return `bytes:${v.length}`;
  if (Array.isArray(v)) return v.map((e) => norm(e) ?? null);
  if (t === 'object') {
    const out: Record<string, JsonValue> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const n = norm(val);
      if (n !== undefined) out[k] = n;
    }
    return out;
  }
  return null;
}

function walk(a: JsonValue | undefined, b: JsonValue | undefined, path: string, out: ChangedPath[]): void {
  if (a === undefined && b === undefined) return;
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of [...keys].sort()) {
      walk(a[k], b[k], path ? `${path}.${k}` : k, out);
    }
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) {
      walk(a[i], b[i], `${path}.${i}`, out);
    }
    return;
  }
  if (!deepEqual(a, b)) out.push({ path, from: a, to: b });
}

function deepEqual(a: JsonValue | undefined, b: JsonValue | undefined): boolean {
  if (a === b) return true;
  if (isPlainObject(a) && isPlainObject(b)) {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    return ak.every((k) => deepEqual(a[k], b[k]));
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((e, i) => deepEqual(e, b[i]));
  }
  return false;
}

export function diffEvents(a: EventCore, b: EventCore): ChangedPath[] {
  const out: ChangedPath[] = [];
  walk(norm(a), norm(b), '', out);
  return out;
}
