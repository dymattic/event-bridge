/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DistributionJobOut = {
    created_at?: string;
    error_message?: string;
    is_audio_only?: boolean;
    job_id?: string;
    original_filename?: string;
    platform?: 'youtube' | 'soundcloud' | 'bluesky' | 'twitch' | 'x' | 'instagram' | 'spotify';
    platform_id?: string;
    platform_url?: string;
    progress?: number;
    status?: 'pending' | 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
    title?: string;
    updated_at?: string;
    upload_id?: string;
};

