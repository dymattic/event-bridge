/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminIncidentCreateIn } from '../models/AdminIncidentCreateIn';
import type { AdminIncidentDetailOut } from '../models/AdminIncidentDetailOut';
import type { AdminIncidentListOut } from '../models/AdminIncidentListOut';
import type { AdminIncidentPatchIn } from '../models/AdminIncidentPatchIn';
import type { AdminIncidentUpdateIn } from '../models/AdminIncidentUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminIncidentsService {
    /**
     * List status-page incidents
     * Admin-only. Returns incidents newest-started first. Filterable by lifecycle status via `?status=investigating|identified|monitoring|resolved`. Offset-paginated via `?limit=` (1..200, default 50) and `?offset=` (default 0).
     * @returns AdminIncidentListOut OK
     * @throws ApiError
     */
    public static listAdminIncidents({
        status,
        limit,
        offset,
    }: {
        /**
         * Filter to one lifecycle state
         */
        status?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Pagination offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<AdminIncidentListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/incidents',
            query: {
                'status': status,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Incidents unavailable`,
            },
        });
    }
    /**
     * Open a new status-page incident
     * Admin-only. Creates an incident row and seeds the first IncidentUpdate timeline entry so the public statuspage has narrative immediately. Returns the full detail shape including the seed update.
     * @returns AdminIncidentDetailOut Created
     * @throws ApiError
     */
    public static createAdminIncident({
        requestBody,
    }: {
        /**
         * Incident details
         */
        requestBody: AdminIncidentCreateIn,
    }): CancelablePromise<AdminIncidentDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/incidents',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Incidents unavailable`,
            },
        });
    }
    /**
     * Get one incident + full update timeline
     * Admin-only. Returns the full detail shape, including the entire IncidentUpdate timeline (newest first).
     * @returns AdminIncidentDetailOut OK
     * @throws ApiError
     */
    public static getAdminIncident({
        incidentId,
    }: {
        /**
         * Incident id (`inc_<uuid>` or bare uuid)
         */
        incidentId: any,
    }): CancelablePromise<AdminIncidentDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/incidents/{incident_id}',
            path: {
                'incident_id': incidentId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Incident not found`,
                500: `Incidents unavailable`,
            },
        });
    }
    /**
     * Edit incident metadata (no timeline entry)
     * Admin-only. Partial update - all body fields optional. Use this for typo fixes, impact-level changes, or affected_services edits. To transition status with a public-facing narrative entry, use `POST .../updates` instead.
     * @returns AdminIncidentDetailOut OK
     * @throws ApiError
     */
    public static patchAdminIncident({
        incidentId,
        requestBody,
    }: {
        /**
         * Incident id
         */
        incidentId: any,
        /**
         * Partial update
         */
        requestBody: AdminIncidentPatchIn,
    }): CancelablePromise<AdminIncidentDetailOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/incidents/{incident_id}',
            path: {
                'incident_id': incidentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Incident not found`,
                422: `Validation failed`,
                500: `Incidents unavailable`,
            },
        });
    }
    /**
     * Post a timeline update + transition status
     * Admin-only. Appends a timeline entry AND transitions the parent incident's status. `resolved_at` is auto-managed - set when status transitions TO resolved, cleared otherwise.
     * @returns AdminIncidentDetailOut Created
     * @throws ApiError
     */
    public static postAdminIncidentUpdate({
        incidentId,
        requestBody,
    }: {
        /**
         * Incident id
         */
        incidentId: any,
        /**
         * Timeline entry
         */
        requestBody: AdminIncidentUpdateIn,
    }): CancelablePromise<AdminIncidentDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/incidents/{incident_id}/updates',
            path: {
                'incident_id': incidentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Incident not found`,
                422: `Validation failed`,
                500: `Incidents unavailable`,
            },
        });
    }
}
