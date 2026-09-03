/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskIntervalOut } from './TaskIntervalOut';
export type TaskScheduleOut = {
    created_at?: string;
    id?: string;
    interval?: TaskIntervalOut;
    interval_id?: string;
    is_active?: boolean;
    last_run?: string;
    next_run?: string;
    /**
     * ObservedLastRun: newest task_logs.start_time for a same-named Go
     * job (nil when no Go worker runs a task by this name).
     */
    observed_last_run?: string;
    /**
     * Always true so the FE can stop rendering last_run/next_run as if
     * they were armed. Live run evidence rides on observed_last_run.
     */
    retired?: boolean;
    retired_reason?: string;
    task_name?: string;
    task_params?: Array<number>;
    updated_at?: string;
};

