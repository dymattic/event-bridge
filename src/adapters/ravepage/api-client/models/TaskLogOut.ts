/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskLogOut = {
    created_at?: string;
    /**
     * Details is the parsed JSONB blob. Round-tripped untouched.
     */
    details?: Array<number>;
    end_time?: string;
    error_message?: string;
    execution_time?: number;
    id?: string;
    /**
     * MorePending is true when the run completed its per-tick budget but
     * the logical job has more work queued (e.g. a multi-million-row
     * backfill mid-flight). status stays "completed" - this is the flag
     * that says "not actually finished". Defaults false.
     */
    more_pending?: boolean;
    /**
     * ProgressCurrent/Total/Note describe a budget-per-tick job's
     * cumulative progress within the LOGICAL (multi-tick) job. Null unless
     * the job body reported progress. Total null = unknown (no %).
     */
    progress_current?: number;
    progress_note?: string;
    progress_total?: number;
    start_time?: string;
    status?: 'started' | 'completed' | 'failed';
    task_name?: string;
    updated_at?: string;
};

