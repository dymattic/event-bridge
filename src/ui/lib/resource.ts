// Tiny in-memory stale-while-revalidate cache + React hook. Zero deps.
// One shared module-level cache keyed by string; a subscriber set per key so any
// number of components mounted on the same key re-render when its data settles
// (a second consumer of an in-flight key is deduped, not a second fetch).
import { useCallback, useEffect, useRef, useState } from 'react';

interface Entry<T> {
  data?: T;
  error?: Error;
  ts: number; // last settle time (ms); 0 = never settled
  promise?: Promise<void>; // present while a load is in flight
}

const DEFAULT_TTL_MS = 5 * 60_000;

const cache = new Map<string, Entry<unknown>>();
const subs = new Map<string, Set<() => void>>();

function asError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

function notify(key: string): void {
  const set = subs.get(key);
  if (set) for (const cb of set) cb();
}

function subscribe(key: string, cb: () => void): () => void {
  let set = subs.get(key);
  if (!set) {
    set = new Set();
    subs.set(key, set);
  }
  set.add(cb);
  return () => {
    set?.delete(cb);
    if (set && set.size === 0) subs.delete(key);
  };
}

function startLoad<T>(key: string, loader: () => Promise<T>): void {
  const prev = cache.get(key) as Entry<T> | undefined;
  const p = loader()
    .then((data) => {
      cache.set(key, { data, ts: Date.now() });
    })
    .catch((e: unknown) => {
      const cur = cache.get(key) as Entry<T> | undefined;
      cache.set(key, { data: cur?.data, error: asError(e), ts: Date.now() });
    })
    .finally(() => notify(key));
  cache.set(key, { data: prev?.data, error: prev?.error, ts: prev?.ts ?? 0, promise: p });
  notify(key); // reflect loading immediately
}

function ensureLoaded<T>(key: string, ttlMs: number, loader: () => Promise<T>): void {
  const cur = cache.get(key) as Entry<T> | undefined;
  if (cur?.promise) return; // already in flight
  const fresh = cur !== undefined && cur.error === undefined && cur.data !== undefined && Date.now() - cur.ts < ttlMs;
  if (fresh) return;
  startLoad(key, loader);
}

// Drop every cache entry whose key starts with `prefix` (e.g. 'events:' after a
// delete). Next mount/refresh reloads it.
export function invalidate(prefix: string): void {
  for (const k of [...cache.keys()]) {
    if (k.startsWith(prefix)) cache.delete(k);
  }
  for (const k of [...subs.keys()]) {
    if (k.startsWith(prefix)) notify(k);
  }
}

// Test-only: wipe the whole cache (kept tiny; no separate test build).
export function clearResourceCache(): void {
  cache.clear();
}

export interface ResourceResult<T> {
  data?: T;
  error?: Error;
  loading: boolean;
  stale: boolean; // has data AND a revalidation is in flight
  refresh: () => void;
}

// key === null -> idle (no load, no data). Use it to gate on a precondition
// (e.g. a platform not yet known to be connected).
export function useResource<T>(
  key: string | null,
  loader: () => Promise<T>,
  opts: { ttlMs?: number } = {},
): ResourceResult<T> {
  const ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
  const [, setTick] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    if (key === null) return;
    const rerender = (): void => setTick((t) => t + 1);
    const unsub = subscribe(key, rerender);
    ensureLoaded(key, ttlMs, () => loaderRef.current());
    return unsub;
  }, [key, ttlMs]);

  const refresh = useCallback(() => {
    if (key === null) return;
    if ((cache.get(key) as Entry<T> | undefined)?.promise) return;
    startLoad(key, () => loaderRef.current());
  }, [key]);

  const entry = key !== null ? (cache.get(key) as Entry<T> | undefined) : undefined;
  return {
    data: entry?.data,
    error: entry?.error,
    loading: key !== null && (entry === undefined || entry.promise !== undefined),
    stale: entry?.data !== undefined && entry.promise !== undefined,
    refresh,
  };
}
