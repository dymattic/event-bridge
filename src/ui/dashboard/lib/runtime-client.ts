// Thin runtime facade for dashboard views (P6+ consume `withAgent`).
import type {
  AgentOpFor,
  AgentOpName,
  AgentResultMap,
  Platform,
} from '../../../shared/agent-protocol';
import { getSessionStatus, type SessionStatus } from '../../../runtime/sessions';
import { ensureAgent, PLATFORMS } from '../../../runtime/tabs';
import { callAgent, sendBlob } from '../../../runtime/agent-transport';

export async function sessions(): Promise<Record<Platform, SessionStatus>> {
  const entries = await Promise.all(
    PLATFORMS.map(async (p) => [p, await getSessionStatus(p)] as const),
  );
  return Object.fromEntries(entries) as Record<Platform, SessionStatus>;
}

export interface AgentHandle {
  tabId: number;
  call<K extends AgentOpName>(op: AgentOpFor<K>, opts?: { timeoutMs?: number }): Promise<AgentResultMap[K]>;
  sendBlob(bytes: Uint8Array, mime: string, opts?: { timeoutMs?: number }): Promise<{ blobId: string; sha256?: string }>;
}

function boundCall(tabId: number) {
  return function call<K extends AgentOpName>(op: AgentOpFor<K>, opts?: { timeoutMs?: number }): Promise<AgentResultMap[K]> {
    return callAgent(tabId, op, opts);
  };
}

export async function withAgent<T>(
  platform: Platform,
  fn: (agent: AgentHandle) => Promise<T>,
  opts: { allowOpen: boolean },
): Promise<T> {
  const { tabId } = await ensureAgent(platform, opts);
  const handle: AgentHandle = {
    tabId,
    call: boundCall(tabId),
    sendBlob: (bytes, mime, o) => sendBlob(tabId, bytes, mime, o),
  };
  return fn(handle);
}
