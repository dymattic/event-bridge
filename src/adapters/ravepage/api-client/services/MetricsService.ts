/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventAttendanceSummary } from '../models/EventAttendanceSummary';
import type { MetricEventOut } from '../models/MetricEventOut';
import type { metricRecordIn } from '../models/metricRecordIn';
import type { MetricSummaryOut } from '../models/MetricSummaryOut';
import type { MetricTimeSeriesOut } from '../models/MetricTimeSeriesOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MetricsService {
    /**
     * Privileged attendance metrics for an event
     * Returns the detailed attendance breakdown for an
     * event. Restricted to admin OR the event's user-
     * organizer OR any caller with an `event_users` row on
     * the event (creator/owner/editor link). Other callers
     * receive 403. Counts are derived from audit's
     * `metric_aggregates`; v1 partial - vrchat presence
     * (unique attendees + average duration) and events
     * peak-concurrent require sibling contracts that
     * haven't ported yet (returned as zero / null with a
     * stable wire shape). When the audit DB pool or the
     * events mesh is unwired (dev startup), returns 503
     * ATTENDANCE_UNAVAILABLE.
     * @returns EventAttendanceSummary OK
     * @throws ApiError
     */
    public static getEventAttendanceMetrics({
        eventId,
    }: {
        /**
         * Event ID (bare UUID or `evt_<uuid>`)
         */
        eventId: any,
    }): CancelablePromise<EventAttendanceSummary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metrics/event/{event_id}/attendance',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid user id in claim`,
                401: `Authentication required`,
                403: `Restricted to organizer / event admin`,
                404: `Event not found`,
                422: `Invalid event_id`,
                500: `Internal error`,
                503: `Attendance metrics dev-unwired`,
            },
        });
    }
    /**
     * Record a verified metric event
     * Submit a verified metric event (e.g. confirmed media
     * play, profile visit). Authentication is client-app
     * credentials via X-Client-ID + X-Client-Secret
     * headers (registered via /admin/clients); the gateway
     * does NOT verify a user JWT for this endpoint. Idempotent on (client_id,
     * idempotency_key): the same key replayed returns the
     * existing row with 200 instead of duplicating.
     * @returns MetricEventOut Idempotency hit - returns existing row
     * @throws ApiError
     */
    public static recordMetric({
        xClientId,
        xClientSecret,
        requestBody,
    }: {
        /**
         * Registered client public id
         */
        xClientId: any,
        /**
         * Registered client secret
         */
        xClientSecret: any,
        /**
         * Metric event payload
         */
        requestBody: metricRecordIn,
    }): CancelablePromise<MetricEventOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/metrics/record',
            headers: {
                'X-Client-ID': xClientId,
                'X-Client-Secret': xClientSecret,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Invalid or missing client credentials`,
                422: `Invalid entity_type / metric_type / field`,
                503: `Metric recording temporarily unavailable`,
            },
        });
    }
    /**
     * Aggregate metric counts for an entity (public)
     * Returns aggregated metric counts for the given entity.
     * Anonymous-public - no authentication required. Counts
     * are maintained by the background aggregation task and
     * may lag by a few minutes in high-volume deployments.
     * @returns MetricSummaryOut OK
     * @throws ApiError
     */
    public static getMetricSummary({
        entityType,
        entityId,
    }: {
        /**
         * Entity type (e.g. event, profile, performer)
         */
        entityType: any,
        /**
         * Entity UUID (bare or prefixed e.g. evt_<uuid>)
         */
        entityId: any,
    }): CancelablePromise<MetricSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metrics/{entity_type}/{entity_id}/summary',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            errors: {
                400: `Invalid entity_id`,
                422: `Invalid entity_type`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Time-bucketed metric counts for an entity (public)
     * Returns time-bucketed counts of a specific metric type
     * for the given entity. Useful for engagement charts.
     * Anonymous-public - no authentication required.
     * @returns MetricTimeSeriesOut OK
     * @throws ApiError
     */
    public static getMetricTimeseries({
        entityType,
        entityId,
        metricType,
        granularity,
        limit,
    }: {
        /**
         * Entity type
         */
        entityType: any,
        /**
         * Entity UUID (bare or prefixed)
         */
        entityId: any,
        /**
         * Metric type (e.g. profile_view)
         */
        metricType: any,
        /**
         * Bucket size: hour|day|week|month (default day)
         */
        granularity?: any,
        /**
         * Max data points (1-365, default 30)
         */
        limit?: any,
    }): CancelablePromise<MetricTimeSeriesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metrics/{entity_type}/{entity_id}/timeseries',
            path: {
                'entity_type': entityType,
                'entity_id': entityId,
            },
            query: {
                'metric_type': metricType,
                'granularity': granularity,
                'limit': limit,
            },
            errors: {
                400: `Invalid entity_id / granularity / limit`,
                422: `Invalid entity_type / missing metric_type`,
                500: `Internal error`,
            },
        });
    }
}
