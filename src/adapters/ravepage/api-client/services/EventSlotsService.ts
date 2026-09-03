/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventSlotCreateIn } from '../models/EventSlotCreateIn';
import type { EventSlotOut } from '../models/EventSlotOut';
import type { EventSlotUpdateIn } from '../models/EventSlotUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventSlotsService {
    /**
     * List event slots
     * Returns timeline slots for an event. Anonymous-OK if event is public.
     * @returns EventSlotOut OK
     * @throws ApiError
     */
    public static listEventSlots({
        eventId,
    }: {
        /**
         * Event ID
         */
        eventId: any,
    }): CancelablePromise<Array<EventSlotOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/slots',
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
     * Create event slot
     * Adds a timeline slot to an event. Authz: event-owner or admin collaborator.
     * @returns EventSlotOut Created
     * @throws ApiError
     */
    public static createEventSlot({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Slot payload
         */
        requestBody: EventSlotCreateIn,
    }): CancelablePromise<EventSlotOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/slots',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Not authorized`,
                404: `Event not found`,
                409: `Slot conflict`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Delete event slot
     * Removes a slot row. Authz: event-owner or admin collaborator.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventSlot({
        eventId,
        slotId,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Slot ID
         */
        slotId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/slots/{slot_id}',
            path: {
                'event_id': eventId,
                'slot_id': slotId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Slot not found`,
            },
        });
    }
    /**
     * Update event slot
     * Patches a slot's fields. Authz: event-owner or admin collaborator.
     * @returns EventSlotOut OK
     * @throws ApiError
     */
    public static updateEventSlot({
        eventId,
        slotId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Slot ID
         */
        slotId: any,
        /**
         * Patch payload
         */
        requestBody: EventSlotUpdateIn,
    }): CancelablePromise<EventSlotOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/events/{event_id}/slots/{slot_id}',
            path: {
                'event_id': eventId,
                'slot_id': slotId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Slot not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
