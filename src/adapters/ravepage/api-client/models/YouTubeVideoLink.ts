/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type YouTubeVideoLink = {
    /**
     * CreatedAt is the cache row insert time.
     */
    created_at?: string;
    /**
     * CustomThumbnailURL overrides ThumbnailURL; nil when unset.
     */
    custom_thumbnail_url?: string;
    /**
     * CustomTitle overrides Title for display; nil when unset.
     */
    custom_title?: string;
    /**
     * ID is the cache row UUID.
     */
    id?: string;
    /**
     * PublishedAt is the YouTube publish timestamp.
     */
    published_at?: string;
    /**
     * ThumbnailURL is the high-quality thumbnail URL.
     */
    thumbnail_url?: string;
    /**
     * Title is the video title as cached from YouTube.
     */
    title?: string;
    /**
     * UpdatedAt is the cache row last-mutation time.
     */
    updated_at?: string;
    /**
     * VideoID is the YouTube video id (e.g. dQw4w9WgXcQ).
     */
    video_id?: string;
};

