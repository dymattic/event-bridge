/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaUploadID } from './MediaUploadID';
export type CampaignCreate = {
    /**
     * DefaultBodyMD is the inherited body markdown for steps that don't
     * override.
     */
    default_body_md?: string;
    /**
     * DefaultMediaUploadIDs is the inherited media-upload list for
     * steps that don't override.
     */
    default_media_upload_ids?: Array<MediaUploadID>;
    /**
     * Description is an optional descriptive blurb. Up to 5000 chars.
     */
    description?: string;
    /**
     * OwnerID is the prefixed-or-bare UUID of the owning entity. For
     * owner_type=user this MUST resolve to the caller's user_id.
     */
    owner_id?: string;
    /**
     * OwnerType is one of "user", "group", "performer".
     */
    owner_type?: string;
    /**
     * TargetID is the prefixed-or-bare UUID of the target entity.
     */
    target_id?: string;
    /**
     * TargetType is one of "event", "release".
     */
    target_type?: string;
    /**
     * Timezone is the IANA timezone the campaign schedule is anchored
     * to.
     */
    timezone?: string;
    /**
     * Title is the campaign title. Required, 1..255 chars.
     */
    title?: string;
};

