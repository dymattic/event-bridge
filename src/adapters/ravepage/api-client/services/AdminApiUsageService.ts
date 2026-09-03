/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiUsageLogPage } from '../models/ApiUsageLogPage';
import type { ResponseVariantOut } from '../models/ResponseVariantOut';
import type { ServiceSummary } from '../models/ServiceSummary';
import type { ServiceTotal } from '../models/ServiceTotal';
import type { TimelinePoint } from '../models/TimelinePoint';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminApiUsageService {
    /**
     * Paginated external API call log (admin)
     * Returns individual outgoing API call records. Filter by
     * service, HTTP method, success/error flag, and time
     * range. Results are ordered newest-first. Default
     * window: last 7 days.
     * @returns ApiUsageLogPage OK
     * @throws ApiError
     */
    public static listApiUsageLogs({
        service,
        method,
        success,
        fromDate,
        toDate,
        skip,
        limit,
    }: {
        /**
         * Filter by service (lowercased)
         */
        service?: any,
        /**
         * Filter by HTTP method (uppercased)
         */
        method?: any,
        /**
         * Filter true=successes / false=errors
         */
        success?: any,
        /**
         * Window start (ISO-8601 UTC)
         */
        fromDate?: any,
        /**
         * Window end (ISO-8601 UTC)
         */
        toDate?: any,
        /**
         * Pagination offset (default 0)
         */
        skip?: any,
        /**
         * Page size 1..500 (default 50)
         */
        limit?: any,
    }): CancelablePromise<ApiUsageLogPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/api-usage/logs',
            query: {
                'service': service,
                'method': method,
                'success': success,
                'from_date': fromDate,
                'to_date': toDate,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                400: `Invalid pagination or filter`,
                401: `Authentication required`,
                403: `Admin privileges required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Known external services with lifetime totals (admin)
     * Returns every distinct service name seen in the log,
     * sorted by all-time call volume. Useful to populate
     * service filter dropdowns.
     * @returns ServiceTotal OK
     * @throws ApiError
     */
    public static listApiUsageServices(): CancelablePromise<Array<ServiceTotal>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/api-usage/services',
            errors: {
                401: `Authentication required`,
                403: `Admin privileges required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Aggregated totals per external service (admin)
     * Returns request counts, success/error breakdown, and
     * average latency grouped by service. Useful for a
     * high-level cost/usage dashboard.
     * @returns ServiceSummary OK
     * @throws ApiError
     */
    public static getApiUsageSummary({
        fromDate,
        toDate,
    }: {
        /**
         * Window start (ISO-8601 UTC)
         */
        fromDate?: any,
        /**
         * Window end (ISO-8601 UTC)
         */
        toDate?: any,
    }): CancelablePromise<Array<ServiceSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/api-usage/summary',
            query: {
                'from_date': fromDate,
                'to_date': toDate,
            },
            errors: {
                400: `Invalid window`,
                401: `Authentication required`,
                403: `Admin privileges required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Daily request timeline per service (admin)
     * Returns per-day request counts broken down by service.
     * Pass `service` to narrow to a single integration.
     * @returns TimelinePoint OK
     * @throws ApiError
     */
    public static getApiUsageTimeline({
        service,
        fromDate,
        toDate,
    }: {
        /**
         * Filter by service (lowercased)
         */
        service?: any,
        /**
         * Window start (ISO-8601 UTC)
         */
        fromDate?: any,
        /**
         * Window end (ISO-8601 UTC)
         */
        toDate?: any,
    }): CancelablePromise<Array<TimelinePoint>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/api-usage/timeline',
            query: {
                'service': service,
                'from_date': fromDate,
                'to_date': toDate,
            },
            errors: {
                400: `Invalid window`,
                401: `Authentication required`,
                403: `Admin privileges required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Deduplicated response-pattern registry (admin)
     * Returns every distinct (service, method, status_code,
     * error_category) combination ever seen, with
     * occurrence counts and first/last seen. Filter by
     * service and/or error_category. Ordered by
     * last_seen_at DESC.
     * @returns ResponseVariantOut OK
     * @throws ApiError
     */
    public static listApiResponseVariants({
        service,
        errorCategory,
        success,
        skip,
        limit,
    }: {
        /**
         * Filter by service (lowercased)
         */
        service?: any,
        /**
         * Filter by error category (lowercased)
         */
        errorCategory?: any,
        /**
         * Filter true=only successes / false=only failures
         */
        success?: any,
        /**
         * Pagination offset (default 0)
         */
        skip?: any,
        /**
         * Page size 1..500 (default 100)
         */
        limit?: any,
    }): CancelablePromise<Array<ResponseVariantOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/api-usage/variants',
            query: {
                'service': service,
                'error_category': errorCategory,
                'success': success,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                400: `Invalid pagination`,
                401: `Authentication required`,
                403: `Admin privileges required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Error variant registry (admin)
     * Convenience view of /variants pre-filtered to
     * non-successful responses only (error_category !=
     * 'success'). Sorted by occurrence_count DESC so the
     * most frequent failure modes appear first.
     * @returns ResponseVariantOut OK
     * @throws ApiError
     */
    public static listApiErrorVariants({
        service,
        errorCategory,
        skip,
        limit,
    }: {
        /**
         * Filter by service (lowercased)
         */
        service?: any,
        /**
         * Filter by error category (lowercased)
         */
        errorCategory?: any,
        /**
         * Pagination offset (default 0)
         */
        skip?: any,
        /**
         * Page size 1..500 (default 100)
         */
        limit?: any,
    }): CancelablePromise<Array<ResponseVariantOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/api-usage/variants/errors',
            query: {
                'service': service,
                'error_category': errorCategory,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                400: `Invalid pagination`,
                401: `Authentication required`,
                403: `Admin privileges required`,
                500: `Internal error`,
            },
        });
    }
}
