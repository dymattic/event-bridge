/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthzOut } from '../models/HealthzOut';
import type { RootOut } from '../models/RootOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * Root endpoint
     * Returns a welcome message from the API. Used by uptime
     * probes and as a sanity check that the gateway is
     * reachable. No auth required.
     * @returns RootOut OK
     * @throws ApiError
     */
    public static getRoot(): CancelablePromise<RootOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * AI-friendly API reference document
     * Returns the complete Rave.Page API reference as
     * structured JSON. Designed for consumption by AI agents
     * and development tools. Includes data model
     * relationships, endpoint inventory, authorization
     * rules, and common pitfalls. Anonymous-public.
     * @returns any Structured API reference
     * @throws ApiError
     */
    public static getDeveloperReference(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/developer-reference',
        });
    }
    /**
     * Service health check
     * Returns `{"status": "ok"}` when the gateway worker
     * is up. No upstream dependencies are checked - this
     * is a liveness probe, not a readiness probe. Use
     * `GET /status` for the cross-mesh readiness picture.
     * @returns HealthzOut OK
     * @throws ApiError
     */
    public static getHealthz(): CancelablePromise<HealthzOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/healthz',
        });
    }
}
