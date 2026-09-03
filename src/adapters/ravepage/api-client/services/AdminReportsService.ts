/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminUpdateReportIn } from '../models/AdminUpdateReportIn';
import type { CreateReportCommentIn } from '../models/CreateReportCommentIn';
import type { ReportCommentOut } from '../models/ReportCommentOut';
import type { ReportDetailOut } from '../models/ReportDetailOut';
import type { ReportListOut } from '../models/ReportListOut';
import type { ReportStatsOut } from '../models/ReportStatsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminReportsService {
    /**
     * List all reports (admin)
     * Admin view of all reports with advanced filtering.
     * Filters: status, type, severity, priority,
     * assigned_to. Sorts: created_at (default),
     * upvote_count, priority. Cursor pagination via the
     * opaque next_cursor field.
     * @returns ReportListOut OK
     * @throws ApiError
     */
    public static adminListReports({
        status,
        type,
        severity,
        priority,
        assignedTo,
        sortBy,
        limit,
        cursor,
    }: {
        /**
         * Filter by status
         */
        status?: any,
        /**
         * Filter by report_type
         */
        type?: any,
        /**
         * Filter by severity
         */
        severity?: any,
        /**
         * Filter by priority
         */
        priority?: any,
        /**
         * Filter by assignee user id (prefixed or bare UUID)
         */
        assignedTo?: any,
        /**
         * Sort: created_at | upvote_count | priority
         */
        sortBy?: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<ReportListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/reports',
            query: {
                'status': status,
                'type': type,
                'severity': severity,
                'priority': priority,
                'assigned_to': assignedTo,
                'sort_by': sortBy,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller lacks admin role`,
                422: `Invalid sort_by`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Report statistics (admin)
     * Aggregate counts by status, type, severity, plus the
     * average resolution time (hours, rounded to 1
     * decimal). Empty tables return zero counts + null
     * avg_resolution_hours.
     * @returns ReportStatsOut OK
     * @throws ApiError
     */
    public static getReportStats(): CancelablePromise<ReportStatsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/reports/stats',
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller lacks admin role`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get full report detail (admin)
     * Returns the complete report including session info,
     * request log, application state, and error context.
     * Non-admin callers get 403 (no BOLA-leak ambiguity on
     * the admin surface).
     * @returns ReportDetailOut OK
     * @throws ApiError
     */
    public static adminGetReport({
        reportId,
    }: {
        /**
         * Report ID (prefixed 'rep_<uuid>' or bare UUID)
         */
        reportId: any,
    }): CancelablePromise<ReportDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/reports/{report_id}',
            path: {
                'report_id': reportId,
            },
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller lacks admin role`,
                404: `Report not found`,
                422: `Malformed report_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Triage report (admin)
     * Update status, priority, assignment, or tags. Status
     * transitions are enforced (e.g. open→triaged,
     * in_progress→resolved). Setting status="resolved"
     * populates resolved_at=NOW(); reopening (status="open")
     * clears it. Pass assigned_to_user_id=null to clear
     * the assignment.
     * @returns ReportDetailOut OK
     * @throws ApiError
     */
    public static adminUpdateReport({
        reportId,
        requestBody,
    }: {
        /**
         * Report ID (prefixed or bare UUID)
         */
        reportId: any,
        /**
         * Patch fields
         */
        requestBody: AdminUpdateReportIn,
    }): CancelablePromise<ReportDetailOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/reports/{report_id}',
            path: {
                'report_id': reportId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller lacks admin role`,
                404: `Report not found`,
                422: `Validation or status transition invalid`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add admin comment
     * Adds a comment to the report. is_internal=true is
     * honored (admin-only - non-admin callers cannot reach
     * this endpoint). Setting is_internal=true produces an
     * admin-only note hidden from the reporter.
     * @returns ReportCommentOut Created
     * @throws ApiError
     */
    public static adminCreateReportComment({
        reportId,
        requestBody,
    }: {
        /**
         * Report ID (prefixed or bare UUID)
         */
        reportId: any,
        /**
         * Comment body
         */
        requestBody: CreateReportCommentIn,
    }): CancelablePromise<ReportCommentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/reports/{report_id}/comments',
            path: {
                'report_id': reportId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                403: `Caller lacks admin role`,
                404: `Report not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
}
