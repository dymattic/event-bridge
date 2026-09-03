// Runtime messages between the popup/dashboard pages and the background worker.
// Compiled under both DOM and WebWorker (background) configs — keep DOM-free.

export type BackgroundRequest = { type: 'open-dashboard' };

export type BackgroundResponse = { ok: true } | { ok: false; message: string };

export function isBackgroundRequest(m: unknown): m is BackgroundRequest {
  return typeof m === 'object' && m !== null && (m as { type?: unknown }).type === 'open-dashboard';
}
