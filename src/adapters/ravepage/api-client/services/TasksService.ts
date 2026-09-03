/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskConsoleOut } from '../models/TaskConsoleOut';
import type { TaskControlAck } from '../models/TaskControlAck';
import type { TaskLogOut } from '../models/TaskLogOut';
import type { TaskStatusEnvelope } from '../models/TaskStatusEnvelope';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TasksService {
    /**
     * Run a background job now
     * Admin-only. Broadcasts a request to run `job_name` immediately. The worker that owns the job runs it once off-ticker (advisory lock honored; a run already in flight is skipped); workers without the job no-op. Fire-and-forget - 202 confirms the command was published.
     * @returns TaskControlAck Accepted
     * @throws ApiError
     */
    public static runTaskNow({
        jobName,
    }: {
        /**
         * Job name (task_logs.task_name)
         */
        jobName: any,
    }): CancelablePromise<TaskControlAck> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jobs/{job_name}/run',
            path: {
                'job_name': jobName,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Control channel unavailable`,
            },
        });
    }
    /**
     * List background-task execution logs
     * Admin-only. Returns logs of background-task runs, newest-`start_time`-first. Filterable by `task_name`, `status` (`started`/`completed`/`failed`), and inclusive `start_date`/`end_date` (RFC3339). Paginated via `limit` (1..1000, default 100) + `offset` (default 0).
     * @returns TaskLogOut OK
     * @throws ApiError
     */
    public static getTaskLogs({
        taskName,
        status,
        startDate,
        endDate,
        limit,
        offset,
    }: {
        /**
         * Filter by task name
         */
        taskName?: any,
        /**
         * Filter by status (`started`/`completed`/`failed`)
         */
        status?: any,
        /**
         * Filter by start_time >= (RFC3339)
         */
        startDate?: any,
        /**
         * Filter by start_time <= (RFC3339)
         */
        endDate?: any,
        /**
         * Page size (1..1000, default 100)
         */
        limit?: any,
        /**
         * Pagination offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<Array<TaskLogOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/logs',
            query: {
                'task_name': taskName,
                'status': status,
                'start_date': startDate,
                'end_date': endDate,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Tasks unavailable`,
            },
        });
    }
    /**
     * Captured console for a task run
     * Admin-only. Returns the full captured console (structured log lines + subprocess stdout/stderr) for a single background-task run, ordered by sequence.
     * @returns TaskConsoleOut OK
     * @throws ApiError
     */
    public static getTaskConsole({
        id,
    }: {
        /**
         * Task run id (task_logs.id)
         */
        id: any,
    }): CancelablePromise<TaskConsoleOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/logs/{id}/console',
            path: {
                'id': id,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Run not found`,
                422: `Invalid run id`,
                500: `Console unavailable`,
            },
        });
    }
    /**
     * Live console stream for a task run (SSE)
     * Admin-only. Server-Sent Events stream of a running task's console. Emits a backfill of captured lines, then live chunks as they arrive. Each event is `data: {"seq":N,"text":"..."}`.
     * @returns string SSE stream
     * @throws ApiError
     */
    public static streamTaskConsole({
        id,
    }: {
        /**
         * Task run id (task_logs.id)
         */
        id: any,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/logs/{id}/console/stream',
            path: {
                'id': id,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Invalid run id`,
                503: `Live streaming unavailable`,
            },
        });
    }
    /**
     * Cancel a running background-task run
     * Admin-only. Broadcasts a best-effort cancel for the run with `run_id` (from `/tasks/logs`). The owning worker cancels the run's context; other workers no-op. Fire-and-forget - 202 confirms the command was published, not that the run stopped.
     * @returns TaskControlAck Accepted
     * @throws ApiError
     */
    public static cancelTaskRun({
        runId,
    }: {
        /**
         * Run id (uuid) from /tasks/logs
         */
        runId: any,
    }): CancelablePromise<TaskControlAck> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tasks/logs/{run_id}/cancel',
            path: {
                'run_id': runId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Control channel unavailable`,
            },
        });
    }
    /**
     * Aggregate background-task status over a window
     * Admin-only. Returns per-task counters (`total`/`completed`/`failed`/`started`), rolling `avg_execution_time`, and the latest `(start_time, status)` pair for each task name. Window is the last `days` days (1..30, default 7).
     * @returns TaskStatusEnvelope OK
     * @throws ApiError
     */
    public static getTaskStatusSummary({
        days,
    }: {
        /**
         * Window length in days (1..30, default 7)
         */
        days?: any,
    }): CancelablePromise<TaskStatusEnvelope> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tasks/status',
            query: {
                'days': days,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Tasks unavailable`,
            },
        });
    }
}
