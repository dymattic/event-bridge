// vrcpop adapter barrel.
export { vrcpopAdapter } from './adapter';
export type { VrcpopAdapter, ExecuteCtx, ReadEventResult } from './adapter';
export { vrcpopCaps } from './capabilities';
export type { VrcpopCaps, DraftSupport } from './capabilities';
export {
  ownGroupRef,
  ownEventRef,
  isOwnGroupRef,
  isOwnEventRef,
} from './types';
export type {
  VrcpopAgent,
  OwnGroupRef,
  OwnEventRef,
  VrcpopClub,
  VrcpopEventRef,
  VrcpopEventStatus,
  VrcpopVocab,
  PerformerHit,
} from './types';
export { ROUTES, isAllowed, assertAllowed, request } from './routes';
export type { RouteId, RouteKind, RouteDef, RouteParams, RequestCtx } from './routes';
export {
  parseCsrf,
  parseDashboard,
  parseEventsList,
  parseEditPage,
  parseVrcpopCardDate,
  eventToOwn,
} from './parse';
export type { DashboardParse, EventsListParse, EditPageParse } from './parse';
export { makeVocab, parseGenres, parseEnergy, parsePerformerSearchAll, deletePayload } from './payloads';
export {
  classifyRead,
  parseReadJson,
  parseWriteJson,
  looksLikeLogin,
} from './http-result';
export { planCreate, planUpdate, planDelete, planPoster } from './planner';
export type { PlanCreateOpts, PlanUpdateOpts, PlanPosterOpts, PosterIntent, PlanVocab } from './planner';
