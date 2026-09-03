/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportID } from './ReportID';
import type { UserID } from './UserID';
export type ReportSummaryOut = {
    assigned_to_user_id?: UserID;
    created_at?: string;
    id?: ReportID;
    priority?: 'urgent' | 'high' | 'medium' | 'low' | 'none';
    report_type?: string;
    reporter_user_id?: UserID;
    severity?: string;
    status?: 'open' | 'triaged' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';
    title?: string;
    updated_at?: string;
    upvote_count?: number;
};

