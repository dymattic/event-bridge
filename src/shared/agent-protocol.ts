// Typed request/response protocol between the dashboard/popup pages and the
// per-origin injected agents. Discriminated unions keyed by `op`; every port
// request carries a numeric `id` for response correlation. Kept extensible:
// P3 adds a rave.page `grant` op by extending AgentOp + AgentResultMap.
//
// Also compiled under tsconfig.background.json (WebWorker lib) because it lives
// in src/shared — keep it free of DOM-only types. The BridgeErrorCode import is
// type-only (erased); no runtime dependency on src/core.
import type { BridgeErrorCode } from '../core/errors';

export type Platform = 'vrcpop' | 'vrctl' | 'ravepage';

// Canonical origins (dev API base for rave.page). Entry URLs + display names
// live in src/runtime/tabs.ts (page-side).
export const ORIGINS: Record<Platform, string> = {
  vrcpop: 'https://vrcpop.com',
  vrctl: 'https://vrc.tl',
  ravepage: 'https://development.rave.page',
};

export interface SessionInfo {
  loggedIn: boolean;
  label?: string; // resolved display name (never a raw id) — shown in UI
  userId?: string; // raw account id kept for internals only, never a UI label
  expiresAt?: string; // ISO 8601
}

// ---- HTTP op ----

export type HttpBody =
  | { kind: 'none' }
  | { kind: 'json'; json: unknown }
  | { kind: 'urlencoded'; fields: [string, string][] }
  | { kind: 'multipart'; parts: MultipartPart[] };

export type MultipartPart =
  | { name: string; value: string }
  | { name: string; filename: string; mime: string; blobId: string };

export interface HttpRequest {
  method: string;
  path: string; // same-origin absolute path, MUST start with '/'
  headers?: Record<string, string>;
  body?: HttpBody;
  redirect?: 'follow' | 'manual';
  responseType: 'text' | 'json' | 'none';
}

export interface HttpResult {
  status: number;
  finalUrl: string;
  headers: Record<string, string>; // allowlist: content-type, location
  body: string | null; // raw text (json = raw JSON text; caller parses); none = null
}

// ---- Agent ops (requests, pre-envelope) ----

export interface PingOp {
  op: 'ping';
}
export interface SessionOp {
  op: 'session';
}
export interface HttpOp {
  op: 'http';
  request: HttpRequest;
}
export interface BlobBeginOp {
  op: 'blobBegin';
  blobId: string;
  mime: string;
  size: number;
}
export interface BlobChunkOp {
  op: 'blobChunk';
  blobId: string;
  index: number;
  base64: string;
}
export interface BlobEndOp {
  op: 'blobEnd';
  blobId: string;
  sha256?: string; // optional expected digest; agent rejects on mismatch
}
export interface BlobDropOp {
  op: 'blobDrop';
  blobId: string;
}
// rave.page desktop-grant handshake (P3). Runs only on the rave.page dev origin;
// waits for the /desktop/bridge page to post a grant code. See ravepage-grant.dom.ts.
export interface GrantAwaitOp {
  op: 'grantAwait';
  timeoutMs: number;
}

export type AgentOp =
  | PingOp
  | SessionOp
  | HttpOp
  | BlobBeginOp
  | BlobChunkOp
  | BlobEndOp
  | BlobDropOp
  | GrantAwaitOp;

export type AgentOpName = AgentOp['op'];
export type AgentOpFor<K extends AgentOpName> = Extract<AgentOp, { op: K }>;

// ---- Result payloads ----

export interface PingResult {
  buildId: string;
  origin: string;
}
export interface BlobAck {
  blobId: string;
  sha256?: string; // present on blobEnd (agent-computed SHA-256 hex)
}
// Result of grantAwait: the one-time code + the API base the SPA minted it for.
export interface GrantResult {
  code: string;
  api: string;
}

export interface AgentResultMap {
  ping: PingResult;
  session: SessionInfo;
  http: HttpResult;
  blobBegin: BlobAck;
  blobChunk: BlobAck;
  blobEnd: BlobAck;
  blobDrop: BlobAck;
  grantAwait: GrantResult;
}

// ---- Port envelope (request + response correlated by id) ----

export type AgentRequest = AgentOp & { id: number };

export type AgentOkResponse = {
  [K in AgentOpName]: { ok: true; id: number; op: K; result: AgentResultMap[K] };
}[AgentOpName];

export interface AgentErrResponse {
  ok: false;
  id: number;
  code: BridgeErrorCode;
  message: string;
}

export type AgentResponse = AgentOkResponse | AgentErrResponse;

export function isAgentRequest(m: unknown): m is AgentRequest {
  if (typeof m !== 'object' || m === null) return false;
  const r = m as Record<string, unknown>;
  return typeof r.id === 'number' && typeof r.op === 'string';
}

export function isAgentResponse(m: unknown): m is AgentResponse {
  if (typeof m !== 'object' || m === null) return false;
  const r = m as Record<string, unknown>;
  return typeof r.id === 'number' && typeof r.ok === 'boolean';
}

// ---- One-shot ping (runtime.sendMessage, used right after injection to read
// the live agent's buildId for stale detection; no port/id) ----

export interface AgentPing {
  type: 'agentPing';
}
export interface AgentPong {
  ok: true;
  buildId: string;
  origin: string;
}

export function isAgentPing(m: unknown): m is AgentPing {
  return typeof m === 'object' && m !== null && (m as { type?: unknown }).type === 'agentPing';
}
