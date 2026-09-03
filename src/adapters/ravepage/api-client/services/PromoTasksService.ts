/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromoTaskCreateIn } from '../models/PromoTaskCreateIn';
import type { PromoTaskOut } from '../models/PromoTaskOut';
import type { PromoTaskUpdateIn } from '../models/PromoTaskUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PromoTasksService {
    /**
     * @deprecated
     * List promotion tasks for an event
     * Returns every promo/marketing task linked to an event,
     * ordered by scheduled_at (NULLS last). Authorized as event
     * editor: admin, event_users member, or group-organizer
     * (admin/owner/manager on the organizing group).
     * Deprecated: new integrations should use the Campaigns API
     * (POST /events/{event_id}/promo-tasks/migrate-to-campaign).
     * @returns PromoTaskOut OK
     * @throws ApiError
     */
    public static listPromoTasks({
        eventId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<Array<PromoTaskOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/promo-tasks',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                403: `Not authorised to manage this event's promo tasks`,
                404: `Event not found`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * @deprecated
     * Create a promotion task for an event
     * Creates a new promo/marketing task scoped to the event.
     * Authorized as event editor (admin, event_users, or group-
     * organizer). Returns the created row.
     * Deprecated: prefer creating a Campaign and its steps.
     * @returns PromoTaskOut Created
     * @throws ApiError
     */
    public static createPromoTask({
        eventId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Promo task fields
         */
        requestBody: PromoTaskCreateIn,
    }): CancelablePromise<PromoTaskOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/promo-tasks',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or body`,
                401: `Authentication required`,
                403: `Not authorised to manage this event's promo tasks`,
                404: `Event not found`,
                422: `Validation failed (title/platform/status/length)`,
                501: `Promo task writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * @deprecated
     * Delete a promotion task
     * Removes a promo task. Idempotent - deleting a missing
     * task still returns 204 .
     * Deprecated: use the Campaigns API.
     * @returns void
     * @throws ApiError
     */
    public static deletePromoTask({
        eventId,
        taskId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Promo task id (UUID or ptk_<uuid>)
         */
        taskId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/promo-tasks/{task_id}',
            path: {
                'event_id': eventId,
                'task_id': taskId,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                403: `Not authorised to manage this event's promo tasks`,
                404: `Event not found`,
                422: `Wrong task_id prefix`,
                501: `Promo task writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * @deprecated
     * Update a promotion task
     * Partial update on title / platform / scheduled_at /
     * status / notes. Absent fields leave the column
     * untouched. Authorized as event editor.
     * Deprecated: use the Campaigns API.
     * @returns PromoTaskOut OK
     * @throws ApiError
     */
    public static updatePromoTask({
        eventId,
        taskId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Promo task id (UUID or ptk_<uuid>)
         */
        taskId: any,
        /**
         * Promo task patch
         */
        requestBody: PromoTaskUpdateIn,
    }): CancelablePromise<PromoTaskOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/events/{event_id}/promo-tasks/{task_id}',
            path: {
                'event_id': eventId,
                'task_id': taskId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or body`,
                401: `Authentication required`,
                403: `Not authorised to manage this event's promo tasks`,
                404: `Event or promo task not found`,
                422: `Validation failed (status/length/wrong task_id prefix)`,
                501: `Promo task writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
}
