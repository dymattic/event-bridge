/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DistributionPlatform } from './DistributionPlatform';
export type DistributionStartResponse = {
    /**
     * JobID - opaque string for FE polling.
     */
    job_id?: string;
    /**
     * Platform - echo of the request's Platform.
     */
    platform?: DistributionPlatform;
    /**
     * PlatformID - provider's resource ID once the job completes.
     */
    platform_id?: string;
    /**
     * PlatformURL - convenience URL on the provider.
     */
    platform_url?: string;
    /**
     * Status - "queued" | "started" | "completed" | "failed". social.distribute_yt`
     * that the social-platforms worker consumes asynchronously.
     */
    status?: 'queued' | 'started' | 'completed' | 'failed';
};

