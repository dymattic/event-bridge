// Warns before the dashboard page unloads while a write run is in flight, so a
// half-finished create/edit/transfer/delete/sync/poster-upload isn't silently
// abandoned mid-run (plan §runtime). Ref-counted: nested/concurrent runs (each
// runPlan call, the imperative poster upload) share ONE beforeunload listener,
// installed on the first begin and removed on the last end. No-op where there's
// no window (node tests, background/service-worker contexts).
let active = 0;

function onBeforeUnload(e: BeforeUnloadEvent): void {
  e.preventDefault();
  e.returnValue = ''; // legacy browsers need returnValue set to show the prompt
}

export function beginRun(): void {
  if (typeof window === 'undefined') return;
  if (active === 0) window.addEventListener('beforeunload', onBeforeUnload);
  active += 1;
}

export function endRun(): void {
  if (typeof window === 'undefined') return;
  active = Math.max(0, active - 1);
  if (active === 0) window.removeEventListener('beforeunload', onBeforeUnload);
}

export function activeRunCount(): number {
  return active;
}

// Run `fn` with the unload guard held for its duration (released even on throw).
export async function withRunGuard<T>(fn: () => Promise<T>): Promise<T> {
  beginRun();
  try {
    return await fn();
  } finally {
    endRun();
  }
}
