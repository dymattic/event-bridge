// Page-side transport to an injected agent over a named runtime port. One cached
// port per tab; reconnect on disconnect (Firefox drops ports). Failures map to
// BridgeError codes. Binary uses the base64 slice protocol.
import { ext } from '../shared/webext';
import { BridgeError } from '../core/errors';
import { sliceBase64 } from '../shared/base64';
import {
  isAgentResponse,
  type AgentOpFor,
  type AgentOpName,
  type AgentRequest,
  type AgentResponse,
  type AgentResultMap,
} from '../shared/agent-protocol';

const DEFAULT_TIMEOUT_MS = 20_000;
const BLOB_TIMEOUT_MS = 120_000;

interface Pending {
  resolve: (r: AgentResponse) => void;
  reject: (e: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
}

interface Conn {
  port: chrome.runtime.Port;
  pending: Map<number, Pending>;
  nextId: number;
}

const conns = new Map<number, Conn>();

function connect(tabId: number): Conn {
  const port = ext.tabs.connect(tabId, { name: 'agent' });
  const conn: Conn = { port, pending: new Map(), nextId: 1 };
  port.onMessage.addListener((msg: unknown) => {
    if (!isAgentResponse(msg)) return;
    const p = conn.pending.get(msg.id);
    if (!p) return;
    conn.pending.delete(msg.id);
    clearTimeout(p.timer);
    p.resolve(msg);
  });
  port.onDisconnect.addListener(() => {
    conns.delete(tabId);
    for (const p of conn.pending.values()) {
      clearTimeout(p.timer);
      p.reject(new BridgeError('AGENT_UNAVAILABLE', `agent port for tab ${tabId} disconnected`));
    }
    conn.pending.clear();
  });
  conns.set(tabId, conn);
  return conn;
}

function getConn(tabId: number): Conn {
  return conns.get(tabId) ?? connect(tabId);
}

export function disconnectAgent(tabId: number): void {
  const c = conns.get(tabId);
  if (!c) return;
  try {
    c.port.disconnect();
  } catch {
    // already gone
  }
  conns.delete(tabId);
}

function send<K extends AgentOpName>(
  tabId: number,
  op: AgentOpFor<K>,
  timeoutMs: number,
  allowReconnect: boolean,
): Promise<AgentResponse> {
  const conn = getConn(tabId);
  const id = conn.nextId++;
  const request: AgentRequest = { ...op, id };
  return new Promise<AgentResponse>((resolve, reject) => {
    const timer = setTimeout(() => {
      conn.pending.delete(id);
      reject(new BridgeError('TIMEOUT', `agent op '${op.op}' timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    conn.pending.set(id, { resolve, reject, timer });
    try {
      conn.port.postMessage(request);
    } catch {
      conn.pending.delete(id);
      clearTimeout(timer);
      if (allowReconnect) {
        conns.delete(tabId);
        send(tabId, op, timeoutMs, false).then(resolve, reject);
      } else {
        reject(new BridgeError('AGENT_UNAVAILABLE', `agent port for tab ${tabId} unavailable`));
      }
    }
  });
}

export async function callAgent<K extends AgentOpName>(
  tabId: number,
  op: AgentOpFor<K>,
  opts: { timeoutMs?: number } = {},
): Promise<AgentResultMap[K]> {
  const res = await send(tabId, op, opts.timeoutMs ?? DEFAULT_TIMEOUT_MS, true);
  if (!res.ok) throw new BridgeError(res.code, res.message);
  // Boundary: the response union isn't narrowed by K at runtime; the id + op
  // correlation guarantees the member.
  return res.result as AgentResultMap[K];
}

function randomId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `blob-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export async function sendBlob(
  tabId: number,
  bytes: Uint8Array,
  mime: string,
  opts: { timeoutMs?: number; blobId?: string } = {},
): Promise<{ blobId: string; sha256?: string }> {
  const blobId = opts.blobId ?? randomId();
  await callAgent(tabId, { op: 'blobBegin', blobId, mime, size: bytes.length }, opts);
  let index = 0;
  for (const base64 of sliceBase64(bytes)) {
    await callAgent(tabId, { op: 'blobChunk', blobId, index: index++, base64 }, opts);
  }
  const ack = await callAgent(tabId, { op: 'blobEnd', blobId }, { timeoutMs: opts.timeoutMs ?? BLOB_TIMEOUT_MS });
  return { blobId, sha256: ack.sha256 };
}
