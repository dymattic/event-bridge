/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventCollaboratorCreateIn } from '../models/EventCollaboratorCreateIn';
import type { EventCollaboratorOut } from '../models/EventCollaboratorOut';
import type { EventCollaboratorUpdateIn } from '../models/EventCollaboratorUpdateIn';
import type { EventPublicCollaboratorOut } from '../models/EventPublicCollaboratorOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventCollaboratorsService {
    /**
     * List event collaborators
     * Authenticated callers get all collaborator rows; anon
     * callers get the public-visibility subset (groups +
     * opted-in individuals), same shape as
     * GET /events/{event_id}/public-collaborators.
     * @returns EventCollaboratorOut OK
     * @throws ApiError
     */
    public static listEventCollaborators({
        eventId,
    }: {
        /**
         * Event ID
         */
        eventId: any,
    }): CancelablePromise<Array<EventCollaboratorOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/collaborators',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Add event collaborator
     * Adds a collaborator (user/group/club/role/event) to an event.
     * @returns EventCollaboratorOut Created
     * @throws ApiError
     */
    public static addEventCollaborator({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Collaborator row
         */
        requestBody: EventCollaboratorCreateIn,
    }): CancelablePromise<EventCollaboratorOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/collaborators',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                409: `Collaborator already exists`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Remove event collaborator
     * Removes a collaborator row.
     * @returns void
     * @throws ApiError
     */
    public static deleteEventCollaborator({
        eventId,
        collaboratorType,
        collaboratorId,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Collaborator type
         */
        collaboratorType: any,
        /**
         * Collaborator entity ID
         */
        collaboratorId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/collaborators/{collaborator_type}/{collaborator_id}',
            path: {
                'event_id': eventId,
                'collaborator_type': collaboratorType,
                'collaborator_id': collaboratorId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Update event collaborator
     * Patches role/details of an existing collaborator.
     * @returns EventCollaboratorOut OK
     * @throws ApiError
     */
    public static updateEventCollaborator({
        eventId,
        collaboratorType,
        collaboratorId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Collaborator type
         */
        collaboratorType: any,
        /**
         * Collaborator entity ID
         */
        collaboratorId: any,
        /**
         * Patch payload
         */
        requestBody: EventCollaboratorUpdateIn,
    }): CancelablePromise<EventCollaboratorOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/events/{event_id}/collaborators/{collaborator_type}/{collaborator_id}',
            path: {
                'event_id': eventId,
                'collaborator_type': collaboratorType,
                'collaborator_id': collaboratorId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Collaborator not found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * List publicly-visible event collaborators
     * Returns the subset of accepted collaborators the event
     * creators / moderators have allowed to surface on the
     * public event page. Default: collaborating groups
     * publish, individuals don't. Per-row override flag.
     * @returns EventPublicCollaboratorOut OK
     * @throws ApiError
     */
    public static listPublicEventCollaborators({
        eventId,
    }: {
        /**
         * Event ID (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<Array<EventPublicCollaboratorOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/public-collaborators',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Bad Request`,
                500: `Internal Server Error`,
            },
        });
    }
}
