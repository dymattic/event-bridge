/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventInvitationListOut } from '../models/EventInvitationListOut';
import type { EventInvitationOut } from '../models/EventInvitationOut';
import type { EventInvitationSendIn } from '../models/EventInvitationSendIn';
import type { EventInvitationSendResultOut } from '../models/EventInvitationSendResultOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventInvitationsService {
    /**
     * List my event invitations
     * Returns invitations addressed to the authenticated user. Default filter is pending.
     * @returns EventInvitationListOut OK
     * @throws ApiError
     */
    public static listMyEventInvitations({
        status,
    }: {
        /**
         * Filter (empty = all)
         */
        status?: any,
    }): CancelablePromise<EventInvitationListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event-invitations/me',
            query: {
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Revoke event invitation
     * Organizer revokes a pending invitation. Idempotent on already-revoked/declined.
     * @returns void
     * @throws ApiError
     */
    public static revokeEventInvitation({
        invitationId,
    }: {
        /**
         * Invitation ID
         */
        invitationId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/event-invitations/{invitation_id}',
            path: {
                'invitation_id': invitationId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Not the organizer`,
                404: `Invitation not found`,
            },
        });
    }
    /**
     * Accept event invitation
     * Caller must be the invitee. Transitions invitation to accepted and creates RSVP.
     * @returns EventInvitationOut OK
     * @throws ApiError
     */
    public static acceptEventInvitation({
        invitationId,
    }: {
        /**
         * Invitation ID
         */
        invitationId: any,
    }): CancelablePromise<EventInvitationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event-invitations/{invitation_id}/accept',
            path: {
                'invitation_id': invitationId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Not the invitee`,
                404: `Invitation not found`,
                409: `Already acted on`,
            },
        });
    }
    /**
     * Decline event invitation
     * Caller must be the invitee. Transitions invitation to declined.
     * @returns EventInvitationOut OK
     * @throws ApiError
     */
    public static declineEventInvitation({
        invitationId,
    }: {
        /**
         * Invitation ID
         */
        invitationId: any,
    }): CancelablePromise<EventInvitationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event-invitations/{invitation_id}/decline',
            path: {
                'invitation_id': invitationId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Not the invitee`,
                404: `Invitation not found`,
                409: `Already acted on`,
            },
        });
    }
    /**
     * List event invitations
     * Organizer-only view of invitations sent for an event.
     * @returns EventInvitationListOut OK
     * @throws ApiError
     */
    public static listEventInvitations({
        eventId,
        status,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Filter by status
         */
        status?: any,
    }): CancelablePromise<EventInvitationListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/invitations',
            path: {
                'event_id': eventId,
            },
            query: {
                'status': status,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Event not found`,
            },
        });
    }
    /**
     * Send event invitations
     * Organizer invites users; only accepted friends of the organizer can be invited.
     * @returns EventInvitationSendResultOut Created
     * @throws ApiError
     */
    public static sendEventInvitations({
        eventId,
        requestBody,
    }: {
        /**
         * Event ID
         */
        eventId: any,
        /**
         * Invitation request
         */
        requestBody: EventInvitationSendIn,
    }): CancelablePromise<EventInvitationSendResultOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/invitations',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Not the organizer`,
                404: `Event not found`,
                422: `Unprocessable Entity`,
                503: `Friendship contract unconfigured`,
            },
        });
    }
}
