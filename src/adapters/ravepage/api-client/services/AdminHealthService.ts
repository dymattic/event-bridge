/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemHealthOut } from '../models/SystemHealthOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminHealthService {
    /**
     * Aggregated cockpit health snapshot
     * Returns the aggregated deployment health snapshot:
     * DB ping result + per-component pills for Redis / NATS
     * / outbox / scheduler / workers / storage / external
     * APIs. Components whose backing clients are not yet
     * wired report `status="disabled"`. The `overall_status`
     * banner is derived from the per-component pills.
     * `?refresh=1` is accepted at the wire layer but a
     * no-op .
     * @returns SystemHealthOut Aggregated health snapshot
     * @throws ApiError
     */
    public static getAdminSystemHealth({
        refresh,
    }: {
        /**
         * Bypass the Redis 10s cache (no-op
         */
        refresh?: any,
    }): CancelablePromise<SystemHealthOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/health/system',
            query: {
                'refresh': refresh,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                503: `System-health aggregator not yet available (scaffold mode only)`,
            },
        });
    }
}
