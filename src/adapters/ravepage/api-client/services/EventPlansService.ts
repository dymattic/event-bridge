/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventPlanCreateIn } from '../models/EventPlanCreateIn';
import type { EventPlanGrantIn } from '../models/EventPlanGrantIn';
import type { EventPlanGrantOut } from '../models/EventPlanGrantOut';
import type { EventPlanGrantUpdateIn } from '../models/EventPlanGrantUpdateIn';
import type { EventPlanItemIn } from '../models/EventPlanItemIn';
import type { EventPlanItemOut } from '../models/EventPlanItemOut';
import type { EventPlanItemUpdateIn } from '../models/EventPlanItemUpdateIn';
import type { EventPlanOut } from '../models/EventPlanOut';
import type { EventPlanTimelineOut } from '../models/EventPlanTimelineOut';
import type { EventPlanUpdateIn } from '../models/EventPlanUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventPlansService {
    /**
     * List event plans visible to the caller
     * Authenticated. Returns plans the caller owns, plans
     * with visibility='public', and plans shared directly
     * with the caller via a 'user' grant.
     * @returns EventPlanOut OK
     * @throws ApiError
     */
    public static listEventPlans(): CancelablePromise<Array<EventPlanOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event-plans',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a new event plan
     * Owner-only. Creates a parent event_plans row plus
     * optional inline items + grants. Visibility defaults
     * to 'private' when omitted.
     * @returns EventPlanOut Created
     * @throws ApiError
     */
    public static createEventPlan({
        requestBody,
    }: {
        /**
         * Plan payload
         */
        requestBody: EventPlanCreateIn,
    }): CancelablePromise<EventPlanOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event-plans',
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
     * Delete an event plan
     * Owner-only. Hard delete - child rows (items + grants)
     * CASCADE at the database layer. 204 No Content on success.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventPlan({
        planId,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/event-plans/{plan_id}',
            path: {
                'plan_id': planId,
            },
            errors: {
                400: `Invalid plan_id`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Event plan not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get an event plan
     * Viewer+. Returns the plan's full payload including
     * items, grants, and the caller's effective role.
     * 404 when the plan does not exist OR when the plan is
     * private and the caller has no access (existence not
     * leaked).
     * @returns EventPlanOut OK
     * @throws ApiError
     */
    public static getEventPlan({
        planId,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
    }): CancelablePromise<EventPlanOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event-plans/{plan_id}',
            path: {
                'plan_id': planId,
            },
            errors: {
                400: `Invalid plan_id`,
                401: `Authentication required`,
                403: `Access denied`,
                404: `Event plan not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update an event plan
     * Owner-only. Partial update - only fields provided on
     * the wire are mutated. Use the dedicated /items and
     * /grants endpoints to mutate those lists.
     * @returns EventPlanOut OK
     * @throws ApiError
     */
    public static updateEventPlan({
        planId,
        requestBody,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
        /**
         * Partial update payload
         */
        requestBody: EventPlanUpdateIn,
    }): CancelablePromise<EventPlanOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/event-plans/{plan_id}',
            path: {
                'plan_id': planId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Event plan not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List share grants on a plan
     * Owner-only.
     * @returns EventPlanGrantOut OK
     * @throws ApiError
     */
    public static listEventPlanGrants({
        planId,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
    }): CancelablePromise<Array<EventPlanGrantOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event-plans/{plan_id}/grants',
            path: {
                'plan_id': planId,
            },
            errors: {
                400: `Invalid plan_id`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Event plan not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add or upsert a share grant on a plan
     * Owner-only. Upsert on (plan_id, principal_type,
     * principal_id) - duplicate principals update role +
     * min_group_role.
     * @returns EventPlanGrantOut Created
     * @throws ApiError
     */
    public static createEventPlanGrant({
        planId,
        requestBody,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
        /**
         * Grant payload
         */
        requestBody: EventPlanGrantIn,
    }): CancelablePromise<EventPlanGrantOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event-plans/{plan_id}/grants',
            path: {
                'plan_id': planId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Event plan not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove a share grant
     * Owner-only. 204 No Content on success.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventPlanGrant({
        planId,
        grantId,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
        /**
         * Grant ID (UUID or epg_<uuid>)
         */
        grantId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/event-plans/{plan_id}/grants/{grant_id}',
            path: {
                'plan_id': planId,
                'grant_id': grantId,
            },
            errors: {
                400: `Invalid IDs`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Plan or grant not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a share grant
     * Owner-only. Only role + min_group_role are mutable.
     * @returns EventPlanGrantOut OK
     * @throws ApiError
     */
    public static updateEventPlanGrant({
        planId,
        grantId,
        requestBody,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
        /**
         * Grant ID (UUID or epg_<uuid>)
         */
        grantId: any,
        /**
         * Partial update payload
         */
        requestBody: EventPlanGrantUpdateIn,
    }): CancelablePromise<EventPlanGrantOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/event-plans/{plan_id}/grants/{grant_id}',
            path: {
                'plan_id': planId,
                'grant_id': grantId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Plan or grant not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add an event (and optional slot) to a plan
     * Editor+. Idempotent on (plan_id, event_id,
     * event_slot_id) - a duplicate composite tuple updates
     * note + order_index on the existing row instead of
     * emitting a 409.
     * @returns EventPlanItemOut Created
     * @throws ApiError
     */
    public static addEventPlanItem({
        planId,
        requestBody,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
        /**
         * Item payload
         */
        requestBody: EventPlanItemIn,
    }): CancelablePromise<EventPlanItemOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event-plans/{plan_id}/items',
            path: {
                'plan_id': planId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Event plan not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove an item from a plan
     * Editor+. 204 No Content on success.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventPlanItem({
        planId,
        itemId,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
        /**
         * Item ID (UUID or epi_<uuid>)
         */
        itemId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/event-plans/{plan_id}/items/{item_id}',
            path: {
                'plan_id': planId,
                'item_id': itemId,
            },
            errors: {
                400: `Invalid IDs`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Plan or item not found`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a plan item (note / order only)
     * Editor+.
     * @returns EventPlanItemOut OK
     * @throws ApiError
     */
    public static updateEventPlanItem({
        planId,
        itemId,
        requestBody,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
        /**
         * Item ID (UUID or epi_<uuid>)
         */
        itemId: any,
        /**
         * Partial update payload
         */
        requestBody: EventPlanItemUpdateIn,
    }): CancelablePromise<EventPlanItemOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/event-plans/{plan_id}/items/{item_id}',
            path: {
                'plan_id': planId,
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Plan or item not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Render the plan as a compact timeline filter
     * Viewer+. Returns the plan's items joined with each
     * event's title + start/end, ordered by `order_index`
     * then `starts_at`. Use this as a saveable filter on
     * the events feed.
     * @returns EventPlanTimelineOut OK
     * @throws ApiError
     */
    public static getEventPlanTimeline({
        planId,
    }: {
        /**
         * Plan ID (UUID or epl_<uuid>)
         */
        planId: any,
    }): CancelablePromise<EventPlanTimelineOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event-plans/{plan_id}/timeline',
            path: {
                'plan_id': planId,
            },
            errors: {
                400: `Invalid plan_id`,
                401: `Authentication required`,
                403: `Insufficient permissions`,
                404: `Event plan not found`,
                500: `Internal error`,
            },
        });
    }
}
