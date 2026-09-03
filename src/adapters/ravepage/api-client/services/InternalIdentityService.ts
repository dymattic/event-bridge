/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VerifyClientAppRequest } from '../models/VerifyClientAppRequest';
import type { VerifyClientAppResponse } from '../models/VerifyClientAppResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InternalIdentityService {
    /**
     * Verify client-app credentials (internal contract)
     * Internal-mesh cross-worker contract. Audit calls this
     * to verify the (X-Client-ID, X-Client-Secret) pair on
     * inbound POST /metrics/record requests. Identity owns
     * client_apps; audit MUST NOT read the table directly.
     * Failure shape is indistinguishable across all causes
     * (missing id / unknown id / inactive row / wrong
     * secret) - single 401 + generic detail.
     * @returns VerifyClientAppResponse OK
     * @throws ApiError
     */
    public static verifyClientAppCredentials({
        requestBody,
    }: {
        /**
         * Client credentials
         */
        requestBody: VerifyClientAppRequest,
    }): CancelablePromise<VerifyClientAppResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/internal/identity/client-apps/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Invalid or missing client credentials`,
                500: `Internal error`,
            },
        });
    }
}
