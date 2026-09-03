/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientAppCreatedOut } from '../models/ClientAppCreatedOut';
import type { ClientAppCreateIn } from '../models/ClientAppCreateIn';
import type { ClientAppOut } from '../models/ClientAppOut';
import type { ClientAppUpdateIn } from '../models/ClientAppUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminClientsService {
    /**
     * List client-app credentials
     * Admin-only. Secrets are NEVER returned by list.
     * @returns ClientAppOut OK
     * @throws ApiError
     */
    public static listClientApps(): CancelablePromise<Array<ClientAppOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/clients',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Create a new client-app credential
     * Admin-only. The response body carries the plaintext
     * client_secret ONCE - never returned again. Store it.
     * @returns ClientAppCreatedOut Created
     * @throws ApiError
     */
    public static createClientApp({
        requestBody,
    }: {
        /**
         * Client app name + scopes
         */
        requestBody: ClientAppCreateIn,
    }): CancelablePromise<ClientAppCreatedOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/clients',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Delete a client-app credential
     * Admin-only. Hard-delete; existing tokens minted for this
     * client become unverifiable.
     * @returns void
     * @throws ApiError
     */
    public static deleteAdminClient({
        id,
    }: {
        /**
         * Client app id
         */
        id: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/clients/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Client app not found`,
            },
        });
    }
    /**
     * Get a single client-app credential
     * Admin-only. Secrets are NEVER returned by get.
     * @returns ClientAppOut OK
     * @throws ApiError
     */
    public static getAdminClient({
        id,
    }: {
        /**
         * Client app id (UUID)
         */
        id: any,
    }): CancelablePromise<ClientAppOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/clients/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Invalid id`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Client app not found`,
            },
        });
    }
    /**
     * Update a client-app credential
     * Admin-only. PATCH-style - omit fields to leave unchanged.
     * @returns ClientAppOut OK
     * @throws ApiError
     */
    public static updateAdminClient({
        id,
        requestBody,
    }: {
        /**
         * Client app id
         */
        id: any,
        /**
         * Patch
         */
        requestBody: ClientAppUpdateIn,
    }): CancelablePromise<ClientAppOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/clients/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Client app not found`,
            },
        });
    }
    /**
     * Rotate a client-app's secret
     * Admin-only. Returns the new plaintext secret ONCE.
     * @returns ClientAppCreatedOut OK
     * @throws ApiError
     */
    public static rotateClientAppSecret({
        id,
    }: {
        /**
         * Client app id
         */
        id: any,
    }): CancelablePromise<ClientAppCreatedOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/clients/{id}/rotate-secret',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Client app not found`,
            },
        });
    }
}
