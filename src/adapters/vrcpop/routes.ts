// vrcpop route allowlist + the single entry to the agent. Every request the
// adapter makes goes through `request(routeId, params, ctx)`; unknown routes and
// paths that don't match an allowlisted pattern are refused. Own-surface rule:
// write/edit routes require branded ids (OwnGroupRef/OwnEventRef) that can only
// come from the user's own manage listings — a raw user-typed id can't reach here.
//
// No raw HTTP client here (a unit test greps src/adapters/vrcpop/** for the
// forbidden same-origin call). All I/O goes through the agent's `http` op.
import type { HttpBody, HttpRequest, HttpResult, MultipartPart } from '../../shared/agent-protocol';
import { BridgeError } from '../../core/errors';
import type { VrcpopEventPayload } from '../../core/mapping/to-vrcpop';
import {
  isOwnEventRef,
  isOwnGroupRef,
  isPerformerSlugRef,
  type OwnEventRef,
  type OwnGroupRef,
  type PerformerSlugRef,
  type VrcpopAgent,
} from './types';

export type RouteKind = 'read' | 'write';

export type RouteId =
  | 'dashboard'
  | 'eventsList'
  | 'editPage'
  | 'lineup'
  | 'genres'
  | 'energy'
  | 'performerSearch'
  | 'performerSearchAll'
  | 'performerProfile'
  | 'create'
  | 'update'
  | 'delete'
  | 'flyerUpload'
  | 'flyerRemove';

export interface RouteDef {
  id: RouteId;
  method: 'GET' | 'POST' | 'DELETE';
  kind: RouteKind;
  pattern: RegExp; // matched against the constructed path+query
}

const GRP = 'grp_[0-9a-fA-F-]+';

// Allowlist. Public/foreign surfaces (/event/<id>, /club/<other>, action=list|
// bulk-publish|collab-*|duplicate) are deliberately absent → refused.
export const ROUTES: readonly RouteDef[] = [
  { id: 'dashboard', method: 'GET', kind: 'read', pattern: /^\/dashboard$/ },
  { id: 'eventsList', method: 'GET', kind: 'read', pattern: new RegExp(`^/manage/club/${GRP}/events$`) },
  { id: 'editPage', method: 'GET', kind: 'read', pattern: new RegExp(`^/manage/club/${GRP}/events/\\d+/edit$`) },
  { id: 'lineup', method: 'GET', kind: 'read', pattern: /^\/api\/event-lineup\.php\?event_id=\d+$/ },
  { id: 'genres', method: 'GET', kind: 'read', pattern: /^\/api\/dj\/\?action=genres$/ },
  { id: 'energy', method: 'GET', kind: 'read', pattern: /^\/api\/dj\/\?action=energy$/ },
  { id: 'performerSearch', method: 'GET', kind: 'read', pattern: /^\/api\/dj\/\?action=search&q=[^&]*$/ },
  { id: 'performerSearchAll', method: 'GET', kind: 'read', pattern: /^\/api\/dj\/\?action=search-all&q=[^&]*&type=dj$/ },
  // Public performer profile (My gigs). Read once per slug per manual refresh —
  // the page is public; own/self-asserted profile only, no crawling.
  { id: 'performerProfile', method: 'GET', kind: 'read', pattern: /^\/u\/[a-z0-9-]{1,64}$/ },
  { id: 'create', method: 'POST', kind: 'write', pattern: /^\/api\/events\/\?action=create$/ },
  { id: 'update', method: 'POST', kind: 'write', pattern: /^\/api\/events\/\?action=update$/ },
  { id: 'delete', method: 'POST', kind: 'write', pattern: /^\/api\/events\/\?action=delete$/ },
  { id: 'flyerUpload', method: 'POST', kind: 'write', pattern: /^\/api\/events\/upload-flyer\.php$/ },
  { id: 'flyerRemove', method: 'DELETE', kind: 'write', pattern: /^\/api\/events\/upload-flyer\.php$/ },
] as const;

const BY_ID = new Map<RouteId, RouteDef>(ROUTES.map((r) => [r.id, r]));

// True only if `method`+`path` matches an allowlisted route. Never throws.
export function isAllowed(method: string, path: string): boolean {
  return ROUTES.some((r) => r.method === method && r.pattern.test(path));
}

// Throws UNSUPPORTED unless method+path is on the allowlist. Defense-in-depth:
// every constructed request is re-checked here before it can reach the agent.
export function assertAllowed(method: string, path: string): RouteDef {
  const hit = ROUTES.find((r) => r.method === method && r.pattern.test(path));
  if (!hit) throw new BridgeError('UNSUPPORTED', `refused non-allowlisted route: ${method} ${path}`);
  return hit;
}

// ---- per-route params ----

export interface RouteParams {
  dashboard: Record<string, never>;
  eventsList: { group: OwnGroupRef };
  editPage: { group: OwnGroupRef; event: OwnEventRef };
  lineup: { event: OwnEventRef };
  genres: Record<string, never>;
  energy: Record<string, never>;
  performerSearch: { q: string };
  performerSearchAll: { q: string };
  performerProfile: { slug: PerformerSlugRef };
  create: { group: OwnGroupRef; body: VrcpopEventPayload };
  update: { group: OwnGroupRef; event: OwnEventRef; body: unknown };
  delete: { event: OwnEventRef; body: { event_id: number } };
  flyerUpload: { group: OwnGroupRef; event: OwnEventRef; blobId: string; filename: string; mime: string };
  flyerRemove: { group: OwnGroupRef; event: OwnEventRef };
}

