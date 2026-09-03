/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UsageProfileOut } from '../models/UsageProfileOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsageProfileService {
    /**
     * My usage profile (rolled-up flow scores + suggestions)
     * Returns the authenticated user's rolled-up usage
     * profile - per-flow scores plus a pre-sorted top-N
     * suggestion list the FE renders directly. .., True) fallback).
     * @returns UsageProfileOut OK
     * @throws ApiError
     */
    public static getMyUsageProfile(): CancelablePromise<UsageProfileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/me/usage-profile',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Recompute my usage profile now
     * Returns the authenticated user's rolled-up usage
     * profile. When the
     * audit DB pool is unwired (dev startup) the endpoint
     * returns 503 RECOMPUTE_UNAVAILABLE.
     * @returns UsageProfileOut OK
     * @throws ApiError
     */
    public static recomputeMyUsageProfile(): CancelablePromise<UsageProfileOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/me/usage-profile/recompute',
            errors: {
                400: `Invalid user id in claim`,
                401: `Authentication required`,
                500: `Internal error`,
                503: `Recompute unavailable (dev startup)`,
            },
        });
    }
}
