/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaUploadID } from './MediaUploadID';
export type CreateReportIn = {
    /**
     * ApplicationState is FE-internal state snapshot (route, store
     * slice, feature flags). Stored verbatim in JSONB.
     */
    application_state?: Record<string, any>;
    /**
     * AttachmentIDs is a list of media_uploads.id rows the user
     * previously uploaded. go.
     */
    attachment_ids?: Array<MediaUploadID>;
    /**
     * AttachmentTypes is the parallel attachment-type list (screenshot
     * / recording / log_file).
     */
    attachment_types?: Array<string>;
    /**
     * Description is the report body. Required, 10..50000 chars.
     */
    description?: string;
    /**
     * ErrorContext is the JS exception / stack-trace if captured.
     */
    error_context?: Record<string, any>;
    /**
     * ReportType is one of "bug", "feature_request", "feedback".
     * Required.
     */
    report_type?: string;
    /**
     * RequestLog is the last N captured request/response pairs (no
     * headers, no bodies - see RequestLogEntry validation in service
     * layer). Up to 50 entries.
     */
    request_log?: Array<Record<string, any>>;
    /**
     * SessionInfo is browser / OS / version detail captured at report
     * time. Stored verbatim in JSONB.
     */
    session_info?: Record<string, any>;
    /**
     * Severity is one of "critical", "major", "minor", "cosmetic" or
     * nil. Bugs typically set this; feature requests usually omit.
     */
    severity?: string;
    /**
     * Title is the report title. Required, 3..300 chars.
     */
    title?: string;
    /**
     * TraceIDs is an opaque list of correlation IDs captured by the
     * FE. Up to 20 entries.
     */
    trace_ids?: Array<string>;
};

