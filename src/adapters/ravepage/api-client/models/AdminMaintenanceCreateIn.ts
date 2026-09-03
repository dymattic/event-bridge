/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminMaintenanceCreateIn = {
    /**
     * AffectedServices is a non-empty list of public-service ids.
     */
    affected_services?: Array<string>;
    /**
     * Description is markdown notes; ≤10000 chars. Default empty.
     */
    description?: string;
    /**
     * ScheduledEnd is the operator-set planned end time. Must be
     * after ScheduledStart.
     */
    scheduled_end?: string;
    /**
     * ScheduledStart is the operator-set planned start time.
     */
    scheduled_start?: string;
    /**
     * Title is the operator-facing headline; 1..255 chars.
     */
    title?: string;
};

