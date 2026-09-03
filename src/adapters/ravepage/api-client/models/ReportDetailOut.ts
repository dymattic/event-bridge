/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportAttachmentOut } from './ReportAttachmentOut';
import type { ReportID } from './ReportID';
import type { UserID } from './UserID';
export type ReportDetailOut = {
    application_state?: Record<string, any>;
    assigned_to_user_id?: UserID;
    attachments?: Array<ReportAttachmentOut>;
    comment_count?: number;
    created_at?: string;
    description?: string;
    error_context?: Record<string, any>;
    id?: ReportID;
    priority?: 'urgent' | 'high' | 'medium' | 'low' | 'none';
    report_type?: string;
    reporter_user_id?: UserID;
    request_log?: Array<Record<string, any>>;
    resolved_at?: string;
    /**
     * Admin-only fields. nil → omitted from the JSON for non-admins.
     */
    session_info?: Record<string, any>;
    severity?: string;
    status?: 'open' | 'triaged' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';
    tags?: Array<string>;
    title?: string;
    trace_ids?: Array<string>;
    updated_at?: string;
    upvote_count?: number;
    voted_by_me?: boolean;
};

