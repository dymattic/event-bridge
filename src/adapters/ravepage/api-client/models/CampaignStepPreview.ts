/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaRenderRef } from './MediaRenderRef';
export type CampaignStepPreview = {
    body?: string;
    character_count?: number;
    character_limit?: number;
    enabled?: boolean;
    extra_resolved?: Record<string, any>;
    media?: Array<MediaRenderRef>;
    platform?: 'bluesky' | 'discord' | 'email' | 'instagram' | 'mastodon' | 'x';
    truncation?: string;
    warnings?: Array<string>;
};

