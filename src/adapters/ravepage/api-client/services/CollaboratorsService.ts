/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventCollaboratorOut } from '../models/EventCollaboratorOut';
import type { EventCollaboratorUpdateIn } from '../models/EventCollaboratorUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CollaboratorsService {
    /**
     * Update my collaborator status
     * Accept or decline a collaboration invitation for the
     * current user. Resolves the collaborator row by
     * (event_id, type=user, id=actor). Returns 404 when the
     * caller has no invitation on this event.
     * @returns EventCollaboratorOut OK
     * @throws ApiError
     */
    public static updateMyCollaboratorStatus({
        eventId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Role/status patch
         */
        requestBody: EventCollaboratorUpdateIn,
    }): CancelablePromise<EventCollaboratorOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/events/{event_id}/collaborators/me',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or body`,
                401: `Authentication required`,
                404: `Collaborator not found for current user`,
                422: `Validation failed (role/status)`,
                501: `Collaborator update not configured`,
            },
        });
    }
}
