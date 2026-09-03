/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ServiceHealthOut = {
    /**
     * DurationSeconds is whole seconds between Since and the
     * snapshot's CheckedAt; always >= 0 (clamped at zero).
     */
    duration_seconds?: number;
    /**
     * ID is the stable lowercase identifier - one of: "auth",
     * "events", "media", "discovery", "social", "realtime".
     */
    id?: string;
    /**
     * Name is the user-facing service name (kept in the API so a
     * backend-driven copy update doesn't require a frontend redeploy).
     */
    name?: string;
    /**
     * Since is when the current Status took effect.
     */
    since?: string;
    /**
     * Status is one of the ServiceStatus constants.
     */
    status?: 'operational' | 'degraded_performance' | 'partial_outage' | 'major_outage' | 'under_maintenance';
};

