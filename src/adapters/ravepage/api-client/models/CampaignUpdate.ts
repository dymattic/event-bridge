/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaUploadID } from './MediaUploadID';
export type CampaignUpdate = {
    /**
     * DefaultBodyMD - replacement default body markdown.
     */
    default_body_md?: string;
    /**
     * DefaultMediaUploadIDs - replacement default media list. A nil
     * pointer means "unchanged"; an empty array means "clear".
     */
    default_media_upload_ids?: Array<MediaUploadID>;
    /**
     * Description - replacement description; nil = unchanged.
     */
    description?: string;
    /**
     * Status - one of draft/active/paused/completed/cancelled/archived.
     * Transitions are enforced by the service layer.
     */
    status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
    /**
     * Timezone - replacement IANA timezone.
     */
    timezone?: string;
    /**
     * Title - replacement title; nil = unchanged. 1..255 chars.
     */
    title?: string;
};

