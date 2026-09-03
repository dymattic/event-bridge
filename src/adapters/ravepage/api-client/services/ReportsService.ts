/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateReportCommentIn } from '../models/CreateReportCommentIn';
import type { CreateReportIn } from '../models/CreateReportIn';
import type { ReportCommentListOut } from '../models/ReportCommentListOut';
import type { ReportCommentOut } from '../models/ReportCommentOut';
import type { ReportDetailOut } from '../models/ReportDetailOut';
import type { ReportListOut } from '../models/ReportListOut';
import type { UpdateReportIn } from '../models/UpdateReportIn';
import type { VoteOut } from '../models/VoteOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportsService {
    /**
     * Submit a bug report, feature request, or feedback
     * Creates a new report. Rate-limited to 10/hour per
     * authenticated user. The `attachment_ids` field is
     * currently restricted: requests carrying non-empty
     * attachment_ids are rejected with 422 ATTACHMENTS_
     * UNSUPPORTED. The media-ingest cross-worker validation
     * contract that would verify caller ownership of each
     * attachment is pending; until then the safe shape is
     * to refuse the field rather than store unvalidated
     * references.
     * @returns ReportDetailOut Created
     * @throws ApiError
     */
    public static createReport({
        requestBody,
    }: {
        /**
         * Report fields
         */
        requestBody: CreateReportIn,
    }): CancelablePromise<ReportDetailOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reports',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                422: `Validation failed or attachments unsupported`,
                429: `Rate-limit exceeded`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List my reports
     * Returns the authenticated user's submitted reports,
     * most-recent first (or by upvote_count when
     * sort_by=upvote_count). Cursor pagination via the
     * opaque next_cursor field.
     * @returns ReportListOut OK
     * @throws ApiError
     */
    public static listMyReports({
        status,
        type,
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
         * Sort field: created_at (default) | upvote_count
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
            url: '/reports/me',
            query: {
                'status': status,
                'type': type,
                'sort_by': sortBy,
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Auth missing or invalid`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get one report
     * Returns the report's detail view. BOLA-gated: a
     * non-owner non-admin caller sees 404 (not 403) to
     * avoid leaking report ID existence. Admin-only fields
     * (session_info / application_state / request_log /
     * error_context) are omitted from the response for
     * non-admin callers.
     * @returns ReportDetailOut OK
     * @throws ApiError
     */
    public static getReport({
        reportId,
    }: {
        /**
         * Report ID (prefixed 'rep_<uuid>' or bare UUID)
         */
        reportId: any,
    }): CancelablePromise<ReportDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/{report_id}',
            path: {
                'report_id': reportId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Report not found or not visible to caller`,
                422: `Malformed report_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Edit own report (title/description, only while open)
     * Reporter (or admin) updates a report's title +
     * description. Only allowed while status=="open" -
     * any other status returns 422 NOT_OPEN.
     * @returns ReportDetailOut OK
     * @throws ApiError
     */
    public static updateReport({
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
        requestBody: UpdateReportIn,
    }): CancelablePromise<ReportDetailOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/reports/{report_id}',
            path: {
                'report_id': reportId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                404: `Report not found or not visible to caller`,
                422: `Validation or status precondition failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List comments on a report (BOLA-gated)
     * Returns comments visible to the caller. Internal
     * comments are hidden from non-admin viewers. Non-admin
     * callers see only their own reports (404 on others).
     * @returns ReportCommentListOut OK
     * @throws ApiError
     */
    public static listReportComments({
        reportId,
        limit,
        cursor,
    }: {
        /**
         * Report ID (prefixed or bare UUID)
         */
        reportId: any,
        /**
         * Page size (1..200, default 50)
         */
        limit?: any,
        /**
         * Opaque pagination cursor
         */
        cursor?: any,
    }): CancelablePromise<ReportCommentListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reports/{report_id}/comments',
            path: {
                'report_id': reportId,
            },
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Report not found or not visible to caller`,
                422: `Malformed report_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Add a comment to a report (BOLA-gated)
     * Non-admin callers may only comment on reports they
     * authored. Non-admin `is_internal=true` is silently
     * downgraded to false .
     * @returns ReportCommentOut Created
     * @throws ApiError
     */
    public static createReportComment({
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
            url: '/reports/{report_id}/comments',
            path: {
                'report_id': reportId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Auth missing or invalid`,
                404: `Report not found or not visible to caller`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Remove the caller's upvote (idempotent)
     * Deletes the caller's `report_votes` row if present;
     * no-op otherwise. The response always carries the
     * current count.
     * @returns VoteOut OK
     * @throws ApiError
     */
    public static removeReportVote({
        reportId,
    }: {
        /**
         * Report ID (prefixed or bare UUID)
         */
        reportId: any,
    }): CancelablePromise<VoteOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/reports/{report_id}/vote',
            path: {
                'report_id': reportId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Report not found`,
                422: `Malformed report_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Upvote a report (idempotent)
     * Adds the caller's upvote to the report.
     * @returns VoteOut OK
     * @throws ApiError
     */
    public static addReportVote({
        reportId,
    }: {
        /**
         * Report ID (prefixed or bare UUID)
         */
        reportId: any,
    }): CancelablePromise<VoteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/reports/{report_id}/vote',
            path: {
                'report_id': reportId,
            },
            errors: {
                401: `Auth missing or invalid`,
                404: `Report not found`,
                422: `Malformed report_id`,
                500: `Internal error`,
            },
        });
    }
}
