/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DistributionInstagramPayload } from './DistributionInstagramPayload';
import type { DistributionPlatform } from './DistributionPlatform';
import type { DistributionSoundCloudPayload } from './DistributionSoundCloudPayload';
import type { DistributionYouTubePayload } from './DistributionYouTubePayload';
export type DistributionStartRequest = {
    /**
     * InstagramPayload - set when Platform == "instagram".
     */
    instagram_payload?: DistributionInstagramPayload;
    /**
     * IsAudioOnly - log-projection only; not used for routing.
     */
    is_audio_only?: boolean;
    /**
     * OriginalFilename - for fallback title when YouTubePayload.Title
     * is empty .
     */
    original_filename?: string;
    /**
     * Platform - target provider.
     */
    platform?: DistributionPlatform;
    /**
     * SignedMediaURL - short-lived media-delivery presigned URL that
     * social-platforms downloads from for upload to the external
     * provider.
     */
    signed_media_url?: string;
    /**
     * SoundCloudPayload - set when Platform == "soundcloud".
     */
    soundcloud_payload?: DistributionSoundCloudPayload;
    /**
     * UploadID - bare-UUID string of the media_uploads row being
     * distributed. social-platforms uses it for log-correlation only;
     * it does NOT re-read the row (no DB grant on media_uploads).
     */
    upload_id?: string;
    /**
     * UserID - bare-UUID string of the actor.
     */
    user_id?: string;
    /**
     * YouTubePayload - set when Platform == "youtube".
     */
    youtube_payload?: DistributionYouTubePayload;
};

