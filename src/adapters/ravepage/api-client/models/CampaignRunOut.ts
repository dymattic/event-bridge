/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CampaignID } from './CampaignID';
import type { CampaignRunID } from './CampaignRunID';
import type { CampaignStepID } from './CampaignStepID';
export type CampaignRunOut = {
    attempt_number?: number;
    campaign_id?: CampaignID;
    created_at?: string;
    error_code?: string;
    error_message?: string;
    external_post_id?: string;
    external_post_url?: string;
    finished_at?: string;
    id?: CampaignRunID;
    platform?: 'bluesky' | 'discord' | 'email' | 'instagram' | 'mastodon' | 'x';
    response_payload?: Record<string, any>;
    started_at?: string;
    status?: 'success' | 'error' | 'skipped';
    step_id?: CampaignStepID;
};

