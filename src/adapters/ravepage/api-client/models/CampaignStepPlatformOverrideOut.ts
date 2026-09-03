/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CampaignStepID } from './CampaignStepID';
import type { CampaignStepOverrideID } from './CampaignStepOverrideID';
import type { MediaUploadID } from './MediaUploadID';
export type CampaignStepPlatformOverrideOut = {
    body_override?: string;
    created_at?: string;
    enabled?: boolean;
    extra?: Record<string, any>;
    id?: CampaignStepOverrideID;
    media_upload_ids_override?: Array<MediaUploadID>;
    platform?: 'bluesky' | 'discord' | 'email' | 'instagram' | 'mastodon' | 'x';
    step_id?: CampaignStepID;
    subject_override?: string;
    updated_at?: string;
};

