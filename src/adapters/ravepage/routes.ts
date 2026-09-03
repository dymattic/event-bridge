// Allowlist of generated service methods the rave.page adapter may call. auth.ts,
// upload.ts and adapter.ts import ONLY from here (single chokepoint) — never from
// api-client/services directly. A unit test greps the adapter sources for raw
// network calls and fails unless the line is marked raw-fetch-allowed (only the
// chunk PUT in upload.ts, which the generated MediaUploadService.uploadChunk
// cannot express: it sends no request body and no X-Chunk-Checksum header).
import { AuthService } from './api-client/services/AuthService';
import { GroupsService } from './api-client/services/GroupsService';
import { EventsService } from './api-client/services/EventsService';
import { EventSlotsService } from './api-client/services/EventSlotsService';
import { PerformersService } from './api-client/services/PerformersService';
import { TaxonomyService } from './api-client/services/TaxonomyService';
import { MediaUploadService } from './api-client/services/MediaUploadService';

// Static methods reference no `this` (each calls __request(OpenAPI, …)), so
// extracting them as bare function values is safe and keeps full arg typing.
export const ROUTES = {
  // auth
  exchangeDesktopGrant: AuthService.exchangeDesktopGrant,
  getCurrentUser: AuthService.getCurrentUserInfo,
  // discovery — own surfaces only
  getMyGroups: GroupsService.getMyGroups,
  listOrganizers: EventsService.listEventOrganizers,
  listEvents: EventsService.listEvents,
  // event read
  getEvent: EventsService.getEvent,
  getTimeline: EventsService.getEventTimeline,
  listSlots: EventSlotsService.listEventSlots,
  listPerformers: PerformersService.listEventPerformers,
  // event write
  createEvent: EventsService.createEvent,
  updateEvent: EventsService.updateEvent,
  deleteEvent: EventsService.deleteEvent,
  createSlot: EventSlotsService.createEventSlot,
  updateSlot: EventSlotsService.updateEventSlot,
  deleteSlot: EventSlotsService.deleteEventSlot,
  addPerformer: PerformersService.addEventPerformer,
  deletePerformer: PerformersService.removeEventPerformerDelete,
  // poster
  assignPoster: EventsService.assignEventPoster,
  deletePoster: EventsService.deleteEventPoster,
  // taxonomy
  listGenres: TaxonomyService.listGenres,
  // Organizer-facing genre write: PUT /taxonomy/{entity_type}/{entity_id}/genres
  // (setEntityManualGenres, body genre_slugs[]). The POST
  // /taxonomy/entities/event/{id}/genres variant is admin-only (403 for owners).
  setEntityGenres: TaxonomyService.setEntityManualGenres,
  // performer search
  searchPerformers: PerformersService.listPerformers,
  // media upload (chunk PUT is a raw fetch in upload.ts — see header note)
  initiateUpload: MediaUploadService.initiateUpload,
  completeUpload: MediaUploadService.completeUpload,
  uploadStatus: MediaUploadService.getUploadStatus,
} as const;

export type RouteKey = keyof typeof ROUTES;
