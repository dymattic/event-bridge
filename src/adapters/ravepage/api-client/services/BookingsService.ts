/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookingChatOut } from '../models/BookingChatOut';
import type { BookingCreateIn } from '../models/BookingCreateIn';
import type { BookingOut } from '../models/BookingOut';
import type { BookingUpdateIn } from '../models/BookingUpdateIn';
import type { PerformerBookingPreferencesUpdateIn } from '../models/PerformerBookingPreferencesUpdateIn';
import type { PerformerOut } from '../models/PerformerOut';
import type { SlotMoveConsentDefaultUpdateIn } from '../models/SlotMoveConsentDefaultUpdateIn';
import type { SlotMoveConsentEntryIn } from '../models/SlotMoveConsentEntryIn';
import type { SlotMoveConsentEntryOut } from '../models/SlotMoveConsentEntryOut';
import type { SlotMoveConsentSettingsOut } from '../models/SlotMoveConsentSettingsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookingsService {
    /**
     * Submit a booking request
     * Sends a booking request to a registered user/group or an
     * unregistered artist/venue stub. Requires an
     * authenticated caller. Supply one of target_user_id,
     * target_group_id, or target_display_name; an unregistered
     * target_display_name (with optional target_entity_type)
     * or venue_display_name is resolved into a reusable stub.
     * @returns BookingOut Created
     * @throws ApiError
     */
    public static createBookingRequest({
        requestBody,
    }: {
        /**
         * Booking fields
         */
        requestBody: BookingCreateIn,
    }): CancelablePromise<BookingOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Missing target or required fields`,
                401: `Authentication required`,
                422: `Validation failed or unsupported field`,
                500: `Internal error`,
                502: `Unregistered target/venue resolution unavailable`,
            },
        });
    }
    /**
     * List received booking requests
     * Returns booking requests addressed to the authenticated
     * caller (personal + admin-of-group arms), newest first. personal_only=true skips
     * the group fan-out. target_group_id filter is allowed
     * when the caller administers the requested group; a
     * caller filtering by a group they don't admin sees an
     * empty list.
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static listReceivedBookings({
        status,
        isActive,
        targetGroupId,
        performerId,
        personalOnly,
        skip,
        limit,
    }: {
        /**
         * Filter by status (pending|accepted|declined|cancelled)
         */
        status?: any,
        /**
         * Filter by is_active flag
         */
        isActive?: any,
        /**
         * Filter by target group id (intersected with caller admin set)
         */
        targetGroupId?: any,
        /**
         * Filter by performer id
         */
        performerId?: any,
        /**
         * Show only direct bookings (default false)
         */
        personalOnly?: any,
        /**
         * Pagination offset (default 0)
         */
        skip?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<BookingOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bookings/received',
            query: {
                'status': status,
                'is_active': isActive,
                'target_group_id': targetGroupId,
                'performer_id': performerId,
                'personal_only': personalOnly,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Authentication required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List sent booking requests
     * Returns the authenticated caller's outgoing booking
     * requests, newest first.
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static listSentBookings({
        skip,
        limit,
    }: {
        /**
         * Pagination offset (default 0)
         */
        skip?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<BookingOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bookings/sent',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a booking by id (BOLA-gated)
     * Returns the booking detail. Non-owner non-target
     * non-admin callers see 404 (not 403) to avoid leaking
     * booking-id existence.
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static getBooking({
        bookingId,
    }: {
        /**
         * Booking ID (prefixed 'bk_<uuid>' or bare UUID)
         */
        bookingId: any,
    }): CancelablePromise<BookingOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/bookings/{booking_id}',
            path: {
                'booking_id': bookingId,
            },
            errors: {
                401: `Authentication required`,
                404: `Booking not found or not visible to caller`,
                422: `Malformed booking_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Partial update (status / is_active / message / slot)
     * Partial update of a booking. Accepts status, is_active,
     * message AND the slot-refinement fields (event_id,
     * performer_id, slot_id, slot_starts_at, slot_ends_at,
     * stage_name, slot_title) - present-with-null clears a
     * field, absent leaves it unchanged. event_id/performer_id/
     * slot_id referencing a non-existent row → 422. BOLA → 404 .
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static updateBooking({
        bookingId,
        requestBody,
    }: {
        /**
         * Booking ID (prefixed or bare UUID)
         */
        bookingId: any,
        /**
         * Partial update fields
         */
        requestBody: BookingUpdateIn,
    }): CancelablePromise<BookingOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/bookings/{booking_id}',
            path: {
                'booking_id': bookingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentication required`,
                404: `Booking not found or not visible`,
                422: `Validation failed or unsupported field`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Accept a booking request
     * Marks a booking accepted. Only the target user (or
     * an admin) may accept. The state machine requires the
     * booking to be in `pending` status - `accepted`,
     * `declined`, or `cancelled` rows return 409. The
     * last_accepted_* snapshot is refreshed from the
     * booking's own slot_* columns so the slot-edit
     * cascade can compute deltas on the next mutation.
     * Group-target bookings (target_group_id set, no
     * target_user_id) return 422 - the group-admin check
     * is cross-worker pending.
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static acceptBooking({
        bookingId,
    }: {
        /**
         * Booking ID (prefixed 'bk_<uuid>' or bare UUID)
         */
        bookingId: any,
    }): CancelablePromise<BookingOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookings/{booking_id}/accept',
            path: {
                'booking_id': bookingId,
            },
            errors: {
                401: `Authentication required`,
                404: `Booking not found or not visible`,
                409: `Booking is not in 'pending' status`,
                422: `Malformed booking_id or group-target arm pending`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Activate a booking request
     * Re-opens (soft-undelete) a previously deactivated
     * booking. BOLA → 404. Idempotent on already-active rows.
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static activateBooking({
        bookingId,
    }: {
        /**
         * Booking ID (prefixed or bare UUID)
         */
        bookingId: any,
    }): CancelablePromise<BookingOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/bookings/{booking_id}/activate',
            path: {
                'booking_id': bookingId,
            },
            errors: {
                401: `Authentication required`,
                404: `Booking not found or not visible`,
                422: `Malformed booking_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Open the booking's collab chat room (requestee-only)
     * Provisions the per-booking encrypted Matrix collab room
     * on demand. Only the booking TARGET side may call it -
     * the direct target user, an owner/admin/manager of the
     * target group, or a platform admin. The requester and
     * any other caller get 404 (BOLA-safe). Collab rooms are
     * NOT auto-created on booking create/accept; this endpoint
     * is the only way to start one. Idempotent - calling it
     * again reconciles membership of the existing room and
     * returns the same 202 shape. Room readiness is async:
     * poll GET /chat/rooms?for=collab:<booking_uuid> or wait
     * for the `chat.room_provisioned` SSE topic.
     * @returns BookingChatOut Accepted
     * @throws ApiError
     */
    public static openBookingChat({
        bookingId,
    }: {
        /**
         * Booking ID (prefixed 'bk_<uuid>' or bare UUID)
         */
        bookingId: any,
    }): CancelablePromise<BookingChatOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookings/{booking_id}/chat',
            path: {
                'booking_id': bookingId,
            },
            errors: {
                401: `Authentication required`,
                404: `Booking not found, not visible, or caller is not the booking target`,
                409: `Booking has no registered requester to chat with`,
                422: `Malformed booking_id`,
                500: `Internal error`,
                503: `Chat substrate unavailable`,
            },
        });
    }
    /**
     * Deactivate a booking request
     * Soft-deletes a booking (status stays unchanged). BOLA → 404.
     * Idempotent on already-inactive rows.
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static deactivateBooking({
        bookingId,
    }: {
        /**
         * Booking ID (prefixed or bare UUID)
         */
        bookingId: any,
    }): CancelablePromise<BookingOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/bookings/{booking_id}/deactivate',
            path: {
                'booking_id': bookingId,
            },
            errors: {
                401: `Authentication required`,
                404: `Booking not found or not visible`,
                422: `Malformed booking_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Re-accept a booking after slot edit
     * Clears `needs_reconfirmation` on a booking the slot-
     * edit cascade flagged for re-acceptance. Only the
     * booking target (or admin) may reconfirm. State machine:
     * the booking must be `accepted` AND
     * `needs_reconfirmation=true` - other states return 409.
     * The last_accepted_* snapshot is refreshed from the
     * CURRENT linked slot row so the next slot edit measures
     * its delta against this fresh acceptance. Group-target
     * bookings return 422 (cross-worker group-admin pending).
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static reconfirmBooking({
        bookingId,
    }: {
        /**
         * Booking ID (prefixed 'bk_<uuid>' or bare UUID)
         */
        bookingId: any,
    }): CancelablePromise<BookingOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookings/{booking_id}/reconfirm',
            path: {
                'booking_id': bookingId,
            },
            errors: {
                401: `Authentication required`,
                404: `Booking not found or not visible`,
                409: `Booking is not in 'accepted' state or does not need reconfirmation`,
                422: `Malformed booking_id or group-target arm pending`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Reject a pending slot change on a booking
     * The performer (booking target, or admin) declines a
     * slot move the organizer applied without covering
     * slot-move consent. State machine: the booking must be
     * `accepted` AND `needs_reconfirmation=true` - other
     * states return 409. Effect: status → `declined`,
     * `needs_reconfirmation` cleared (the booking leaves the
     * confirmed line-up); the requester is notified. To
     * accept the new slot instead, use
     * POST /bookings/{booking_id}/reconfirm.
     * @returns BookingOut OK
     * @throws ApiError
     */
    public static rejectBookingSlotChange({
        bookingId,
    }: {
        /**
         * Booking ID (prefixed 'bk_<uuid>' or bare UUID)
         */
        bookingId: any,
    }): CancelablePromise<BookingOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/bookings/{booking_id}/reject-slot-change',
            path: {
                'booking_id': bookingId,
            },
            errors: {
                401: `Authentication required`,
                404: `Booking not found or not visible`,
                409: `Booking is not in 'accepted' state or has no pending slot change`,
                422: `Malformed booking_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update performer booking preferences
     * Authed-only. Sets the performer's auto-reconfirm
     * tolerance for organiser slot edits. Caller must be
     * the performer's owner, the user who claimed it, or
     * an admin (403 otherwise). Setting a non-null tolerance
     * pre-authorises slot edits within ±N minutes; null
     * requires explicit re-acceptance. Capped at 1440
     * minutes (24h).
     * @returns PerformerOut OK
     * @throws ApiError
     */
    public static updatePerformerBookingPreferences({
        performerId,
        requestBody,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
        /**
         * Booking prefs patch
         */
        requestBody: PerformerBookingPreferencesUpdateIn,
    }): CancelablePromise<PerformerOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/performers/{performer_id}/booking-preferences',
            path: {
                'performer_id': performerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorised to edit this performer's booking preferences`,
                404: `Performer not found`,
                422: `Validation failed (minutes 0..1440)`,
            },
        });
    }
    /**
     * Get performer slot-move consent settings
     * Authed-only; performer owner/claimer or admin. Returns
     * the global "allow slot moves without my confirmation"
     * default (OFF unless enabled) plus the per-organizer
     * (user) and per-group override entries. Organizer slot
     * moves covered by the resolved consent apply confirmed;
     * all other moves flip the booking to
     * needs_reconfirmation. The performer is always notified
     * either way.
     * @returns SlotMoveConsentSettingsOut OK
     * @throws ApiError
     */
    public static getPerformerSlotMoveConsent({
        performerId,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
    }): CancelablePromise<SlotMoveConsentSettingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers/{performer_id}/slot-move-consent',
            path: {
                'performer_id': performerId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not authorised`,
                404: `Performer not found`,
                422: `Invalid performer_id`,
            },
        });
    }
    /**
     * Set performer slot-move consent global default
     * Authed-only; performer owner/claimer or admin. Sets the
     * global "allow slot moves without my confirmation" flag
     * (default OFF). Per-grantee entries override this
     * default in both directions. Returns the refreshed
     * settings view.
     * @returns SlotMoveConsentSettingsOut OK
     * @throws ApiError
     */
    public static updatePerformerSlotMoveConsent({
        performerId,
        requestBody,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
        /**
         * Global default
         */
        requestBody: SlotMoveConsentDefaultUpdateIn,
    }): CancelablePromise<SlotMoveConsentSettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/performers/{performer_id}/slot-move-consent',
            path: {
                'performer_id': performerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorised`,
                404: `Performer not found`,
                422: `Invalid performer_id`,
            },
        });
    }
    /**
     * Upsert a performer slot-move consent entry
     * Authed-only; performer owner/claimer or admin. Inserts
     * or refreshes the entry for the (grantee_type,
     * grantee_id) scope - one entry per scope. `allow`
     * defaults to true (grant); explicit false records a
     * deny override against an allowing global default.
     * Precedence at move time: user entry > group entry >
     * global default.
     * @returns SlotMoveConsentEntryOut OK
     * @throws ApiError
     */
    public static upsertPerformerSlotMoveConsentEntry({
        performerId,
        requestBody,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
        /**
         * Consent entry
         */
        requestBody: SlotMoveConsentEntryIn,
    }): CancelablePromise<SlotMoveConsentEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/performers/{performer_id}/slot-move-consent/entries',
            path: {
                'performer_id': performerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorised`,
                404: `Performer not found`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Delete a performer slot-move consent entry
     * Authed-only; performer owner/claimer or admin. Removes
     * one per-grantee entry; the global default then applies
     * to that grantee again.
     * @returns void
     * @throws ApiError
     */
    public static deletePerformerSlotMoveConsentEntry({
        performerId,
        entryId,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
        /**
         * Consent entry ID (UUID)
         */
        entryId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/performers/{performer_id}/slot-move-consent/entries/{entry_id}',
            path: {
                'performer_id': performerId,
                'entry_id': entryId,
            },
            errors: {
                401: `Authentication required`,
                403: `Not authorised`,
                404: `Performer or entry not found`,
                422: `Invalid id`,
            },
        });
    }
}
