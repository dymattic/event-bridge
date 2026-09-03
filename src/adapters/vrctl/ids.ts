// Branded vrc.tl identifiers. Constructors validate shape and are the ONLY way
// to mint a branded id, so write routes (create/detail POST/delete) can demand
// ids that came from a parsed own-surface listing — never raw user input
// (own-events-only safety, plan § Safety).
import { BridgeError } from '../../core/errors';

export type VrctlOrganizerId = string & { readonly __brand: 'VrctlOrganizerId' };
export type VrctlCategoryId = string & { readonly __brand: 'VrctlCategoryId' };
export type VrctlEventId = string & { readonly __brand: 'VrctlEventId' };
// A grid `delete` row-action URL. Only this action key is allowlisted for writes.
export type VrctlDeleteAction = string & { readonly __brand: 'VrctlDeleteAction' };

const NUMERIC = /^\d+$/;

function numeric(kind: string, s: string): string {
  const t = s.trim();
  if (!NUMERIC.test(t)) throw new BridgeError('VALIDATION', `invalid ${kind}: ${s}`);
  return t;
}

export function asOrganizerId(s: string): VrctlOrganizerId {
  return numeric('organizer id', s) as VrctlOrganizerId;
}
export function asCategoryId(s: string): VrctlCategoryId {
  return numeric('category id', s) as VrctlCategoryId;
}
export function asEventId(s: string): VrctlEventId {
  return numeric('event id', s) as VrctlEventId;
}

// Accepts only a same-origin grid delete action:
//   /admin/event?grid-grid-__id=<digits>&grid-grid-__key=delete&do=grid-grid-actionCallback
// (param order-insensitive). `timetable` / `vrChatEventCreate` and any other
// path are refused — those push to VRChat or leak beyond own-event management.
export function asDeleteAction(url: string): VrctlDeleteAction {
  const u = url.trim();
  let path: string;
  let params: URLSearchParams;
  try {
    const parsed = new URL(u, 'https://vrc.tl');
    if (parsed.origin !== 'https://vrc.tl') throw new BridgeError('NOT_AUTHORIZED', `off-origin delete action: ${url}`);
    path = parsed.pathname;
    params = parsed.searchParams;
  } catch (e) {
    if (e instanceof BridgeError) throw e;
    throw new BridgeError('VALIDATION', `unparseable delete action: ${url}`);
  }
  if (path !== '/admin/event') throw new BridgeError('NOT_AUTHORIZED', `delete action path not allowed: ${path}`);
  if (params.get('do') !== 'grid-grid-actionCallback') throw new BridgeError('NOT_AUTHORIZED', 'delete action missing grid callback');
  if (params.get('grid-grid-__key') !== 'delete') {
    throw new BridgeError('NOT_AUTHORIZED', `grid action not allowed: ${params.get('grid-grid-__key') ?? '(none)'}`);
  }
  const id = params.get('grid-grid-__id') ?? '';
  if (!NUMERIC.test(id)) throw new BridgeError('VALIDATION', `delete action missing event id: ${url}`);
  // Normalize to the path+query the agent sends (same-origin, no host).
  return `${path}?${params.toString()}` as VrctlDeleteAction;
}
