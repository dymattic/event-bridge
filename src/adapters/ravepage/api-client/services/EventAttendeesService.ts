/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendeeCreateIn } from '../models/AttendeeCreateIn';
import type { AttendeeOut } from '../models/AttendeeOut';
import type { AttendeeUpdateIn } from '../models/AttendeeUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventAttendeesService {
    /**
     * List event attendees
     * Anonymous-OK. Returns all attendee rows for the event.
     * @returns AttendeeOut OK
     * @throws ApiError
     */
    public static listEventAttendees({
        eventId,
    }: {
        /**
         * Event ID
         */
        eventId: any,
    }): CancelablePromise<Array<AttendeeOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/attendees',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Add event attendee
     * Authenticated insert. Body's user_id is optional; defaults to caller.
     * @returns AttendeeOut Created
     * @throws ApiError
     */
    public static addEventAttendee({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Attendee row
         */
        requestBody: AttendeeCreateIn,
    }): CancelablePromise<AttendeeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/attendees',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                409: `Attendee already exists`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Remove event attendee
     * @returns void
     * @throws ApiError
     */
    public static deleteEventAttendee({
        eventId,
        userId,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Target user ID
         */
        userId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/attendees/{user_id}',
            path: {
                'event_id': eventId,
                'user_id': userId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Update event attendee
     * Patch status / notes for an attendee row.
     * @returns AttendeeOut OK
     * @throws ApiError
     */
    public static updateEventAttendee({
        eventId,
        userId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Target user ID
         */
        userId: any,
        /**
         * Patch
         */
        requestBody: AttendeeUpdateIn,
    }): CancelablePromise<AttendeeOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/events/{event_id}/attendees/{user_id}',
            path: {
                'event_id': eventId,
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Attendee not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Self-RSVP to event
     * Self-upsert; body's user_id is ignored (caller's user_id is used).
     * @returns AttendeeOut Created
     * @throws ApiError
     */
    public static rsvpToEvent({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * RSVP body (status required)
         */
        requestBody: AttendeeCreateIn,
    }): CancelablePromise<AttendeeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/rsvp',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                409: `Attendee already exists (race)`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
