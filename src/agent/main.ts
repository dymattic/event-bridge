// Injected on demand per origin (vrcpop / vrc.tl / rave.page). Stateless across
// messages except a short-lived in-memory blob store. JSON-only bus; binary
// arrives as base64 slices. Never reads the page's JS globals.
import { ext } from '../shared/webext';
import { BUILD_ID } from '../shared/build-id';
import { base64ToBytes } from '../shared/base64';
import { BridgeError, isBridgeError } from '../core/errors';
import {
  isAgentPing,
  isAgentRequest,
  type AgentErrResponse,
  type AgentOpFor,
  type AgentOpName,
  type AgentPong,
  type AgentRequest,
  type AgentResponse,
  type AgentResultMap,
  type HttpRequest,
  type HttpResult,
} from '../shared/agent-protocol';
import { detectSession } from './session.dom';

declare global {
  // eslint-disable-next-line no-var
  var __eventBridgeAgent: { buildId: string } | undefined;
}

// ---- blob store (assembled from base64 slices; 5-min TTL) ----

const BLOB_TTL_MS = 5 * 60 * 1000;

interface BlobEntry {
  mime: string;
  size: number;
  chunks: Map<number, string>;
  bytes?: Uint8Array;
  timer: ReturnType<typeof setTimeout>;
}

const blobs = new Map<string, BlobEntry>();

function armTtl(blobId: string): void {
  const e = blobs.get(blobId);
  if (!e) return;
  clearTimeout(e.timer);
  e.timer = setTimeout(() => blobs.delete(blobId), BLOB_TTL_MS);
}

async function toHex(buf: ArrayBuffer): Promise<string> {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function blobBegin(op: AgentOpFor<'blobBegin'>): AgentResultMap['blobBegin'] {
  const timer = setTimeout(() => blobs.delete(op.blobId), BLOB_TTL_MS);
  blobs.set(op.blobId, { mime: op.mime, size: op.size, chunks: new Map(), timer });
  return { blobId: op.blobId };
}

function blobChunk(op: AgentOpFor<'blobChunk'>): AgentResultMap['blobChunk'] {
  const e = blobs.get(op.blobId);
  if (!e) throw new BridgeError('NOT_FOUND', `blob ${op.blobId} not begun`);
  e.chunks.set(op.index, op.base64);
  armTtl(op.blobId);
  return { blobId: op.blobId };
}

async function blobEnd(op: AgentOpFor<'blobEnd'>): Promise<AgentResultMap['blobEnd']> {
  const e = blobs.get(op.blobId);
  if (!e) throw new BridgeError('NOT_FOUND', `blob ${op.blobId} not begun`);
  const parts: Uint8Array[] = [];
  for (let i = 0; i < e.chunks.size; i++) {
    const c = e.chunks.get(i);
    if (c === undefined) throw new BridgeError('VALIDATION', `blob ${op.blobId} missing chunk ${i}`);
    parts.push(base64ToBytes(c));
  }
  const total = parts.reduce((n, p) => n + p.length, 0);
  const bytes = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    bytes.set(p, off);
    off += p.length;
  }
  if (bytes.length !== e.size) {
    throw new BridgeError('VALIDATION', `blob ${op.blobId} size ${bytes.length} != declared ${e.size}`);
  }
  const sha256 = await toHex(await crypto.subtle.digest('SHA-256', bytes));
  if (op.sha256 && op.sha256 !== sha256) {
    throw new BridgeError('VALIDATION', `blob ${op.blobId} sha256 mismatch`);
  }
  e.bytes = bytes;
  armTtl(op.blobId);
  return { blobId: op.blobId, sha256 };
}

function blobDrop(op: AgentOpFor<'blobDrop'>): AgentResultMap['blobDrop'] {
  const e = blobs.get(op.blobId);
  if (e) clearTimeout(e.timer);
  blobs.delete(op.blobId);
  return { blobId: op.blobId };
}

// ---- http op (strictly same-origin, cookies attached) ----

