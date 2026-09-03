/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaUploadID } from './MediaUploadID';
import type { ProfileMediaID } from './ProfileMediaID';
export type ProfileMediaSlot = {
    /**
     * DisplayOrder is the render order within the slot category.
     */
    display_order?: number;
    /**
     * ID is the canonical prefixed profile-media identifier. Wire
     * form: `pmd_<uuid>`. Maps to `profile_media.id`.
     */
    id?: ProfileMediaID;
    /**
     * MediaUploadID is the prefixed reference to the underlying
     * `MediaUpload` row. Wire form: `upl_<uuid>`.
     */
    media_upload_id?: MediaUploadID;
    /**
     * MimeType is the upload's content-type hint, or null when the
     * pipeline has not yet probed it.
     */
    mime_type?: string;
    /**
     * Slot is the media slot category. One of `avatar`, `banner`,
     * `logo`. DB CHECK constraint enforces the same set.
     */
    slot?: string;
    /**
     * URL is the absolute `/media/stream/{media_upload_id}` URL the
     * FE should fetch the bytes from. Null when
     * `PROFILES_MEDIA_STREAM_BASE_URL` is unset (dev mode).
     */
    url?: string;
    /**
     * Variant is the optional kind tag for logos (`square`, `wide`,
     * `mono_light`, `mono_dark`, `alt1` …). Null on avatars/banners
     * and on logos without a variant assigned.
     */
    variant?: string;
};

