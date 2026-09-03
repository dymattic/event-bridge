/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserID } from './UserID';
export type EventReportCreateIn = {
    /**
     * Description is the optional free-form report body.
     */
    description?: string;
    /**
     * Reason is the report category. Required.
     */
    reason?: string;
    /**
     * ReportedUserID is the optional user being reported. JSON null
     * when reporting the event itself.
     */
    reported_user_id?: UserID;
};