export interface RequestCtx {
  agent: VrcpopAgent;
  csrf?: string; // required for write routes; from a freshly fetched manage page's meta
  timeoutMs?: number;
}

function requireGroup(g: unknown): OwnGroupRef {
  if (!isOwnGroupRef(g)) throw new BridgeError('NOT_AUTHORIZED', 'group id is not an own-club ref (must come from listOwnClubs)');
  return g;
}

function requireEvent(e: unknown): OwnEventRef {
  if (!isOwnEventRef(e)) throw new BridgeError('NOT_AUTHORIZED', 'event id is not an own-event ref (must come from listOwnEvents)');
  return e;
}

function requireSlug(s: unknown): PerformerSlugRef {
  if (!isPerformerSlugRef(s)) throw new BridgeError('NOT_AUTHORIZED', 'performer slug is not a branded ref (must come from performerSlugRef)');
  return s;
}

// Build the same-origin HttpRequest for a route. Enforces brands; does NOT attach
// CSRF (request() does that once the route kind is known).
function buildRequest<K extends RouteId>(routeId: K, params: RouteParams[K]): HttpRequest {
  switch (routeId) {
    case 'dashboard':
      return { method: 'GET', path: '/dashboard', responseType: 'text' };
    case 'eventsList': {
      const p = params as RouteParams['eventsList'];
      const g = requireGroup(p.group);
      return { method: 'GET', path: `/manage/club/${g.id}/events`, responseType: 'text' };
    }
    case 'editPage': {
      const p = params as RouteParams['editPage'];
      const g = requireGroup(p.group);
      const e = requireEvent(p.event);
      return { method: 'GET', path: `/manage/club/${g.id}/events/${e.id}/edit`, responseType: 'text' };
    }
    case 'lineup': {
      const p = params as RouteParams['lineup'];
      const e = requireEvent(p.event);
      return { method: 'GET', path: `/api/event-lineup.php?event_id=${e.id}`, responseType: 'json' };
    }
    case 'genres':
      return { method: 'GET', path: '/api/dj/?action=genres', responseType: 'json' };
    case 'energy':
      return { method: 'GET', path: '/api/dj/?action=energy', responseType: 'json' };
    case 'performerSearch': {
      const p = params as RouteParams['performerSearch'];
      return { method: 'GET', path: `/api/dj/?action=search&q=${encodeURIComponent(p.q)}`, responseType: 'json' };
    }
    case 'performerSearchAll': {
      const p = params as RouteParams['performerSearchAll'];
      return { method: 'GET', path: `/api/dj/?action=search-all&q=${encodeURIComponent(p.q)}&type=dj`, responseType: 'json' };
    }
    case 'performerProfile': {
      const p = params as RouteParams['performerProfile'];
      const s = requireSlug(p.slug);
      return { method: 'GET', path: `/u/${s.slug}`, responseType: 'text' };
    }
    case 'create': {
      const p = params as RouteParams['create'];
      requireGroup(p.group);
      const body: HttpBody = { kind: 'json', json: p.body };
      return { method: 'POST', path: '/api/events/?action=create', body, responseType: 'json' };
    }
    case 'update': {
      const p = params as RouteParams['update'];
      requireGroup(p.group);
      requireEvent(p.event);
      const body: HttpBody = { kind: 'json', json: p.body };
      return { method: 'POST', path: '/api/events/?action=update', body, responseType: 'json' };
    }
    case 'delete': {
      const p = params as RouteParams['delete'];
      requireEvent(p.event);
      const body: HttpBody = { kind: 'json', json: p.body };
      return { method: 'POST', path: '/api/events/?action=delete', body, responseType: 'json' };
    }
    case 'flyerUpload': {
      const p = params as RouteParams['flyerUpload'];
      const g = requireGroup(p.group);
      const e = requireEvent(p.event);
      const parts: MultipartPart[] = [
        { name: 'flyer', filename: p.filename, mime: p.mime, blobId: p.blobId },
        { name: 'group_id', value: g.id },
        { name: 'event_id', value: String(e.id) },
      ];
      return { method: 'POST', path: '/api/events/upload-flyer.php', body: { kind: 'multipart', parts }, responseType: 'json' };
    }
    case 'flyerRemove': {
      const p = params as RouteParams['flyerRemove'];
      const g = requireGroup(p.group);
      const e = requireEvent(p.event);
      const body: HttpBody = { kind: 'json', json: { group_id: g.id, event_id: e.id } };
      return { method: 'DELETE', path: '/api/events/upload-flyer.php', body, responseType: 'json' };
    }
    default: {
      // Exhaustive; a new RouteId without a builder is a compile error.
      const never: never = routeId;
      throw new BridgeError('UNSUPPORTED', `no builder for route ${String(never)}`);
    }
  }
}

// The ONLY path from the adapter to the agent. Validates the route + brands,
// attaches CSRF for writes, re-checks the allowlist, then issues the http op.
export async function request<K extends RouteId>(routeId: K, params: RouteParams[K], ctx: RequestCtx): Promise<HttpResult> {
  const def = BY_ID.get(routeId);
  if (!def) throw new BridgeError('UNSUPPORTED', `unknown route: ${String(routeId)}`);
  const req = buildRequest(routeId, params);
  assertAllowed(req.method, req.path);
  if (def.kind === 'write') {
    if (!ctx.csrf) throw new BridgeError('VALIDATION', `write route ${routeId} requires a CSRF token`);
    req.headers = { ...(req.headers ?? {}), 'X-CSRF-Token': ctx.csrf };
  }
  return ctx.agent.call({ op: 'http', request: req }, { timeoutMs: ctx.timeoutMs });
}
