/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowAllOut } from './FollowAllOut';
export type FollowJobStatusOut = {
    attempts?: number;
    created_at?: string;
    job_id?: string;
    last_error?: string;
    max_attempts?: number;
    next_retry_at?: string;
    /**
     * Result is null when the job has not completed yet (queued /
     * running). Populated with the persisted FollowAllResponse once a
     * worker tick has run.
     */
    result?: FollowAllOut;
    status?: 'queued' | 'running' | 'done' | 'failed' | 'cancelled';
    updated_at?: string;
};

