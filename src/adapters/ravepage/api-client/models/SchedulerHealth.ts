/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SchedulerHealth = {
    detail?: string;
    last_tick_at?: string;
    seconds_since_last_tick?: number;
    status?: 'ok' | 'degraded' | 'down' | 'unknown' | 'disabled';
};

