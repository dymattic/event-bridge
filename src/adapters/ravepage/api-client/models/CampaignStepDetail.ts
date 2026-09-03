/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CampaignID } from './CampaignID';
import type { CampaignStepID } from './CampaignStepID';
import type { CampaignStepPlatformOverrideOut } from './CampaignStepPlatformOverrideOut';
import type { MediaUploadID } from './MediaUploadID';
export type CampaignStepDetail = {
    body_md?: string;
    campaign_id?: CampaignID;
    created_at?: string;
    id?: CampaignStepID;
    label?: string;
    media_upload_ids?: Array<MediaUploadID>;
    offset_seconds?: number;
    order_index?: number;
    overrides?: Array<CampaignStepPlatformOverrideOut>;
    scheduled_at?: string;
    status?: 'pending' | 'scheduled' | 'publishing' | 'published' | 'partial_failure' | 'failed' | 'cancelled';
    updated_at?: string;
};

