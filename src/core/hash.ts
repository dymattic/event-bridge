// Canonical JSON + sha256. crypto.subtle is available in DOM and WebWorker libs.
import { BridgeError } from './errors';

export type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue };

// Deterministic JSON: object keys sorted, `undefined` dropped (keys and array
// holes). Numbers/strings/bools/null serialize as standard JSON.
export function canonicalJson(value: unknown): string {
  return serialize(value);
}

function serialize(v: unknown): string {
  if (v === null) return 'null';
  const t = typeof v;
  if (t === 'number') return Number.isFinite(v as number) ? JSON.stringify(v) : 'null';
  if (t === 'boolean' || t === 'string') return JSON.stringify(v);
  if (t === 'bigint') return JSON.stringify(String(v));
  if (Array.isArray(v)) {
    return `[${v.map((e) => (e === undefined ? 'null' : serialize(e))).join(',')}]`;
  }
  if (t === 'object') {
    const obj = v as Record<string, unknown>;
    const keys = Object.keys(obj)
      .filter((k) => obj[k] !== undefined)
      .sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${serialize(obj[k])}`).join(',')}}`;
  }
  // undefined / function / symbol at top level -> null (JSON has no representation)
  return 'null';
}

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

export async function sha256Hex(input: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new BridgeError('UNSUPPORTED', 'crypto.subtle unavailable');
  const data = new TextEncoder().encode(input);
  const digest = await subtle.digest('SHA-256', data);
  return toHex(digest);
}

// sha256 of the canonical JSON of a value.
export async function hashCanonical(value: unknown): Promise<string> {
  return sha256Hex(canonicalJson(value));
}
