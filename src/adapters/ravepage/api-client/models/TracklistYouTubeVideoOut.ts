/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TracklistYouTubeVideoOut = {
    /**
     * CreatedAt is the CACHE row insert time; null when not cached.
     */
    created_at?: string;
    /**
     * CustomThumbnailURL overrides ThumbnailURL; null when unset/uncached.
     */
    custom_thumbnail_url?: string;
    /**
     * CustomTitle overrides Title for display; null when unset/uncached.
     */
    custom_title?: string;
    /**
     * ID is the platform cache row UUID; null when not cached.
     */
    id?: string;
    /**
     * LinkedAt is when the link was asserted. Always present.
     */
    linked_at?: string;
    /**
     * PublishedAt is the YouTube publish timestamp; null when not cached.
     */
    published_at?: string;
    /**
     * ThumbnailURL is the high-quality thumbnail; null when not cached.
     */
    thumbnail_url?: string;
    /**
     * Title is the cached video title; null when not cached.
     */
    title?: string;
    /**
     * UpdatedAt is the CACHE row last-mutation time; null when not cached.
     */
    updated_at?: string;
    /**
     * URL is the canonical watch URL. Always present.
     */
    url?: string;
    /**
     * VideoID is the YouTube video id. Always present - it IS the link.
     */
    video_id?: string;
};

