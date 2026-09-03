/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskStatusOut = {
    avg_execution_time?: number;
    completed?: number;
    failed?: number;
    last_execution?: string;
    /**
     * Progress of the LATEST run for this task (budget-per-tick jobs).
     * LastMorePending true = the newest run finished its budget but the
     * logical backfill is still running. Null/false for jobs that don't
     * report progress.
     */
    last_more_pending?: boolean;
    last_progress_current?: number;
    last_progress_note?: string;
    last_progress_total?: number;
    last_status?: string;
    started?: number;
    total?: number;
};

