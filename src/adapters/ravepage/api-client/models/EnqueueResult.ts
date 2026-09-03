/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EnqueueResult = {
    attempts?: number;
    created_at?: string;
    job_id?: string;
    max_attempts?: number;
    status?: 'queued' | 'running' | 'completed' | 'failed';
};

