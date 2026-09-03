/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventReportID } from './EventReportID';
import type { UserID } from './UserID';
export type EventReportOut = {
    created_at?: string;
    description?: string;
    event_id?: EventID;
    id?: EventReportID;
    reason?: string;
    reported_user_id?: UserID;
    reporter_user_id?: UserID;
    resolution_note?: string;
    resolved_at?: string;
    resolved_by_user_id?: UserID;
    status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
    updated_at?: string;
};

