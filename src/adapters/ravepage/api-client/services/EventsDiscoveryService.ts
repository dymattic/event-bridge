/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FilterOptionsResponse } from '../models/FilterOptionsResponse';
import type { LiveOverviewResponse } from '../models/LiveOverviewResponse';
import type { RelatedEventsResponse } from '../models/RelatedEventsResponse';
import type { TimelineResponse } from '../models/TimelineResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventsDiscoveryService {
    /**
     * Event filter options
     * Returns available filter values: genres + subgenres (tracks-worker taxonomy; empty on adapter failure), platforms, age/restriction/accessibility flags, languages, top hosts.
     * @returns FilterOptionsResponse OK
     * @throws ApiError
     */
    public static getFilterOptions(): CancelablePromise<FilterOptionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/filter-options',
        });
    }
    /**
     * Live events overview
     * Snapshot of currently-live events. Anonymous-OK.
     * @returns LiveOverviewResponse OK
     * @throws ApiError
     */
    public static getLiveOverview(): CancelablePromise<LiveOverviewResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/live-overview',
        });
    }
    /**
     * Discover events timeline
     * Sectioned timeline (now / soon / later). Anonymous-OK.
     * @returns TimelineResponse OK
     * @throws ApiError
     */
    public static getEventsTimeline({
        from,
        to,
        status,
        genres,
        platforms,
        ageGate,
        search,
        includePast,
        sort,
        limit,
    }: {
        /**
         * ISO-8601 lower bound
         */
        from?: any,
        /**
         * ISO-8601 upper bound
         */
        to?: any,
        /**
         * Status filter (repeat or CSV); 'live'/'ended' are time-derived, other values match stored status
         */
        status?: any,
        /**
         * Genre slugs (repeat or CSV). tags); the same source EventSummary.genres is projected from, so filter and display agree. Unknown slugs yield an empty timeline.
         */
        genres?: any,
        /**
         * Platform filter (repeat or CSV)
         */
        platforms?: any,
        /**
         * Age-gate filter
         */
        ageGate?: any,
        /**
         * Case-insensitive substring search on title/description
         */
        search?: any,
        /**
         * Include past events
         */
        includePast?: any,
        /**
         * Sort order
         */
        sort?: any,
        /**
         * Page size (1..500)
         */
        limit?: any,
    }): CancelablePromise<TimelineResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/timeline',
            query: {
                'from': from,
                'to': to,
                'status': status,
                'genres': genres,
                'platforms': platforms,
                'age_gate': ageGate,
                'search': search,
                'include_past': includePast,
                'sort': sort,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
                422: `Unknown sort value`,
            },
        });
    }
    /**
     * Related events
     * Returns a small set of events related to the given event.
     * @returns RelatedEventsResponse OK
     * @throws ApiError
     */
    public static getRelatedEvents({
        eventId,
    }: {
        /**
         * Event ID
         */
        eventId: any,
    }): CancelablePromise<RelatedEventsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/related',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Bad Request`,
                404: `Event not found`,
            },
        });
    }
}
