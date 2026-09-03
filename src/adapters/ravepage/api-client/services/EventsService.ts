/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventAppointmentOut } from '../models/EventAppointmentOut';
import type { EventCaptureCrewAddIn } from '../models/EventCaptureCrewAddIn';
import type { EventCaptureCrewListOut } from '../models/EventCaptureCrewListOut';
import type { EventCaptureCrewMemberOut } from '../models/EventCaptureCrewMemberOut';
import type { EventChatVisibilityIn } from '../models/EventChatVisibilityIn';
import type { EventChatVisibilityOut } from '../models/EventChatVisibilityOut';
import type { EventCollectionLinkIn } from '../models/EventCollectionLinkIn';
import type { EventCollectionLinkOut } from '../models/EventCollectionLinkOut';
import type { EventCreateIn } from '../models/EventCreateIn';
import type { EventDetail } from '../models/EventDetail';
import type { EventGroupLinkOut } from '../models/EventGroupLinkOut';
import type { EventMediaLinkIn } from '../models/EventMediaLinkIn';
import type { EventMediaLinkOut } from '../models/EventMediaLinkOut';
import type { EventOrganizerChangeIn } from '../models/EventOrganizerChangeIn';
import type { EventOut } from '../models/EventOut';
import type { EventPosterAssignIn } from '../models/EventPosterAssignIn';
import type { EventPosterOut } from '../models/EventPosterOut';
import type { EventTimelineOut } from '../models/EventTimelineOut';
import type { EventUpdateIn } from '../models/EventUpdateIn';
import type { EventVRChatInstanceCreateIn } from '../models/EventVRChatInstanceCreateIn';
import type { EventVRChatInstanceOut } from '../models/EventVRChatInstanceOut';
import type { EventVRChatInstanceWaitlistJoinOut } from '../models/EventVRChatInstanceWaitlistJoinOut';
import type { EventVRChatInstanceWaitlistStatusOut } from '../models/EventVRChatInstanceWaitlistStatusOut';
import type { ListEventsByGroupOut } from '../models/ListEventsByGroupOut';
import type { OrganizerOptionOut } from '../models/OrganizerOptionOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventsService {
    /**
     * List public events
     * Paginated list of public/unlisted events with optional organizer + title filters.
     * Anonymous-OK.
     * Authenticated callers additionally see events they are involved in (organizer,
     * member, collaborator, attendee - all visibilities), and when the organizer filter
     * names an organizer they control (themselves, or a group they hold an
     * organizer-grade role in) the list includes that organizer's non-public, draft,
     * and cancelled events - the manage-surface shape.
     * @returns EventOut OK
     * @throws ApiError
     */
    public static listEvents({
        scope,
        organizerType,
        organizerId,
        query,
        skip,
        limit,
        sortField,
        sortOrder,
    }: {
        /**
         * Filter scope
         */
        scope?: any,
        /**
         * Organizer type
         */
        organizerType?: any,
        /**
         * Organizer ID (UUID or <prefix>_<uuid>); requires organizer_type
         */
        organizerId?: any,
        /**
         * Case-insensitive substring on title
         */
        query?: any,
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size (1..200)
         */
        limit?: any,
        /**
         * Sort field
         */
        sortField?: any,
        /**
         * Sort order
         */
        sortOrder?: any,
    }): CancelablePromise<Array<EventOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events',
            query: {
                'scope': scope,
                'organizer_type': organizerType,
                'organizer_id': organizerId,
                'query': query,
                'skip': skip,
                'limit': limit,
                'sort.field': sortField,
                'sort.order': sortOrder,
            },
            errors: {
                400: `Invalid pagination or organizer_id`,
                422: `Validation failed`,
                501: `involved_user_id filter`,
            },
        });
    }
    /**
     * Create event
     * Authenticated event creation. Supports user , group , club organizer types.
     * @returns EventOut Created
     * @throws ApiError
     */
    public static createEvent({
        requestBody,
    }: {
        /**
         * Event create payload
         */
        requestBody: EventCreateIn,
    }): CancelablePromise<EventOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / slug / IDs`,
                401: `Authentication required`,
                403: `Not authorized for this organizer`,
                409: `Slug already exists`,
                422: `Validation failed`,
                501: `organizer_type=role|event`,
                503: `Cross-worker contract unconfigured`,
            },
        });
    }
    /**
     * Rich event detail for drawer/inspector
     * Returns the full event payload (metadata, action
     * links, live metrics, timing, user context) for the
     * inspector drawer. Accepts UUID or slug.
     * Anonymous-accepting (public events).
     * @returns EventDetail OK
     * @throws ApiError
     */
    public static getEventDetail({
        eventRef,
    }: {
        /**
         * Event UUID or slug
         */
        eventRef: any,
    }): CancelablePromise<EventDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/detail/{event_ref}',
            path: {
                'event_ref': eventRef,
            },
            errors: {
                404: `Event not found (or hidden by visibility)`,
            },
        });
    }
    /**
     * List available organizers for the current user
     * Returns the organizer options the current user can
     * create events for. 401 on missing/invalid claim; 502 when the
     * identity user-lookup hop fails (transient outage).
     * @returns OrganizerOptionOut OK
     * @throws ApiError
     */
    public static listEventOrganizers(): CancelablePromise<Array<OrganizerOptionOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/organizers',
            errors: {
                401: `Authentication required`,
                502: `Identity user-lookup unavailable`,
            },
        });
    }
    /**
     * Delete event
     * Soft-deletes an event. Authz: actor must be in event_users (local-owner arm).
     * @returns void
     * @throws ApiError
     */
    public static deleteEvent({
        eventId,
    }: {
        /**
         * Event ID (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                403: `Not authorized to delete this event`,
                404: `Event not found`,
                503: `Cross-worker contract unconfigured`,
            },
        });
    }
    /**
     * Get event by ID
     * Anonymous-OK single-event read; only public or unlisted events are returned.
     * @returns EventOut OK
     * @throws ApiError
     */
    public static getEvent({
        eventId,
    }: {
        /**
         * Event ID (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<EventOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id shape`,
                404: `Event not found or not visible`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update event
     * Patch-style update; every field optional. Authz: actor must be in event_users (local-owner arm).
     * @returns EventOut OK
     * @throws ApiError
     */
    public static updateEvent({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Patch payload
         */
        requestBody: EventUpdateIn,
    }): CancelablePromise<EventOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/events/{event_id}',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id / body`,
                401: `Authentication required`,
                403: `Not authorized to update this event`,
                404: `Event not found`,
                422: `Validation failed`,
                501: `Slug / organizer mutation`,
                503: `Cross-worker contract unconfigured`,
            },
        });
    }
    /**
     * Export event as iCalendar
     * Download a single event as an .ics file. Public events
     * are accessible without authentication; private events
     * return 404.
     * @returns string iCalendar text
     * @throws ApiError
     */
    public static getEventIcs({
        eventId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>) with literal .ics suffix
         */
        eventId: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}.ics',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                404: `Event not found`,
            },
        });
    }
    /**
     * List appointments for an event
     * List appointments linked to a specific event. Supports
     * pagination and sorting. Note: appointments are owned
     * by the calendar worker. This events-side endpoint emits
     * an empty list until the calendar→events appointments
     * cross-worker read contract wires. The wire shape +
     * auth gate are stable today.
     * @returns EventAppointmentOut OK
     * @throws ApiError
     */
    public static listEventAppointments({
        eventId,
        skip,
        limit,
        sortField,
        sortOrder,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Pagination offset
         */
        skip?: any,
        /**
         * Page size
         */
        limit?: any,
        /**
         * Sort field (default: start_time)
         */
        sortField?: any,
        /**
         * Sort direction (asc|desc)
         */
        sortOrder?: any,
    }): CancelablePromise<Array<EventAppointmentOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/appointments',
            path: {
                'event_id': eventId,
            },
            query: {
                'skip': skip,
                'limit': limit,
                'sort.field': sortField,
                'sort.order': sortOrder,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List an event's capture crew
     * Returns the active (non-revoked) mocap capture-crew
     * roster. Visible to event editors AND active crew
     * members (a member may see their team); anyone else
     * receives 404 (BOLA-safe - no existence oracle).
     * @returns EventCaptureCrewListOut OK
     * @throws ApiError
     */
    public static listEventCaptureCrew({
        eventId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
    }): CancelablePromise<EventCaptureCrewListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/capture-crew',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                404: `Event not found / no roster access`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a capture-crew member
     * Adds a user to the event's mocap capture-crew roster
     * (node-only standing in relay rooms; editors are
     * implicitly crew and may join as master). Editor-only.
     * Re-adding a previously revoked user creates a NEW row;
     * an ACTIVE duplicate returns 409 CREW_MEMBER_EXISTS.
     * @returns EventCaptureCrewMemberOut Created
     * @throws ApiError
     */
    public static addEventCaptureCrewMember({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Member to add
         */
        requestBody: EventCaptureCrewAddIn,
    }): CancelablePromise<EventCaptureCrewMemberOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/capture-crew',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id / body`,
                401: `Authentication required`,
                404: `Event not found / not editor`,
                409: `CREW_MEMBER_EXISTS`,
                422: `Invalid tier`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Revoke a capture-crew member
     * Soft-revokes one roster row (sets revoked_at). The
     * realtime relay observes the revoke within ≤30s (crew-
     * check cache TTL) and kicks the member's live sessions
     * on their next heartbeat. Editor-only.
     * @returns void
     * @throws ApiError
     */
    public static revokeEventCaptureCrewMember({
        eventId,
        memberId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Roster row UUID
         */
        memberId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/capture-crew/{member_id}',
            path: {
                'event_id': eventId,
                'member_id': memberId,
            },
            errors: {
                400: `Invalid ids`,
                401: `Authentication required`,
                404: `Event / member not found or not editor`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Toggle event chat-room visibility
     * Flips the event's Matrix coordination room public (open-join + directory-listed) or private (invite-only). Editor-only; applied asynchronously. Note: a room created encrypted stays E2EE even when public - new joiners can't read pre-flip history.
     * @returns EventChatVisibilityOut OK
     * @throws ApiError
     */
    public static setEventChatVisibility({
        eventId,
        requestBody,
    }: {
        /**
         * Event id (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Visibility
         */
        requestBody: EventChatVisibilityIn,
    }): CancelablePromise<EventChatVisibilityOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/events/{event_id}/chat',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid body / event_id`,
                401: `Authentication required`,
                404: `Event not found`,
                503: `Chat substrate unavailable`,
            },
        });
    }
    /**
     * List media-collection links attached to an event
     * Returns every media-collection link attached to the
     * event, ordered by sort_order then created_at. Same
     * anon-OK visibility shape as the media-links list.
     * @returns EventCollectionLinkOut OK
     * @throws ApiError
     */
    public static listEventCollectionLinks({
        eventId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
    }): CancelablePromise<Array<EventCollectionLinkOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/collection-links',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                404: `Event not found or not visible`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Attach a media collection to an event
     * Link an existing media collection to an event.
     * Caller must be an event editor; collection must
     * be owned by caller OR public/unlisted. Group-
     * owned collections held v1 (group membership arm
     * in media-ingest contract).
     * @returns EventCollectionLinkOut Created
     * @throws ApiError
     */
    public static addEventCollectionLink({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Attach payload
         */
        requestBody: EventCollectionLinkIn,
    }): CancelablePromise<EventCollectionLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/collection-links',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id / body`,
                401: `Authentication required`,
                403: `Not authorized to attach`,
                404: `Event or collection not found`,
                409: `Collection already linked to this event`,
                500: `Internal error`,
                502: `Attachable upstream unavailable`,
            },
        });
    }
    /**
     * Remove a collection link from an event
     * Detach a media collection from an event. Same
     * narrow editor cascade as deleteEventMediaLink.
     * Idempotent (silent 204 on no-op).
     * @returns void
     * @throws ApiError
     */
    public static deleteEventCollectionLink({
        eventId,
        linkId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Collection link ID (ecl_<uuid> or bare UUID)
         */
        linkId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/collection-links/{link_id}',
            path: {
                'event_id': eventId,
                'link_id': linkId,
            },
            errors: {
                400: `Invalid event_id or link_id`,
                401: `Authentication required`,
                403: `Not authorised to edit this event`,
                404: `Event not found or not visible`,
                422: `Group-organizer editor arm pending`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List platform groups linked to an event
     * Returns every platform group linked to this event.
     * Each linked group that carries a `vrchat_group_id`
     * contributes to VRChat instance auto-discovery when
     * the event goes live. Anonymous-OK . Returns 404 when the event does not
     * exist. Group enrichment (name + vrchat_group_id)
     * is resolved via the cross-worker groups-lookup
     * contract; transient enrichment failures degrade
     * silently to empty strings (the link row still ships).
     * @returns EventGroupLinkOut OK
     * @throws ApiError
     */
    public static listEventGroupLinks({
        eventId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
    }): CancelablePromise<Array<EventGroupLinkOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/groups',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                404: `Event not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlink a platform group from an event
     * Remove the link between a platform group and this
     * event. Already-discovered VRChat instance rows are
     * kept for historical attribution but will no longer
     * refresh on subsequent discovery passes. Caller must
     * be event-editor.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventGroupLink({
        eventId,
        groupId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Group ID (grp_<uuid> or bare UUID)
         */
        groupId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/groups/{group_id}',
            path: {
                'event_id': eventId,
                'group_id': groupId,
            },
            errors: {
                400: `Invalid event_id / group_id`,
                401: `Authentication required`,
                403: `Not authorised to edit this event`,
                404: `Event or link not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Link a platform group to an event
     * Link an existing platform group to this event. When
     * the event transitions to `live` the discovery service
     * walks linked groups and materializes their active
     * VRChat instances. Caller must be event-editor (admin
     * / event_users / group-organizer). Returns 409 when
     * the link already exists.
     * @returns EventGroupLinkOut Created
     * @throws ApiError
     */
    public static createEventGroupLink({
        eventId,
        groupId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Group ID (grp_<uuid> or bare UUID)
         */
        groupId: any,
    }): CancelablePromise<EventGroupLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/groups/{group_id}',
            path: {
                'event_id': eventId,
                'group_id': groupId,
            },
            errors: {
                400: `Invalid event_id / group_id`,
                401: `Authentication required`,
                403: `Not authorised to edit this event`,
                404: `Event or group not found`,
                409: `Group already linked to event`,
                500: `Internal error`,
                502: `groups-lookup upstream unavailable`,
            },
        });
    }
    /**
     * List media links attached to an event
     * Returns every media-upload link attached to the
     * event, ordered by sort_order then created_at.
     * Anon-OK - public events are visible without auth;
     * private events resolve via the involved-user
     * visibility arms. Returns the link rows only - the
     * FE must hit media-delivery separately for the
     * actual MediaUpload payload.
     * @returns EventMediaLinkOut OK
     * @throws ApiError
     */
    public static listEventMediaLinks({
        eventId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
    }): CancelablePromise<Array<EventMediaLinkOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/media-links',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                404: `Event not found or not visible`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Attach a media upload to an event
     * Attach an image/video/audio upload to an event
     * gallery. Caller must be an event editor AND admin
     * OR upload owner (group-owned uploads held v1 -
     * see media-ingest upload-attachable contract).
     * @returns EventMediaLinkOut Created
     * @throws ApiError
     */
    public static addEventMediaLink({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Attach payload
         */
        requestBody: EventMediaLinkIn,
    }): CancelablePromise<EventMediaLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/media-links',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id / body`,
                401: `Authentication required`,
                403: `Not authorized to attach`,
                404: `Event or upload not found`,
                409: `Upload already linked to this event`,
                422: `Upload not in production state`,
                500: `Internal error`,
                502: `Attachable upstream unavailable`,
            },
        });
    }
    /**
     * Remove a media link from an event
     * Detach a media upload from an event (does not
     * delete the upload itself). Caller must be the
     * event's user-organizer or an attached event_user.
     * The group-organizer editor arm returns 422 pending
     * the cross-worker groups admin-membership contract.
     * Idempotent - returns 204 even when the link does
     * not exist .
     * @returns void
     * @throws ApiError
     */
    public static deleteEventMediaLink({
        eventId,
        linkId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Media link ID (eml_<uuid> or bare UUID)
         */
        linkId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/media-links/{link_id}',
            path: {
                'event_id': eventId,
                'link_id': linkId,
            },
            errors: {
                400: `Invalid event_id or link_id`,
                401: `Authentication required`,
                403: `Not authorised to edit this event`,
                404: `Event not found or not visible`,
                422: `Group-organizer editor arm pending`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Reassign event organizer
     * Transfer an event to a new organizer (user/group/club). Only the current owner or a platform-admin may reassign, and the caller must be authorized to act as the target organizer.
     * @returns EventOut OK
     * @throws ApiError
     */
    public static reassignEventOrganizer({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Target organizer
         */
        requestBody: EventOrganizerChangeIn,
    }): CancelablePromise<EventOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/events/{event_id}/organizer',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id / body / organizer_id`,
                401: `Authentication required`,
                403: `Not authorized to reassign / not authorized for target organizer`,
                404: `Event not found`,
                422: `Validation failed`,
                501: `organizer_type=role|event`,
                503: `Cross-worker contract unconfigured`,
            },
        });
    }
    /**
     * Remove main event poster/thumbnail
     * Clears the event's assigned poster/thumbnail
     * (API ask #8 - AssignPoster required a non-nullable
     * upload id with no way to unset it). Same editor
     * gate + BOLA posture as PATCH. Idempotent - clearing
     * an event with no poster set still returns 204,
     * matching the profiles avatar/banner DELETE pattern.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventPoster({
        eventId,
    }: {
        /**
         * Event UUID or evt_<uuid>
         */
        eventId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/poster',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                404: `Event not found OR caller not editor`,
            },
        });
    }
    /**
     * Get main event poster/thumbnail
     * Returns the primary poster/thumbnail assigned to
     * this event. Anonymous-accepting .
     * @returns EventPosterOut OK
     * @throws ApiError
     */
    public static getEventPoster({
        eventId,
    }: {
        /**
         * Event UUID or evt_<uuid>
         */
        eventId: any,
    }): CancelablePromise<EventPosterOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/poster',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                404: `Event not found OR poster not set`,
            },
        });
    }
    /**
     * Assign main event poster/thumbnail
     * Caller must have edit access via event_users M2M.
     * Non-editors get 404 (BOLA). v1 scope: local-owner
     * arm only; admin override + group/club organizer
     * arms require the cross-worker contract surface.
     * @returns EventPosterOut OK
     * @throws ApiError
     */
    public static assignEventPoster({
        eventId,
        requestBody,
    }: {
        /**
         * Event UUID or evt_<uuid>
         */
        eventId: any,
        /**
         * Poster assign payload
         */
        requestBody: EventPosterAssignIn,
    }): CancelablePromise<EventPosterOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/events/{event_id}/poster',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body or event_id`,
                401: `Authentication required`,
                404: `Event not found OR caller not editor`,
                422: `Invalid media_upload_id`,
            },
        });
    }
    /**
     * Get event timeline
     * Aggregated timeline (slots + performers + tracks). Anonymous-OK.
     * @returns EventTimelineOut OK
     * @throws ApiError
     */
    public static getEventTimeline({
        eventId,
    }: {
        /**
         * Event ID
         */
        eventId: any,
    }): CancelablePromise<EventTimelineOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/timeline',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Bad Request`,
                404: `Event not found`,
            },
        });
    }
    /**
     * List VRChat instances linked to an event
     * Returns all VRChat instances currently associated with
     * this event. The link row carries cached metadata
     * (player_count / capacity / status) updated by the
     * vrchat worker's auto-discovery pass; clients render
     * "Join" buttons + live counts from this projection.
     * Anonymous-OK .
     * @returns EventVRChatInstanceOut OK
     * @throws ApiError
     */
    public static listEventVrchatInstances({
        eventId,
        status,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Filter by status (active|closed|error)
         */
        status?: any,
    }): CancelablePromise<Array<EventVRChatInstanceOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/vrchat-instances',
            path: {
                'event_id': eventId,
            },
            query: {
                'status': status,
            },
            errors: {
                400: `Invalid event_id or status`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Link a VRChat instance to an event
     * Associate a VRChat instance with this event so
     * attendees see a "Join" button on the timeline.
     * Caller must be event-editor (admin / event_users /
     * group-organizer).
     * @returns EventVRChatInstanceOut Created
     * @throws ApiError
     */
    public static createEventVrchatInstance({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Instance details
         */
        requestBody: EventVRChatInstanceCreateIn,
    }): CancelablePromise<EventVRChatInstanceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/vrchat-instances',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or body`,
                401: `Authentication required`,
                403: `Not authorised to edit this event`,
                404: `Event not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlink a VRChat instance from an event
     * Remove the association between a VRChat instance and
     * this event. Caller must be event-editor.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventVrchatInstance({
        eventId,
        linkId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Instance link UUID
         */
        linkId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/vrchat-instances/{link_id}',
            path: {
                'event_id': eventId,
                'link_id': linkId,
            },
            errors: {
                400: `Invalid ids`,
                401: `Authentication required`,
                403: `Not authorised to edit this event`,
                404: `Event or link not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a linked VRChat instance
     * Update cached metadata (player_count, capacity,
     * status, is_full) for a linked instance.
     * Caller must be event-editor.
     * @returns EventVRChatInstanceOut OK
     * @throws ApiError
     */
    public static updateEventVrchatInstance({
        eventId,
        linkId,
        playerCount,
        capacity,
        status,
        isFull,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Instance link UUID
         */
        linkId: any,
        /**
         * Current player count (>=0)
         */
        playerCount?: any,
        /**
         * Instance capacity (>=0)
         */
        capacity?: any,
        /**
         * active | closed | error
         */
        status?: any,
        /**
         * Whether instance is full
         */
        isFull?: any,
    }): CancelablePromise<EventVRChatInstanceOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/events/{event_id}/vrchat-instances/{link_id}',
            path: {
                'event_id': eventId,
                'link_id': linkId,
            },
            query: {
                'player_count': playerCount,
                'capacity': capacity,
                'status': status,
                'is_full': isFull,
            },
            errors: {
                400: `Invalid ids or query params`,
                401: `Authentication required`,
                403: `Not authorised to edit this event`,
                404: `Event or link not found`,
                422: `Invalid status value`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Leave a VRChat instance's waitlist
     * Removes the caller's active waitlist row. Idempotent:
     * leaving while never-joined (or already left) still
     * returns 204 - "leaves cleanly", no error surfaced for
     * a stale button click.
     * @returns void
     * @throws ApiError
     */
    public static leaveEventVrchatInstanceWaitlist({
        eventId,
        linkId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * VRChat instance link row UUID
         */
        linkId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/vrchat-instances/{link_id}/waitlist',
            path: {
                'event_id': eventId,
                'link_id': linkId,
            },
            errors: {
                400: `Invalid ids`,
                401: `Authentication required`,
                404: `Event / instance not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Join a full VRChat instance's waitlist
     * Adds the caller to the instance's waitlist. 409
     * INSTANCE_NOT_FULL when the instance isn't currently
     * full - the waitlist only makes sense once "Join" has
     * become "Full". Idempotent: a repeat join while still
     * active returns the SAME row (position may have moved
     * since earlier waiters left).
     * @returns EventVRChatInstanceWaitlistJoinOut OK
     * @throws ApiError
     */
    public static joinEventVrchatInstanceWaitlist({
        eventId,
        linkId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * VRChat instance link row UUID
         */
        linkId: any,
    }): CancelablePromise<EventVRChatInstanceWaitlistJoinOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/vrchat-instances/{link_id}/waitlist',
            path: {
                'event_id': eventId,
                'link_id': linkId,
            },
            errors: {
                400: `Invalid ids`,
                401: `Authentication required`,
                404: `Event / instance not found`,
                409: `INSTANCE_NOT_FULL`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get the caller's waitlist standing for one instance
     * Returns whether the caller is on the waitlist, their
     * informational position, and whether a capacity-freed
     * notification already fired for them. Used to restore
     * button state (Join waitlist / Waitlisted #N) across
     * reloads.
     * @returns EventVRChatInstanceWaitlistStatusOut OK
     * @throws ApiError
     */
    public static getEventVrchatInstanceWaitlistStatus({
        eventId,
        linkId,
    }: {
        /**
         * Event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * VRChat instance link row UUID
         */
        linkId: any,
    }): CancelablePromise<EventVRChatInstanceWaitlistStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/vrchat-instances/{link_id}/waitlist/me',
            path: {
                'event_id': eventId,
                'link_id': linkId,
            },
            errors: {
                400: `Invalid ids`,
                401: `Authentication required`,
                404: `Event / instance not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List events organised by a group
     * Returns visibility-filtered events
     * organised by the group (organizer_type='group' AND
     * organizer_id=group_id). Anonymous callers see only
     * public+unlisted; authed callers see those plus their
     * involved-events.
     * @returns ListEventsByGroupOut OK
     * @throws ApiError
     */
    public static listGroupEvents({
        groupId,
        limit,
        offset,
    }: {
        /**
         * Group UUID or grp_<uuid>
         */
        groupId: any,
        /**
         * Max rows (default 100, max 500)
         */
        limit?: any,
        /**
         * Pagination offset
         */
        offset?: any,
    }): CancelablePromise<ListEventsByGroupOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/groups/{group_id}/events',
            path: {
                'group_id': groupId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                400: `Invalid group_id / limit / offset`,
                502: `Upstream events worker unavailable`,
            },
        });
    }
}
