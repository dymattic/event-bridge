// vrc.tl route allowlist + the single request entry point. Every outbound
// vrc.tl call goes through `buildRequest` (pure, validated) so nothing but the
// allowlisted own-surface routes can ever be issued. There is deliberately NO
// route for public listings (/event/*, /api/v1/*) or the timetable /
// vrChatEventCreate grid actions. Write ids are branded (see ids.ts) — they can
// only originate from a parsed own-surface listing, never raw user input.
import type { HttpBody, HttpRequest } from '../../shared/agent-protocol';
import { BridgeError } from '../../core/errors';
import type { HttpResult } from '../../shared/agent-protocol';
import {
  asCategoryId,
  asEventId,
  asOrganizerId,
  type VrctlCategoryId,
  type VrctlDeleteAction,
  type VrctlEventId,
  type VrctlOrganizerId,
} from './ids';

export type VrctlRouteId =
  | 'chooseOrganizer'
  | 'chooseCategory'
  | 'grid'
  | 'detail'
  | 'performerSearch'
  | 'organizerSearch'
  | 'create'
  | 'detailSubmit'
  | 'delete';

export interface VrctlRoute {
  id: VrctlRouteId;
  method: 'GET' | 'POST';
  kind: 'read' | 'write';
  pathPattern: string; // documentation of the shape buildRequest emits
}

export const VRCTL_ROUTES: Record<VrctlRouteId, VrctlRoute> = {
  chooseOrganizer: { id: 'chooseOrganizer', method: 'GET', kind: 'read', pathPattern: '/admin/event/choose-organizer' },
  chooseCategory: { id: 'chooseCategory', method: 'GET', kind: 'read', pathPattern: '/admin/event/choose-category?organizerId=<id>' },
  grid: { id: 'grid', method: 'GET', kind: 'read', pathPattern: '/admin/event' },
  detail: { id: 'detail', method: 'GET', kind: 'read', pathPattern: '/admin/event/detail/<id>' },
  performerSearch: { id: 'performerSearch', method: 'GET', kind: 'read', pathPattern: '/admin/ajax/performer?term=&_type=query&q=' },
  organizerSearch: { id: 'organizerSearch', method: 'GET', kind: 'read', pathPattern: '/admin/ajax/organizer?term=&_type=query&q=' },
  create: { id: 'create', method: 'POST', kind: 'write', pathPattern: '/admin/event/create?categoryId=<id>&organizerId=<id>[&promoted=0]' },
  detailSubmit: { id: 'detailSubmit', method: 'POST', kind: 'write', pathPattern: '/admin/event/detail/<id>' },
  delete: { id: 'delete', method: 'GET', kind: 'write', pathPattern: '/admin/event?grid-grid-__id=<id>&grid-grid-__key=delete&do=grid-grid-actionCallback' },
};

export interface RouteParams {
  chooseOrganizer: Record<string, never>;
  chooseCategory: { organizerId: VrctlOrganizerId };
  grid: Record<string, never>;
  detail: { eventId: VrctlEventId };
  performerSearch: { term: string };
  organizerSearch: { term: string };
  create: { organizerId: VrctlOrganizerId; categoryId: VrctlCategoryId; promoted: boolean; body: HttpBody };
  detailSubmit: { eventId: VrctlEventId; body: HttpBody };
  delete: { action: VrctlDeleteAction };
}

function q(s: string): string {
  return encodeURIComponent(s);
}

// Re-validate branded ids at the boundary (defends against a cast bypassing the
// constructor). asEventId/asOrganizerId/asCategoryId throw on non-numeric input.
export function buildRequest<K extends VrctlRouteId>(routeId: K, params: RouteParams[K]): HttpRequest {
  const route = VRCTL_ROUTES[routeId];
  if (!route) throw new BridgeError('UNSUPPORTED', `unknown vrc.tl route: ${String(routeId)}`);

  switch (routeId) {
    case 'chooseOrganizer':
      return { method: 'GET', path: '/admin/event/choose-organizer', redirect: 'follow', responseType: 'text' };
    case 'grid':
      return { method: 'GET', path: '/admin/event', redirect: 'follow', responseType: 'text' };
    case 'chooseCategory': {
      const { organizerId } = params as RouteParams['chooseCategory'];
      return {
        method: 'GET',
        path: `/admin/event/choose-category?organizerId=${asOrganizerId(organizerId)}`,
        redirect: 'follow',
        responseType: 'text',
      };
    }
    case 'detail': {
      const { eventId } = params as RouteParams['detail'];
      return { method: 'GET', path: `/admin/event/detail/${asEventId(eventId)}`, redirect: 'follow', responseType: 'text' };
    }
    case 'performerSearch': {
      const { term } = params as RouteParams['performerSearch'];
      return {
        method: 'GET',
        path: `/admin/ajax/performer?term=${q(term)}&_type=query&q=${q(term)}`,
        redirect: 'follow',
        responseType: 'text',
      };
    }
    case 'organizerSearch': {
      const { term } = params as RouteParams['organizerSearch'];
      return {
        method: 'GET',
        path: `/admin/ajax/organizer?term=${q(term)}&_type=query&q=${q(term)}`,
        redirect: 'follow',
        responseType: 'text',
      };
    }
    case 'create': {
      const { organizerId, categoryId, promoted, body } = params as RouteParams['create'];
      // redirect:'follow' — an in-tab fetch cannot read a Location off an
      // opaqueredirect (manual) response; we recover the new id from finalUrl.
      const suffix = promoted ? '' : '&promoted=0';
      return {
        method: 'POST',
        path: `/admin/event/create?categoryId=${asCategoryId(categoryId)}&organizerId=${asOrganizerId(organizerId)}${suffix}`,
        body,
        redirect: 'follow',
        responseType: 'text',
      };
    }
    case 'detailSubmit': {
      const { eventId, body } = params as RouteParams['detailSubmit'];
      return { method: 'POST', path: `/admin/event/detail/${asEventId(eventId)}`, body, redirect: 'follow', responseType: 'text' };
    }
    case 'delete': {
      const { action } = params as RouteParams['delete'];
      // `action` is a VrctlDeleteAction — asDeleteAction already proved it is a
      // same-origin delete-key grid callback. Re-affirm it starts as expected.
      if (!action.startsWith('/admin/event?')) throw new BridgeError('NOT_AUTHORIZED', `bad delete action: ${action}`);
      return { method: 'GET', path: action, redirect: 'follow', responseType: 'text' };
    }
    default:
      throw new BridgeError('UNSUPPORTED', `unknown vrc.tl route: ${String(routeId)}`);
  }
}

export type HttpSend = (req: HttpRequest) => Promise<HttpResult>;

// The sole way the adapter issues a vrc.tl request.
export function request<K extends VrctlRouteId>(send: HttpSend, routeId: K, params: RouteParams[K]): Promise<HttpResult> {
  return send(buildRequest(routeId, params));
}