async function handleHttp(req: HttpRequest): Promise<HttpResult> {
  const url = new URL(req.path, location.origin);
  if (url.origin !== location.origin) {
    throw new BridgeError('NOT_AUTHORIZED', `cross-origin request refused: ${url.origin}`);
  }
  const headers: Record<string, string> = { ...(req.headers ?? {}) };
  const init: RequestInit = {
    method: req.method,
    credentials: 'same-origin',
    redirect: req.redirect ?? 'follow',
  };
  const body = req.body ?? { kind: 'none' };
  switch (body.kind) {
    case 'none':
      break;
    case 'json':
      init.body = JSON.stringify(body.json);
      if (!('content-type' in headers)) headers['content-type'] = 'application/json';
      break;
    case 'urlencoded': {
      const p = new URLSearchParams();
      for (const [k, v] of body.fields) p.append(k, v);
      init.body = p; // fetch sets application/x-www-form-urlencoded
      break;
    }
    case 'multipart': {
      const fd = new FormData();
      for (const part of body.parts) {
        if ('blobId' in part) {
          const bytes = blobs.get(part.blobId)?.bytes;
          if (!bytes) throw new BridgeError('NOT_FOUND', `blob ${part.blobId} not assembled`);
          // Boundary: Uint8Array<ArrayBufferLike> vs BlobPart's ArrayBuffer.
          fd.append(part.name, new Blob([bytes as BlobPart], { type: part.mime }), part.filename);
        } else {
          fd.append(part.name, part.value);
        }
      }
      init.body = fd;
      delete headers['content-type']; // let fetch set the multipart boundary
      break;
    }
  }
  init.headers = headers;

  let res: Response;
  try {
    res = await fetch(url.toString(), init);
  } catch (e) {
    throw new BridgeError('NETWORK', e instanceof Error ? e.message : String(e));
  }

  const outHeaders: Record<string, string> = {};
  const ct = res.headers.get('content-type');
  if (ct) outHeaders['content-type'] = ct;
  const loc = res.headers.get('location');
  if (loc) outHeaders['location'] = loc;

  let outBody: string | null = null;
  if (req.responseType !== 'none') outBody = await res.text();
  return { status: res.status, finalUrl: res.url, headers: outHeaders, body: outBody };
}

// ---- dispatch ----

function reply<K extends AgentOpName>(id: number, op: K, result: AgentResultMap[K]): AgentResponse {
  // Boundary: a generic {op:K, result:map[K]} isn't inferred into the distributed
  // union AgentOkResponse; the id+op pairing guarantees the member.
  return { ok: true, id, op, result } as AgentResponse;
}

function toErr(id: number, e: unknown): AgentErrResponse {
  if (isBridgeError(e)) return { ok: false, id, code: e.code, message: e.message };
  return { ok: false, id, code: 'UNKNOWN', message: e instanceof Error ? e.message : String(e) };
}

async function dispatch(req: AgentRequest): Promise<AgentResponse> {
  try {
    switch (req.op) {
      case 'ping':
        return reply(req.id, 'ping', { buildId: BUILD_ID, origin: location.origin });
      case 'session':
        return reply(req.id, 'session', await detectSession());
      case 'http':
        return reply(req.id, 'http', await handleHttp(req.request));
      case 'blobBegin':
        return reply(req.id, 'blobBegin', blobBegin(req));
      case 'blobChunk':
        return reply(req.id, 'blobChunk', blobChunk(req));
      case 'blobEnd':
        return reply(req.id, 'blobEnd', await blobEnd(req));
      case 'blobDrop':
        return reply(req.id, 'blobDrop', blobDrop(req));
    }
  } catch (e) {
    return toErr(req.id, e);
  }
}

// ---- install (idempotent: same build re-injection is a no-op) ----

if (globalThis.__eventBridgeAgent?.buildId !== BUILD_ID) {
  globalThis.__eventBridgeAgent = { buildId: BUILD_ID };

  // One-shot ping used right after injection (stale-build detection).
  ext.runtime.onMessage.addListener((msg: unknown, _sender, sendResponse) => {
    if (isAgentPing(msg)) {
      const pong: AgentPong = { ok: true, buildId: BUILD_ID, origin: location.origin };
      sendResponse(pong);
    }
    return true;
  });

  // Request/response over a named port (Firefox may drop it — the page reconnects).
  ext.runtime.onConnect.addListener((port) => {
    if (port.name !== 'agent') return;
    port.onMessage.addListener((msg: unknown) => {
      if (!isAgentRequest(msg)) return;
      void dispatch(msg).then((res) => {
        try {
          port.postMessage(res);
        } catch {
          // port closed mid-flight; nothing to do
        }
      });
    });
  });
}
