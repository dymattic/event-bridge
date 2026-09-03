/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SyncRuleOut = {
    /**
     * CreatedAt / UpdatedAt are row timestamps.
     */
    created_at?: string;
    /**
     * GoogleCalendarID is the Google sub-calendar (e.g. "primary").
     */
    google_calendar_id?: string;
    /**
     * ID is the rule id.
     */
    id?: string;
    /**
     * IsEnabled gates the rule for the background scheduler.
     */
    is_enabled?: boolean;
    /**
     * LastSyncAt is the last reconcile (null until first run).
     */
    last_sync_at?: string;
    /**
     * LocalCalendarID is the native platform calendar.
     */
    local_calendar_id?: string;
    /**
     * SyncDirection is pull | push | bidirectional.
     */
    sync_direction?: string;
    updated_at?: string;
};

