/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskConsoleLineOut } from './TaskConsoleLineOut';
export type TaskConsoleOut = {
    /**
     * console chunks ordered by seq
     */
    lines?: Array<TaskConsoleLineOut>;
    /**
     * the task_logs.id this console belongs to
     */
    run_id?: string;
};

