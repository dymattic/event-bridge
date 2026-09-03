/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtistNameCreateIn } from '../models/ArtistNameCreateIn';
import type { ArtistNameOut } from '../models/ArtistNameOut';
import type { ArtistNameUpdateIn } from '../models/ArtistNameUpdateIn';
import type { EventImageCreateIn } from '../models/EventImageCreateIn';
import type { EventImageOut } from '../models/EventImageOut';
import type { EventImageUpdateIn } from '../models/EventImageUpdateIn';
import type { EventPerformerCreateIn } from '../models/EventPerformerCreateIn';
import type { EventPerformerOut } from '../models/EventPerformerOut';
import type { EventPerformerUpdateIn } from '../models/EventPerformerUpdateIn';
import type { MyPerformerCreateIn } from '../models/MyPerformerCreateIn';
import type { OauthClaimInitOut } from '../models/OauthClaimInitOut';
import type { PerformerBookingPreferencesUpdateIn } from '../models/PerformerBookingPreferencesUpdateIn';
import type { PerformerClaimCreateIn } from '../models/PerformerClaimCreateIn';
import type { PerformerClaimOut } from '../models/PerformerClaimOut';
import type { PerformerClaimUpdateIn } from '../models/PerformerClaimUpdateIn';
import type { PerformerCreateIn } from '../models/PerformerCreateIn';
import type { PerformerOauthLinkOut } from '../models/PerformerOauthLinkOut';
import type { PerformerOptoutIn } from '../models/PerformerOptoutIn';
import type { PerformerOptoutOut } from '../models/PerformerOptoutOut';
import type { PerformerOut } from '../models/PerformerOut';
import type { PerformerShowcaseSummaryOut } from '../models/PerformerShowcaseSummaryOut';
import type { PerformerTypeCreateIn } from '../models/PerformerTypeCreateIn';
import type { PerformerTypeOut } from '../models/PerformerTypeOut';
import type { PerformerUpdateIn } from '../models/PerformerUpdateIn';
import type { SlotMoveConsentDefaultUpdateIn } from '../models/SlotMoveConsentDefaultUpdateIn';
import type { SlotMoveConsentEntryIn } from '../models/SlotMoveConsentEntryIn';
import type { SlotMoveConsentEntryOut } from '../models/SlotMoveConsentEntryOut';
import type { SlotMoveConsentSettingsOut } from '../models/SlotMoveConsentSettingsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PerformersService {
    /**
     * List images for an event
     * Returns the flat list of `EventImage` rows attached to
     * the parent event, ordered by `sort_order` then
     * `created_at`. Empty result is `[]`,
     * not `null` .
     * @returns EventImageOut OK
     * @throws ApiError
     */
    public static listEventImages({
        eventId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<Array<EventImageOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/images',
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
     * Add an image to an event
     * Creates a new `EventImage` row on the parent event.
     * `image_type` defaults to `"gallery"` when omitted ; explicit JSON `null` keeps the
     * column NULL. Returns 201 with the created row.
     * Stores `uploaded_by_user_id = <claim user>`. Caller
     * must be an event editor (admin / event_users member /
     * organizer-group role); a non-editor gets the same 404
     * as event-not-found (BOLA-safe).
     * @returns EventImageOut Created
     * @throws ApiError
     */
    public static addEventImage({
        eventId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Image fields
         */
        requestBody: EventImageCreateIn,
    }): CancelablePromise<EventImageOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/images',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or JSON body`,
                401: `Authentication required`,
                404: `Event not found, or caller is not an event editor`,
                422: `Validation failed (url empty / max length / caption length / image_type length)`,
                501: `Image writes not configured on this deployment`,
            },
        });
    }
    /**
     * Remove an image from an event
     * Deletes a single `EventImage` row. Authorized as the
     * uploader OR a platform admin .
     * Returns 204 on success. Strict prefix validation on
     * `image_id` (UUID or `evi_<uuid>`); any other prefix
     * returns 422.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventImage({
        eventId,
        imageId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Event image id (UUID or evi_<uuid>)
         */
        imageId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/images/{image_id}',
            path: {
                'event_id': eventId,
                'image_id': imageId,
            },
            errors: {
                400: `Invalid event_id or image_id`,
                401: `Authentication required`,
                403: `Not authorised`,
                404: `Image not found`,
                422: `Validation failed (image_id prefix)`,
                501: `Image writes not configured on this deployment`,
            },
        });
    }
    /**
     * Update an event image
     * Partial update on `caption` / `image_type` /
     * `sort_order`. Absent fields leave the column
     * untouched. Authorized as the uploader OR a platform
     * admin . Empty body → no-op
     * commit . Strict prefix validation on
     * `image_id`: bare UUID or `evi_<uuid>`; any other
     * prefix returns 422.
     * @returns EventImageOut OK
     * @throws ApiError
     */
    public static updateEventImage({
        eventId,
        imageId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Event image id (UUID or evi_<uuid>)
         */
        imageId: any,
        /**
         * Image patch
         */
        requestBody: EventImageUpdateIn,
    }): CancelablePromise<EventImageOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/events/{event_id}/images/{image_id}',
            path: {
                'event_id': eventId,
                'image_id': imageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id, image_id, or JSON body`,
                401: `Authentication required`,
                403: `Not authorised`,
                404: `Image not found`,
                422: `Validation failed (image_id prefix / caption length / image_type length)`,
                501: `Image writes not configured on this deployment`,
            },
        });
    }
    /**
     * List performers for an event
     * Returns every event_performers row attached to the
     * event, ordered by (billing_order ASC, starts_at ASC).
     * Anonymous-tolerant; private events return 404 to
     * callers not in the involved-user set (BOLA-safe).
     * @returns EventPerformerOut OK
     * @throws ApiError
     */
    public static listEventPerformers({
        eventId,
    }: {
        /**
         * Event UUID (bare or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<Array<EventPerformerOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/performers',
            path: {
                'event_id': eventId,
            },
            errors: {
                404: `Event not found`,
                422: `Invalid event_id`,
                500: `Internal error`,
                503: `Events visibility upstream unavailable`,
            },
        });
    }
    /**
     * Add a performer to an event
     * Authenticated. Idempotent on (event_id, performer_id,
     * slot_id) - concurrent inserts collapse to one row via
     * the uq_event_performers_event_perf_slot DB constraint.
     * Provide performer_id OR performer_name; with name
     * alone, an existing performer of that name is reused
     * case-insensitively else an unclaimed stub is created.
     * @returns EventPerformerOut Created
     * @throws ApiError
     */
    public static addEventPerformer({
        eventId,
        requestBody,
    }: {
        /**
         * Event UUID
         */
        eventId: any,
        /**
         * Event-performer add payload
         */
        requestBody: EventPerformerCreateIn,
    }): CancelablePromise<EventPerformerOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/performers',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Event or performer not found`,
                422: `Invalid event_id OR missing required fields`,
                500: `Internal error`,
                503: `Events visibility upstream unavailable`,
            },
        });
    }
    /**
     * Remove a performer from an event
     * Authenticated.
     * @returns void
     * @throws ApiError
     */
    public static removeEventPerformerDelete({
        eventId,
        eventPerformerId,
    }: {
        /**
         * Event UUID
         */
        eventId: any,
        /**
         * Event-performer UUID
         */
        eventPerformerId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/performers/{event_performer_id}',
            path: {
                'event_id': eventId,
                'event_performer_id': eventPerformerId,
            },
            errors: {
                401: `Authentication required`,
                404: `Event performer entry not found`,
                422: `Invalid id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a performer assignment on an event
     * Authenticated. PATCH semantics - only supplied fields
     * change.
     * @returns EventPerformerOut OK
     * @throws ApiError
     */
    public static updateEventPerformer({
        eventId,
        eventPerformerId,
        requestBody,
    }: {
        /**
         * Event UUID
         */
        eventId: any,
        /**
         * Event-performer UUID (bare or evp_<uuid>)
         */
        eventPerformerId: any,
        /**
         * Event-performer patch payload
         */
        requestBody: EventPerformerUpdateIn,
    }): CancelablePromise<EventPerformerOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/events/{event_id}/performers/{event_performer_id}',
            path: {
                'event_id': eventId,
                'event_performer_id': eventPerformerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Event performer entry not found`,
                422: `Invalid id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List performer types
     * Anonymous-OK list of every performer-type vocabulary entry.
     * @returns PerformerTypeOut OK
     * @throws ApiError
     */
    public static listPerformerTypes(): CancelablePromise<Array<PerformerTypeOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performer-types',
        });
    }
    /**
     * Create a performer type (admin)
     * Admin-only. Inserts a new row in the performer-types
     * catalog. Slug must be globally unique (case-insensitive);
     * conflict returns 409.
     * @returns PerformerTypeOut Created
     * @throws ApiError
     */
    public static createPerformerType({
        requestBody,
    }: {
        /**
         * Performer type payload
         */
        requestBody: PerformerTypeCreateIn,
    }): CancelablePromise<PerformerTypeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/performer-types',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                409: `Slug already exists`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * List performers
     * Anonymous-OK list of performers with optional name and unclaimed-only filters.
     * @returns PerformerOut OK
     * @throws ApiError
     */
    public static listPerformers({
        q,
        unclaimedOnly,
        includeUnclaimed,
        family,
    }: {
        /**
         * Case-insensitive name substring
         */
        q?: any,
        /**
         * Filter to unclaimed performers only
         */
        unclaimedOnly?: any,
        /**
         * Include unclaimed (SoundCloud-sourced) performers. Default true; pass false to hide them from public discovery.
         */
        includeUnclaimed?: any,
        /**
         * CSV of derived genre-family keys (e.g. 'House,Techno'). Returns performers whose genre_families include ANY listed family. Family keys are clustered labels, NOT taxonomy slugs.
         */
        family?: any,
    }): CancelablePromise<Array<PerformerOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers',
            query: {
                'q': q,
                'unclaimed_only': unclaimedOnly,
                'include_unclaimed': includeUnclaimed,
                'family': family,
            },
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Create a performer
     * Authed-only. Global case-insensitive name dedup - if a
     * performer with the same name (after trim) already
     * exists, that row is returned with 201 instead of
     * creating a duplicate. New rows default to
     * `is_verified=false`, `is_claimed=false`, `source='manual'`.
     * @returns PerformerOut Created
     * @throws ApiError
     */
    public static createPerformer({
        requestBody,
    }: {
        /**
         * Performer create payload
         */
        requestBody: PerformerCreateIn,
    }): CancelablePromise<PerformerOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/performers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Approve / reject / dispute a performer claim (admin)
     * Admin-only. Approving a claim transfers performer
     * ownership to the claimant. Status must be one of
     * approved | rejected | disputed. The Go port derives
     * performer_id from the loaded claim row .
     * @returns PerformerClaimOut OK
     * @throws ApiError
     */
    public static updatePerformerClaim({
        claimId,
        requestBody,
    }: {
        /**
         * Claim ID (UUID or pcl_<uuid>)
         */
        claimId: any,
        /**
         * Claim patch payload
         */
        requestBody: PerformerClaimUpdateIn,
    }): CancelablePromise<PerformerClaimOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/performers/claims/{claim_id}',
            path: {
                'claim_id': claimId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin access required`,
                404: `Claim not found`,
                422: `Invalid claim_id or status`,
            },
        });
    }
    /**
     * Get performer by ID
     * Anonymous-OK single performer lookup.
     * @returns PerformerOut OK
     * @throws ApiError
     */
    public static getPerformer({
        performerId,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
    }): CancelablePromise<PerformerOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers/{performer_id}',
            path: {
                'performer_id': performerId,
            },
            errors: {
                404: `Performer not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Update a performer
     * Authed-only. Patch semantics - only supplied fields
     * change. Caller must be the performer's owner
     * (`user_id`), the user who claimed it
     * (`claimed_by_user_id`), or an admin (403 otherwise).
     * @returns PerformerOut OK
     * @throws ApiError
     */
    public static updatePerformer({
        performerId,
        requestBody,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
        /**
         * Performer patch payload
         */
        requestBody: PerformerUpdateIn,
    }): CancelablePromise<PerformerOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/performers/{performer_id}',
            path: {
                'performer_id': performerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Not authorised to edit this performer`,
                404: `Performer not found`,
                422: `Validation failed`,
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
     * File a claim for an unlinked performer
     * Authed-only. The caller files an ownership claim
     * against a performer profile they don't already own.
     * Duplicate-pending-claim from the same caller returns
     * 409. Reason is required and must be at least 10
     * characters.
     * @returns PerformerClaimOut Created
     * @throws ApiError
     */
    public static claimPerformer({
        performerId,
        requestBody,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
        /**
         * Claim payload
         */
        requestBody: PerformerClaimCreateIn,
    }): CancelablePromise<PerformerClaimOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/performers/{performer_id}/claim',
            path: {
                'performer_id': performerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Performer not found`,
                409: `Already owns / pending claim exists`,
                422: `Invalid performer_id or reason`,
            },
        });
    }
    /**
     * Initiate an OAuth-verified claim for a performer
     * Authed-only. Validates the performer exists and has
     * a SoundCloud reference, then returns an auth_url the
     * FE redirects the user to. The Go port returns a
     * relative URL pointing at identity's
     * /auth/soundcloud/init with a link_performer_id query
     * param; identity mints PKCE state + persists the
     * oauth_flows row on the actual start.
     * @returns OauthClaimInitOut OK
     * @throws ApiError
     */
    public static initOauthClaimPerformer({
        performerId,
        frontendRedirectUri,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
        /**
         * URI to redirect the user to after OAuth completes
         */
        frontendRedirectUri: any,
    }): CancelablePromise<OauthClaimInitOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/performers/{performer_id}/claim/verify-oauth',
            path: {
                'performer_id': performerId,
            },
            query: {
                'frontend_redirect_uri': frontendRedirectUri,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found`,
                409: `Already owns this performer`,
                422: `No SoundCloud reference`,
            },
        });
    }
    /**
     * List claims for a performer (admin)
     * Admin-only. Returns every claim row for the supplied
     * performer.
     * @returns PerformerClaimOut OK
     * @throws ApiError
     */
    public static listPerformerClaims({
        performerId,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
    }): CancelablePromise<Array<PerformerClaimOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers/{performer_id}/claims',
            path: {
                'performer_id': performerId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin access required`,
                422: `Invalid performer_id`,
            },
        });
    }
    /**
     * Get a performer's catalog-wide discovered-link opt-out
     * Returns the current catalog-wide discovered-link opt-out
     * state. Authorized for a claimed owner of the performer;
     * a non-owner gets 404 (BOLA-safe).
     * @returns PerformerOptoutOut OK
     * @throws ApiError
     */
    public static getPerformerDiscoveredLinkOptout({
        performerId,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
    }): CancelablePromise<PerformerOptoutOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers/{performer_id}/discovered-link-optout',
            path: {
                'performer_id': performerId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Performer not found or not owned`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Set a performer's catalog-wide discovered-link opt-out
     * Sets or clears a catalog-wide flag that excludes ALL
     * discovered links on the performer's credited tracks from
     * platform_links. Authorized for a claimed owner of the
     * performer; a non-owner gets 404 (BOLA-safe).
     * @returns PerformerOptoutOut OK
     * @throws ApiError
     */
    public static setPerformerDiscoveredLinkOptout({
        performerId,
        requestBody,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
        /**
         * Opt-out toggle
         */
        requestBody: PerformerOptoutIn,
    }): CancelablePromise<PerformerOptoutOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/performers/{performer_id}/discovered-link-optout',
            path: {
                'performer_id': performerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Performer not found or not owned`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List OAuth links for a performer
     * Authed-only. Returns the OAuth provider links for a
     * performer owned by the current user. Non-owner
     * returns 404 (BOLA-safe - never 403). Token columns
     * are never returned.
     * @returns PerformerOauthLinkOut OK
     * @throws ApiError
     */
    public static listPerformerOauthLinks({
        performerId,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
    }): CancelablePromise<Array<PerformerOauthLinkOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers/{performer_id}/oauth-links',
            path: {
                'performer_id': performerId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer not found or not owned by caller`,
                422: `Invalid performer_id`,
            },
        });
    }
    /**
     * Unlink an OAuth provider from a performer
     * Authed-only. Owner-only (BOLA-safe 404 on mismatch).
     * Idempotency: a missing link returns 404 .
     * @returns void
     * @throws ApiError
     */
    public static deletePerformerOauthLink({
        performerId,
        linkId,
    }: {
        /**
         * Performer ID
         */
        performerId: any,
        /**
         * OAuth link ID (UUID or oal_<uuid>)
         */
        linkId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/performers/{performer_id}/oauth-links/{link_id}',
            path: {
                'performer_id': performerId,
                'link_id': linkId,
            },
            errors: {
                401: `Authentication required`,
                404: `Performer or link not found`,
                422: `Invalid id`,
            },
        });
    }
    /**
     * Get the showcase page linked to this performer
     * Public read. Returns the linked showcase page summary
     * (id, slug, display_name, visibility flags) plus the
     * claiming user's username so the FE can pivot from the
     * performer-owned showcase to user-scoped resources.
     * @returns PerformerShowcaseSummaryOut OK
     * @throws ApiError
     */
    public static getPerformerShowcasePage({
        performerId,
    }: {
        /**
         * Performer ID (UUID or perf_<uuid>)
         */
        performerId: any,
    }): CancelablePromise<PerformerShowcaseSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/performers/{performer_id}/showcase',
            path: {
                'performer_id': performerId,
            },
            errors: {
                404: `Performer or showcase not found`,
                422: `Invalid performer_id`,
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
    /**
     * List artist names (current user)
     * Authed-only. Returns every artist_name owned by the
     * caller, sorted with the primary first then by creation
     * time ascending. Empty list emits `[]` (never null).
     * @returns ArtistNameOut OK
     * @throws ApiError
     */
    public static listMyArtistNames(): CancelablePromise<Array<ArtistNameOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/artist-names',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create an artist name (current user)
     * Authed-only. When `is_primary` is true, the user's
     * existing primary stage name is demoted atomically in
     * the same transaction.
     * @returns ArtistNameOut Created
     * @throws ApiError
     */
    public static addArtistName({
        requestBody,
    }: {
        /**
         * Artist name payload
         */
        requestBody: ArtistNameCreateIn,
    }): CancelablePromise<ArtistNameOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/me/artist-names',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Validation failed (name length)`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete an artist name (current user)
     * Authed-only. Non-owner gets the same 404 as a missing
     * row (BOLA-safe).
     * @returns void
     * @throws ApiError
     */
    public static deleteArtistName({
        artistNameId,
    }: {
        /**
         * Artist name UUID
         */
        artistNameId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/me/artist-names/{artist_name_id}',
            path: {
                'artist_name_id': artistNameId,
            },
            errors: {
                401: `Authentication required`,
                404: `Artist name not found`,
                422: `Invalid artist_name_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update an artist name (current user)
     * Authed-only. Patch semantics - only supplied fields
     * change. Setting `is_primary` true demotes any sibling
     * primary in the same transaction. Non-owner gets the
     * same 404 as a missing row (BOLA-safe).
     * @returns ArtistNameOut OK
     * @throws ApiError
     */
    public static updateArtistName({
        artistNameId,
        requestBody,
    }: {
        /**
         * Artist name UUID
         */
        artistNameId: any,
        /**
         * Patch payload
         */
        requestBody: ArtistNameUpdateIn,
    }): CancelablePromise<ArtistNameOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/me/artist-names/{artist_name_id}',
            path: {
                'artist_name_id': artistNameId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Artist name not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List the current user's performer profiles
     * Returns all performer profiles owned by the
     * authenticated user, ordered by name. Performer
     * covers any claimable professional identity in the
     * scene (DJ, dancer, photographer, promoter,
     * producer, musician, ...).
     * @returns PerformerOut OK
     * @throws ApiError
     */
    public static listMyPerformers(): CancelablePromise<Array<PerformerOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/performers',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Create a performer profile for the current user
     * Creates a performer that the user owns immediately.
     * Reuses an existing self-owned performer with the
     * same (case-insensitive) name rather than creating a
     * duplicate (returns the existing row with 201).
     * @returns PerformerOut Created
     * @throws ApiError
     */
    public static createMyPerformer({
        requestBody,
    }: {
        /**
         * Performer payload
         */
        requestBody: MyPerformerCreateIn,
    }): CancelablePromise<PerformerOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/me/performers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Performer type not found`,
                422: `Validation failed`,
            },
        });
    }
}
