/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSyncRuleIn = {
    /**
     * GoogleCalendarID - Google sub-calendar id. Required.
     */
    google_calendar_id?: string;
    /**
     * IsEnabled - defaults true when omitted.
     */
    is_enabled?: boolean;
    /**
     * LocalCalendarID - native calendar (UUID or cal_<uuid>). Required.
     */
    local_calendar_id?: string;
    /**
     * SyncDirection - pull | push | bidirectional. Default bidirectional.
     */
    sync_direction?: string;
};

