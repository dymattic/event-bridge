/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventBanCreateIn } from '../models/EventBanCreateIn';
import type { EventBanOut } from '../models/EventBanOut';
import type { EventReportCreateIn } from '../models/EventReportCreateIn';
import type { EventReportOut } from '../models/EventReportOut';
import type { EventReportResolveIn } from '../models/EventReportResolveIn';
import type { EventRuleCreateIn } from '../models/EventRuleCreateIn';
import type { EventRuleOut } from '../models/EventRuleOut';
import type { EventRuleUpdateIn } from '../models/EventRuleUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventModerationService {
    /**
     * List event bans
     * Returns active (non-expired or permanent) bans for
     * the event ordered by created_at DESC. Authz is event
     * organizer or admin.
     * @returns EventBanOut OK
     * @throws ApiError
     */
    public static listEventBans({
        eventId,
        limit,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Max results (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<EventBanOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/bans',
            path: {
                'event_id': eventId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                403: `Insufficient permissions for this event`,
                404: `Event not found`,
                422: `Invalid limit`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * Ban a user from an event
     * Creates a ban preventing a user from attending or
     * interacting with the event. Authz is event organizer
     * or admin.
     * @returns EventBanOut Created
     * @throws ApiError
     */
    public static createEventBan({
        eventId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Ban fields
         */
        requestBody: EventBanCreateIn,
    }): CancelablePromise<EventBanOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/bans',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or body`,
                401: `Authentication required`,
                403: `Insufficient permissions for this event`,
                404: `Event not found`,
                422: `Validation failed`,
                501: `Event moderation writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * Lift a ban
     * Removes a ban. Returns 404 when the ban does not
     * exist .
     * @returns void
     * @throws ApiError
     */
    public static deleteEventBan({
        eventId,
        banId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Ban id (UUID or ebn_<uuid>)
         */
        banId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/bans/{ban_id}',
            path: {
                'event_id': eventId,
                'ban_id': banId,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                403: `Insufficient permissions for this event`,
                404: `Event or ban not found`,
                422: `Wrong ban_id prefix`,
                501: `Event moderation writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * List event reports
     * Returns moderation reports for the event, ordered by
     * created_at DESC. Optional `?status=...` filter.
     * Authorized as event organizer (direct user, group
     * organizer, accepted owner/organizer collaborator, or
     * platform admin).
     * @returns EventReportOut OK
     * @throws ApiError
     */
    public static listEventReports({
        eventId,
        status,
        limit,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Filter by status (pending|reviewing|resolved|dismissed)
         */
        status?: any,
        /**
         * Max results (1..200, default 50)
         */
        limit?: any,
    }): CancelablePromise<Array<EventReportOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/reports',
            path: {
                'event_id': eventId,
            },
            query: {
                'status': status,
                'limit': limit,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                403: `Insufficient permissions for this event`,
                404: `Event not found`,
                422: `Invalid limit`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * Report an event or attendee
     * Submit a moderation report. Any authenticated user
     * may file a report. The optional reported_user_id
     * identifies the user being reported; absent means
     * the report is against the event itself.
     * @returns EventReportOut Created
     * @throws ApiError
     */
    public static createEventReport({
        eventId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Report fields
         */
        requestBody: EventReportCreateIn,
    }): CancelablePromise<EventReportOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/reports',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or body`,
                401: `Authentication required`,
                404: `Event not found`,
                422: `Validation failed`,
                501: `Event moderation writes not configured`,
            },
        });
    }
    /**
     * Resolve or dismiss a report
     * Update the report status to a terminal state
     * (resolved | dismissed) and stamp the resolver. Authz
     * is event organizer or admin.
     * @returns EventReportOut OK
     * @throws ApiError
     */
    public static resolveEventReport({
        eventId,
        reportId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Report id (UUID or erp_<uuid>)
         */
        reportId: any,
        /**
         * Resolution fields
         */
        requestBody: EventReportResolveIn,
    }): CancelablePromise<EventReportOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/events/{event_id}/reports/{report_id}',
            path: {
                'event_id': eventId,
                'report_id': reportId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid id or body`,
                401: `Authentication required`,
                403: `Insufficient permissions for this event`,
                404: `Event or report not found`,
                422: `Validation failed`,
                501: `Event moderation writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * List rules for an event
     * Returns active rules for an event, ordered by
     * display_order. When the event is organized by a group,
     * active group-scoped rules are included via union.
     * @returns EventRuleOut OK
     * @throws ApiError
     */
    public static listEventRules({
        eventId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
    }): CancelablePromise<Array<EventRuleOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/events/{event_id}/rules',
            path: {
                'event_id': eventId,
            },
            errors: {
                400: `Invalid event_id`,
                404: `Event not found`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * Add a rule to an event
     * Creates a new rule scoped to the event. Authorized as
     * event organizer (direct user-organizer, group-organizer
     * via owner/admin/manager role, accepted owner/organizer
     * collaborator, or platform admin).
     * @returns EventRuleOut Created
     * @throws ApiError
     */
    public static createEventRule({
        eventId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Event rule fields
         */
        requestBody: EventRuleCreateIn,
    }): CancelablePromise<EventRuleOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/events/{event_id}/rules',
            path: {
                'event_id': eventId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or body`,
                401: `Authentication required`,
                403: `Insufficient permissions for this event`,
                404: `Event not found`,
                422: `Validation failed (title/description length)`,
                501: `Event rule writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * Delete an event rule
     * Removes a rule. Returns 404 when the rule does not
     * exist .
     * @returns void
     * @throws ApiError
     */
    public static deleteEventRule({
        eventId,
        ruleId,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Event rule id (UUID or erl_<uuid>)
         */
        ruleId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/events/{event_id}/rules/{rule_id}',
            path: {
                'event_id': eventId,
                'rule_id': ruleId,
            },
            errors: {
                400: `Invalid event_id`,
                401: `Authentication required`,
                403: `Insufficient permissions for this event`,
                404: `Event or rule not found`,
                422: `Wrong rule_id prefix`,
                501: `Event rule writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
    /**
     * Update an event rule
     * Partial update on title / description / display_order /
     * is_active. Absent fields leave the column untouched.
     * Authorized as event organizer.
     * @returns EventRuleOut OK
     * @throws ApiError
     */
    public static updateEventRule({
        eventId,
        ruleId,
        requestBody,
    }: {
        /**
         * Event id (UUID or evt_<uuid>)
         */
        eventId: any,
        /**
         * Event rule id (UUID or erl_<uuid>)
         */
        ruleId: any,
        /**
         * Event rule patch
         */
        requestBody: EventRuleUpdateIn,
    }): CancelablePromise<EventRuleOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/events/{event_id}/rules/{rule_id}',
            path: {
                'event_id': eventId,
                'rule_id': ruleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid event_id or body`,
                401: `Authentication required`,
                403: `Insufficient permissions for this event`,
                404: `Event or rule not found`,
                422: `Validation failed (length/wrong rule_id prefix)`,
                501: `Event rule writes not configured`,
                503: `Group-organizer adapter unconfigured`,
            },
        });
    }
}
