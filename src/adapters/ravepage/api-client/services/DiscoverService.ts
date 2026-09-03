/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiscoverFeedbackIn } from '../models/DiscoverFeedbackIn';
import type { DiscoverFeedbackOut } from '../models/DiscoverFeedbackOut';
import type { DiscoverFeedOut } from '../models/DiscoverFeedOut';
import type { TasteProfileOut } from '../models/TasteProfileOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DiscoverService {
    /**
     * Event suggestions
     * Returns events tailored to the user's taste profile
     * and social graph. Equivalent to /discover/feed with
     * entity_type=event hard-coded.
     * @returns DiscoverFeedOut OK
     * @throws ApiError
     */
    public static getEventSuggestions({
        limit,
        cursor,
    }: {
        /**
         * Page size (1..100, default 20)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<DiscoverFeedOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discover/events',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Auth missing or invalid`,
                422: `Invalid query param`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Personalised discovery feed
     * Returns a mixed feed of events, profiles, groups, and
     * releases ranked by the user's taste profile and
     * engagement signals. Cold-start (no candidates yet)
     * falls through to the trending surface.
     * @returns DiscoverFeedOut OK
     * @throws ApiError
     */
    public static getDiscoverFeed({
        entityType,
        limit,
        cursor,
    }: {
        /**
         * Filter by entity type
         */
        entityType?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<DiscoverFeedOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discover/feed',
            query: {
                'entity_type': entityType,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Auth missing or invalid`,
                422: `Invalid query param`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Submit recommendation feedback
     * Dismiss or mark a recommendation as not interested.
     * Dismissed items are excluded from future feeds.
     * Idempotent on (user_id, entity_type, entity_id): a
     * duplicate POST succeeds with `recorded=true`.
     * @returns DiscoverFeedbackOut OK
     * @throws ApiError
     */
    public static submitDiscoverFeedback({
        requestBody,
    }: {
        /**
         * Feedback payload
         */
        requestBody: DiscoverFeedbackIn,
    }): CancelablePromise<DiscoverFeedbackOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/discover/feedback',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Auth missing or invalid`,
                422: `Validation failed (bad feedback_type, entity_type, or entity_id)`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Follow suggestions
     * Returns users and performers the current user might
     * want to follow. Equivalent to /discover/feed with
     * entity_type=user hard-coded.
     * @returns DiscoverFeedOut OK
     * @throws ApiError
     */
    public static getPeopleSuggestions({
        limit,
        cursor,
    }: {
        /**
         * Page size (1..100, default 20)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<DiscoverFeedOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discover/people',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Auth missing or invalid`,
                422: `Invalid query param`,
                500: `Internal error`,
            },
        });
    }
    /**
     * View own taste profile
     * Returns the user's computed genre/mood preference
     * vectors and signal count. When no profile has been
     * built yet, returns signal_count=0 with all other
     * fields null .
     * @returns TasteProfileOut OK
     * @throws ApiError
     */
    public static getTasteProfile(): CancelablePromise<TasteProfileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discover/taste-profile',
            errors: {
                401: `Auth missing or invalid`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Trending entities (anonymous-public)
     * Returns globally trending entities by recent activity
     * volume. Anonymous-public - no bearer required.
     * @returns DiscoverFeedOut OK
     * @throws ApiError
     */
    public static getTrending({
        entityType,
        limit,
        cursor,
    }: {
        /**
         * Filter by entity type
         */
        entityType?: any,
        /**
         * Page size (1..100, default 20)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<DiscoverFeedOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/discover/trending',
            query: {
                'entity_type': entityType,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                422: `Invalid query param`,
                500: `Internal error`,
            },
        });
    }
}
