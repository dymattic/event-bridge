/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSyncFilterIn } from '../models/CreateSyncFilterIn';
import type { CreateSyncRuleIn } from '../models/CreateSyncRuleIn';
import type { GoogleCalendarListOut } from '../models/GoogleCalendarListOut';
import type { GoogleCalendarSyncOut } from '../models/GoogleCalendarSyncOut';
import type { GoogleCalendarSyncPullIn } from '../models/GoogleCalendarSyncPullIn';
import type { GoogleCalendarSyncPushIn } from '../models/GoogleCalendarSyncPushIn';
import type { SyncFilterListOut } from '../models/SyncFilterListOut';
import type { SyncFilterOut } from '../models/SyncFilterOut';
import type { SyncRuleListOut } from '../models/SyncRuleListOut';
import type { SyncRuleOut } from '../models/SyncRuleOut';
import type { SyncRuleRunOut } from '../models/SyncRuleRunOut';
import type { UpdateSyncRuleIn } from '../models/UpdateSyncRuleIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GoogleCalendarService {
    /**
     * List Google Calendar calendars
     * Returns the authenticated user's Google Calendar list.
     * Calls identity for a fresh OAuth access token + proxies
     * the upstream Google API call. When the contract clients are not wired,
     * returns an empty list envelope.
     * @returns GoogleCalendarListOut Calendar list (may be empty when scaffold mode or no link)
     * @throws ApiError
     */
    public static listGoogleCalendars(): CancelablePromise<GoogleCalendarListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/google-calendar/calendars',
            errors: {
                400: `Google Calendar account is not linked / Invalid user id`,
                401: `Authentication required`,
                502: `Google upstream error`,
                503: `Outbound rate limit reached (per-user 480/min or project-wide 800k/day) - Retry-After header set`,
            },
        });
    }
    /**
     * List Google Calendar sync rules
     * @returns SyncRuleListOut OK
     * @throws ApiError
     */
    public static listGoogleCalendarSyncRules(): CancelablePromise<SyncRuleListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/google-calendar/sync-rules',
            errors: {
                401: `Authentication required`,
            },
        });
    }
    /**
     * Create a Google Calendar sync rule
     * Maps a native platform calendar to a Google sub-calendar
     * with a sync direction (pull / push / bidirectional). The
     * local calendar must be owned by the caller.
     * @returns SyncRuleOut Created
     * @throws ApiError
     */
    public static createGoogleCalendarSyncRule({
        requestBody,
    }: {
        /**
         * Rule
         */
        requestBody: CreateSyncRuleIn,
    }): CancelablePromise<SyncRuleOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/google-calendar/sync-rules',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body / calendar_id`,
                401: `Authentication required`,
                404: `Local calendar not found`,
                409: `Rule already exists`,
                422: `Invalid sync_direction / missing fields`,
            },
        });
    }
    /**
     * Delete a Google Calendar sync rule
     * @returns void
     * @throws ApiError
     */
    public static deleteGoogleCalendarSyncRule({
        ruleId,
    }: {
        /**
         * Rule ID
         */
        ruleId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/google-calendar/sync-rules/{rule_id}',
            path: {
                'rule_id': ruleId,
            },
            errors: {
                401: `Authentication required`,
                404: `Rule not found`,
            },
        });
    }
    /**
     * Get a Google Calendar sync rule
     * @returns SyncRuleOut OK
     * @throws ApiError
     */
    public static getGoogleCalendarSyncRule({
        ruleId,
    }: {
        /**
         * Rule ID
         */
        ruleId: any,
    }): CancelablePromise<SyncRuleOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/google-calendar/sync-rules/{rule_id}',
            path: {
                'rule_id': ruleId,
            },
            errors: {
                401: `Authentication required`,
                404: `Rule not found`,
            },
        });
    }
    /**
     * Update a Google Calendar sync rule
     * @returns SyncRuleOut OK
     * @throws ApiError
     */
    public static updateGoogleCalendarSyncRule({
        ruleId,
        requestBody,
    }: {
        /**
         * Rule ID
         */
        ruleId: any,
        /**
         * Fields to update
         */
        requestBody: UpdateSyncRuleIn,
    }): CancelablePromise<SyncRuleOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/google-calendar/sync-rules/{rule_id}',
            path: {
                'rule_id': ruleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Authentication required`,
                404: `Rule not found`,
                409: `Conflicting rule`,
                422: `Invalid sync_direction`,
            },
        });
    }
    /**
     * List a sync rule's filters
     * @returns SyncFilterListOut OK
     * @throws ApiError
     */
    public static listGoogleCalendarSyncFilters({
        ruleId,
    }: {
        /**
         * Rule ID
         */
        ruleId: any,
    }): CancelablePromise<SyncFilterListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/google-calendar/sync-rules/{rule_id}/filters',
            path: {
                'rule_id': ruleId,
            },
            errors: {
                401: `Authentication required`,
                404: `Rule not found`,
            },
        });
    }
    /**
     * Add a filter to a Google Calendar sync rule
     * Filters gate which appointments/events the rule syncs.
     * INCLUDE filters are OR'd (item must match ≥1 when any
     * exist); EXCLUDE filters reject on any match.
     * @returns SyncFilterOut Created
     * @throws ApiError
     */
    public static addGoogleCalendarSyncFilter({
        ruleId,
        requestBody,
    }: {
        /**
         * Rule ID
         */
        ruleId: any,
        /**
         * Filter
         */
        requestBody: CreateSyncFilterIn,
    }): CancelablePromise<SyncFilterOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/google-calendar/sync-rules/{rule_id}/filters',
            path: {
                'rule_id': ruleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed body`,
                401: `Authentication required`,
                404: `Rule not found`,
                409: `Duplicate filter`,
                422: `Invalid filter_type / match_field / empty value`,
            },
        });
    }
    /**
     * Delete a sync-rule filter
     * @returns void
     * @throws ApiError
     */
    public static deleteGoogleCalendarSyncFilter({
        ruleId,
        filterId,
    }: {
        /**
         * Rule ID
         */
        ruleId: any,
        /**
         * Filter ID
         */
        filterId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/google-calendar/sync-rules/{rule_id}/filters/{filter_id}',
            path: {
                'rule_id': ruleId,
                'filter_id': filterId,
            },
            errors: {
                401: `Authentication required`,
                404: `Rule or filter not found`,
            },
        });
    }
    /**
     * Run a Google Calendar sync rule now
     * Executes the rule's direction(s) immediately and returns
     * per-direction counters. Requires a linked Google account.
     * @returns SyncRuleRunOut OK
     * @throws ApiError
     */
    public static runGoogleCalendarSyncRule({
        ruleId,
    }: {
        /**
         * Rule ID
         */
        ruleId: any,
    }): CancelablePromise<SyncRuleRunOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/google-calendar/sync-rules/{rule_id}/sync',
            path: {
                'rule_id': ruleId,
            },
            errors: {
                400: `Google account not linked`,
                401: `Authentication required`,
                404: `Rule not found`,
                502: `Google upstream error`,
                503: `Sync engine unavailable / rate limited`,
            },
        });
    }
    /**
     * Pull events from Google Calendar
     * Imports events from the given Google sub-calendar into the
     * local platform calendar as appointments. Idempotent on the
     * (provider, external_id, external_calendar_id) triple:
     * re-running updates existing rows rather than duplicating.
     * Cancelled Google events tombstone the local copy (or are
     * skipped unless include_cancelled). Returns create/update/
     * delete/skip counters. Requires a linked Google Calendar
     * OAuth account (400 if not linked).
     * @returns GoogleCalendarSyncOut Sync result counters
     * @throws ApiError
     */
    public static syncPullGoogleCalendar({
        requestBody,
    }: {
        /**
         * Sync request body
         */
        requestBody: GoogleCalendarSyncPullIn,
    }): CancelablePromise<GoogleCalendarSyncOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/google-calendar/sync/pull',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed JSON / not linked / invalid claim`,
                401: `Authentication required`,
                422: `Invalid calendar_id / missing required fields`,
                502: `Google upstream error`,
            },
        });
    }
    /**
     * Push events to Google Calendar
     * Exports the local calendar's appointments to the given
     * Google sub-calendar - creating new Google events (stamped
     * with a raveAppointmentId idempotency key), updating
     * previously-linked ones, and deleting the Google copy of a
     * cancelled appointment. Returns create/update/delete/skip
     * counters. Requires a linked Google Calendar OAuth account.
     * @returns GoogleCalendarSyncOut Sync result counters
     * @throws ApiError
     */
    public static syncPushGoogleCalendar({
        requestBody,
    }: {
        /**
         * Sync request body
         */
        requestBody: GoogleCalendarSyncPushIn,
    }): CancelablePromise<GoogleCalendarSyncOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/google-calendar/sync/push',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Malformed JSON / not linked / invalid claim`,
                401: `Authentication required`,
                422: `Invalid calendar_id / missing required fields`,
                502: `Google upstream error`,
            },
        });
    }
}
