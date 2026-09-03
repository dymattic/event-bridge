/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskIntervalIn } from '../models/TaskIntervalIn';
import type { TaskIntervalOut } from '../models/TaskIntervalOut';
import type { TaskScheduleIn } from '../models/TaskScheduleIn';
import type { TaskScheduleOut } from '../models/TaskScheduleOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskIntervalsService {
    /**
     * List task intervals
     * Admin-only. Returns all task intervals. Optional `is_active` filter narrows by activity flag.
     * @returns TaskIntervalOut OK
     * @throws ApiError
     */
    public static listTaskIntervals({
        isActive,
    }: {
        /**
         * Filter by active flag
         */
        isActive?: any,
    }): CancelablePromise<Array<TaskIntervalOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/task-intervals',
            query: {
                'is_active': isActive,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Task intervals unavailable`,
            },
        });
    }
    /**
     * Create task interval
     * Admin-only. Creates a new task interval. Either `cron_expression` (5-part cron) or `interval_seconds` (> 0) must be provided.
     * @returns TaskIntervalOut Created
     * @throws ApiError
     */
    public static createTaskInterval({
        requestBody,
    }: {
        /**
         * Task interval payload
         */
        requestBody: TaskIntervalIn,
    }): CancelablePromise<TaskIntervalOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/task-intervals',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed / name taken`,
                401: `Authentication required`,
                403: `Admin role required`,
                500: `Task intervals unavailable`,
            },
        });
    }
    /**
     * List task schedules
     * Admin-only. Returns all task schedules + joined intervals. Optional `task_name` / `is_active` filters.
     * @returns TaskScheduleOut OK
     * @throws ApiError
     */
    public static listTaskSchedules({
        taskName,
        isActive,
    }: {
        /**
         * Filter by task name
         */
        taskName?: any,
        /**
         * Filter by active flag
         */
        isActive?: any,
    }): CancelablePromise<Array<TaskScheduleOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/task-intervals/schedules',
            query: {
                'task_name': taskName,
                'is_active': isActive,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                422: `Validation failed`,
                500: `Task schedules unavailable`,
            },
        });
    }
    /**
     * Create task schedule
     * Admin-only. Creates a new task schedule. 404 when the referenced `interval_id` does not exist.
     * @returns TaskScheduleOut Created
     * @throws ApiError
     */
    public static createTaskSchedule({
        requestBody,
    }: {
        /**
         * Task schedule payload
         */
        requestBody: TaskScheduleIn,
    }): CancelablePromise<TaskScheduleOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/task-intervals/schedules',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Referenced interval not found`,
                500: `Task schedules unavailable`,
            },
        });
    }
    /**
     * Delete task schedule
     * Admin-only. Deletes one task schedule by id.
     * @returns void
     * @throws ApiError
     */
    public static deleteTaskSchedule({
        scheduleId,
    }: {
        /**
         * Schedule id (UUID)
         */
        scheduleId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/task-intervals/schedules/{schedule_id}',
            path: {
                'schedule_id': scheduleId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Task schedule not found`,
                422: `Invalid schedule id`,
                500: `Task schedules unavailable`,
            },
        });
    }
    /**
     * Get task schedule
     * Admin-only. Returns one task schedule + joined interval. 404 when not found.
     * @returns TaskScheduleOut OK
     * @throws ApiError
     */
    public static getTaskSchedule({
        scheduleId,
    }: {
        /**
         * Schedule id (UUID)
         */
        scheduleId: any,
    }): CancelablePromise<TaskScheduleOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/task-intervals/schedules/{schedule_id}',
            path: {
                'schedule_id': scheduleId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Task schedule not found`,
                422: `Invalid schedule id`,
                500: `Task schedules unavailable`,
            },
        });
    }
    /**
     * Update task schedule
     * Admin-only. Partial update - only provided fields are written. An explicit `null` task_params clears the column.
     * @returns TaskScheduleOut OK
     * @throws ApiError
     */
    public static updateTaskSchedule({
        scheduleId,
        requestBody,
    }: {
        /**
         * Schedule id (UUID)
         */
        scheduleId: any,
        /**
         * Partial schedule update
         */
        requestBody: TaskScheduleIn,
    }): CancelablePromise<TaskScheduleOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/task-intervals/schedules/{schedule_id}',
            path: {
                'schedule_id': scheduleId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Task schedule or interval not found`,
                422: `Invalid schedule id`,
                500: `Task schedules unavailable`,
            },
        });
    }
    /**
     * Delete task interval
     * Admin-only. Refuses with 400 when any task schedule still references this interval.
     * @returns void
     * @throws ApiError
     */
    public static deleteTaskInterval({
        intervalId,
    }: {
        /**
         * Interval id (UUID)
         */
        intervalId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/task-intervals/{interval_id}',
            path: {
                'interval_id': intervalId,
            },
            errors: {
                400: `Interval is referenced`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Task interval not found`,
                422: `Invalid interval id`,
                500: `Task intervals unavailable`,
            },
        });
    }
    /**
     * Get task interval
     * Admin-only. Returns one task interval by id. 404 when not found.
     * @returns TaskIntervalOut OK
     * @throws ApiError
     */
    public static getTaskInterval({
        intervalId,
    }: {
        /**
         * Interval id (UUID)
         */
        intervalId: any,
    }): CancelablePromise<TaskIntervalOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/task-intervals/{interval_id}',
            path: {
                'interval_id': intervalId,
            },
            errors: {
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Task interval not found`,
                422: `Invalid interval id`,
                500: `Task intervals unavailable`,
            },
        });
    }
    /**
     * Update task interval
     * Admin-only. Partial update - only provided fields are written. Post-merge MUST have at least one of `cron_expression` / `interval_seconds`.
     * @returns TaskIntervalOut OK
     * @throws ApiError
     */
    public static updateTaskInterval({
        intervalId,
        requestBody,
    }: {
        /**
         * Interval id (UUID)
         */
        intervalId: any,
        /**
         * Partial interval update
         */
        requestBody: TaskIntervalIn,
    }): CancelablePromise<TaskIntervalOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/task-intervals/{interval_id}',
            path: {
                'interval_id': intervalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed / name taken`,
                401: `Authentication required`,
                403: `Admin role required`,
                404: `Task interval not found`,
                422: `Invalid interval id`,
                500: `Task intervals unavailable`,
            },
        });
    }
}
