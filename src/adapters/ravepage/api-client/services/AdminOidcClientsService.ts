/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OIDCClientOut } from '../models/OIDCClientOut';
import type { OIDCClientRegisteredOut } from '../models/OIDCClientRegisteredOut';
import type { RegisterOIDCClientIn } from '../models/RegisterOIDCClientIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminOidcClientsService {
    /**
     * List registered OIDC clients
     * Admin-only. Secrets are NEVER returned.
     * @returns OIDCClientOut OK
     * @throws ApiError
     */
    public static listOidcClients(): CancelablePromise<Array<OIDCClientOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/oidc/clients',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                502: `Bad Gateway`,
            },
        });
    }
    /**
     * Register a new OIDC client
     * Admin-only. Creates a brand-new OIDC client in Zitadel at
     * runtime with the supplied redirect URIs - no redeploy. The
     * response carries the client_id (and, for confidential
     * clients, the plaintext client_secret ONCE - store it).
     * @returns OIDCClientRegisteredOut Created
     * @throws ApiError
     */
    public static registerOidcClient({
        requestBody,
    }: {
        /**
         * Client name + redirect URIs
         */
        requestBody: RegisterOIDCClientIn,
    }): CancelablePromise<OIDCClientRegisteredOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/oidc/clients',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                502: `Bad Gateway`,
            },
        });
    }
    /**
     * Delete a registered OIDC client
     * Admin-only. Removes the client from Zitadel; its tokens
     * stop validating.
     * @returns void
     * @throws ApiError
     */
    public static deleteOidcClient({
        appId,
    }: {
        /**
         * Zitadel application id
         */
        appId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/oidc/clients/{app_id}',
            path: {
                'app_id': appId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `Unprocessable Entity`,
                502: `Bad Gateway`,
            },
        });
    }
}
