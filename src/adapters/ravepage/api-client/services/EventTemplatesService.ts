/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventOut } from '../models/EventOut';
import type { EventTemplateCreateIn } from '../models/EventTemplateCreateIn';
import type { EventTemplateInstantiateIn } from '../models/EventTemplateInstantiateIn';
import type { EventTemplateOut } from '../models/EventTemplateOut';
import type { EventTemplateSaveFromEventIn } from '../models/EventTemplateSaveFromEventIn';
import type { EventTemplateShareIn } from '../models/EventTemplateShareIn';
import type { EventTemplateUpdateIn } from '../models/EventTemplateUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventTemplatesService {
    /**
     * List visible event templates
     * Authenticated. Returns templates the caller owns,
     * templates with visibility='public', and templates
     * shared directly with the caller via a 'user' share
     * grant.
     * @returns EventTemplateOut OK
     * @throws ApiError
     */
    public static listEventTemplates(): CancelablePromise<Array<EventTemplateOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event-templates',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create an event template
     * Owner-only. Creates a new structural blueprint with
     * optional slot scaffolding + initial share grants.
     * Visibility defaults to 'private' when omitted.
     * @returns EventTemplateOut Created
     * @throws ApiError
     */
    public static createEventTemplate({
        requestBody,
    }: {
        /**
         * Template payload
         */
        requestBody: EventTemplateCreateIn,
    }): CancelablePromise<EventTemplateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event-templates',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete an event template
     * Owner-only. Hard delete - child rows (slots + shares)
     * CASCADE at the database layer. 204 No Content on success.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventTemplate({
        templateId,
    }: {
        /**
         * Template ID (UUID or evtpl_<uuid>)
         */
        templateId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/event-templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            errors: {
                400: `Invalid template_id`,
                401: `Authentication required`,
                403: `Only the template owner can perform this action`,
                404: `Event template not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get an event template
     * Authenticated. Returns the template's full payload
     * including slot scaffolding + share grants. 404 when
     * the template does not exist OR when the caller has
     * no read access .
     * @returns EventTemplateOut OK
     * @throws ApiError
     */
    public static getEventTemplate({
        templateId,
    }: {
        /**
         * Template ID (UUID or evtpl_<uuid>)
         */
        templateId: any,
    }): CancelablePromise<EventTemplateOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event-templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            errors: {
                400: `Invalid template_id`,
                401: `Authentication required`,
                404: `Event template not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update an event template
     * Owner-only. Partial update - only fields provided on
     * the wire are mutated. Passing `slots` (even an empty
     * list) replaces the template's slot scaffolding
     * atomically. Use the dedicated /share endpoints to
     * manage share grants.
     * @returns EventTemplateOut OK
     * @throws ApiError
     */
    public static updateEventTemplate({
        templateId,
        requestBody,
    }: {
        /**
         * Template ID (UUID or evtpl_<uuid>)
         */
        templateId: any,
        /**
         * Partial update payload
         */
        requestBody: EventTemplateUpdateIn,
    }): CancelablePromise<EventTemplateOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/event-templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Only the template owner can perform this action`,
                404: `Event template not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Apply a template to create a draft event
     * Resolves the template's slot offsets against the
     * supplied `starts_at` and produces a draft event with
     * the template's structural fields and slot
     * scaffolding. The produced event always starts in
     * `status='draft'` and never carries forward bookings,
     * attendees, performer assignments, or any other
     * booking state. Authz envelope: the caller must be the
     * user-organizer (or the template's default organizer for
     * USER templates), OR hold a groups organizer role
     * (admin/manager/owner) for a GROUP organizer / a club
     * organizer role (owner/manager) for a CLUB organizer.
     * @returns EventOut Created
     * @throws ApiError
     */
    public static instantiateEventTemplate({
        templateId,
        requestBody,
    }: {
        /**
         * Template ID (evtpl_<uuid> or bare UUID)
         */
        templateId: any,
        /**
         * Instantiation payload
         */
        requestBody: EventTemplateInstantiateIn,
    }): CancelablePromise<EventOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event-templates/{template_id}/instantiate',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid template_id or request body`,
                401: `Authentication required`,
                403: `Not authorized to instantiate as the resolved organizer`,
                404: `Template not found or not accessible`,
                409: `Slug collision`,
                422: `Validation failed`,
                500: `Internal error`,
                503: `Organizer authorization temporarily unavailable`,
            },
        });
    }
    /**
     * Remove share grants from an event template
     * Owner-only. Idempotent - share grants that don't
     * exist are silently skipped.
     * @returns EventTemplateOut OK
     * @throws ApiError
     */
    public static unshareEventTemplate({
        templateId,
        requestBody,
    }: {
        /**
         * Template ID (UUID or evtpl_<uuid>)
         */
        templateId: any,
        /**
         * Share grants payload
         */
        requestBody: EventTemplateShareIn,
    }): CancelablePromise<EventTemplateOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/event-templates/{template_id}/share',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Only the template owner can perform this action`,
                404: `Event template not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add share grants on an event template
     * Owner-only. Idempotent - duplicate
     * (entity_type, entity_id) pairs are silently skipped.
     * Setting visibility='shared' on the template itself is
     * the caller's responsibility (POST /event-templates or
     * PATCH /event-templates/{id}).
     * @returns EventTemplateOut OK
     * @throws ApiError
     */
    public static shareEventTemplate({
        templateId,
        requestBody,
    }: {
        /**
         * Template ID (UUID or evtpl_<uuid>)
         */
        templateId: any,
        /**
         * Share grants payload
         */
        requestBody: EventTemplateShareIn,
    }): CancelablePromise<EventTemplateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event-templates/{template_id}/share',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Only the template owner can perform this action`,
                404: `Event template not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Save an event's structure as a template
     * Snapshot the structural fields and slot scaffolding
     * of `event_id` into a new EventTemplate owned by the
     * caller. Bookings, performer assignments, attendees,
     * collaborators, group links, VRChat instances,
     * posters, and media links are never copied -
     * templates carry only the structural layout. Defaults
     * to `visibility='private'`; share via the dedicated
     * /share endpoint after creation. Authz envelope: caller
     * must be the user-organizer, attached via `event_users`,
     * OR hold an organizer role in the source event's group
     * (admin/manager/owner) or club (owner/manager) organizer.
     * @returns EventTemplateOut Created
     * @throws ApiError
     */
    public static saveEventAsTemplate({
        eventId,
        requestBody,
    }: {
        /**
         * Source event ID (evt_<uuid> or bare UUID)
         */
        eventId: any,
        /**
         * Template metadata
         */
        requestBody: EventTemplateSaveFromEventIn,
    }): CancelablePromise<EventTemplateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/save-as-template',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or request body`,
                401: `Authentication required`,
                403: `Not authorized to save this event as a template`,
                404: `Event not found`,
                422: `Validation failed`,
                500: `Internal error`,
                503: `Organizer authorization temporarily unavailable`,
            },
        });
    }
}
