/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DistributeYouTubeIn = {
    /**
     * CategoryID - YouTube category ID (default 22 People & Blogs).
     */
    category_id?: string;
    /**
     * Description - video description.
     */
    description?: string;
    /**
     * PlaylistID - YouTube playlist to add the video to.
     */
    playlist_id?: string;
    /**
     * PrivacyStatus - private | unlisted | public (default private).
     */
    privacy_status?: 'private' | 'unlisted' | 'public';
    /**
     * Tags - video tags.
     */
    tags?: Array<string>;
    /**
     * Title - video title; falls back to upload.title when empty.
     */
    title?: string;
    /**
     * UploadID - prefixed `upl_<uuid>` OR bare UUID. Required.
     */
    upload_id?: string;
};

