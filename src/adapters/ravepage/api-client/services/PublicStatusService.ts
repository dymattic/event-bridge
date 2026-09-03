/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicStatusOut } from '../models/PublicStatusOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicStatusService {
    /**
     * Public statuspage snapshot
     * Anonymous-public statuspage shell. Returns the overall status, per-service breakdown (auth/events/media/discovery/social/realtime), open incidents, and active maintenance windows. Always returns 200 - consult the body, not the HTTP code.
     * @returns PublicStatusOut OK
     * @throws ApiError
     */
    public static getPublicStatus(): CancelablePromise<PublicStatusOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/status',
        });
    }
}
