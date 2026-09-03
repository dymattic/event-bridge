/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type YouTubeVideoCacheOut = {
    /**
     * Cache write timestamp.
     */
    cached_at?: string;
    /**
     * Comment count.
     */
    comment_count?: number;
    /**
     * Custom thumbnail URL.
     */
    custom_thumbnail_url?: string;
    /**
     * Custom Rave.Page title.
     */
    custom_title?: string;
    /**
     * Video description.
     */
    description?: string;
    /**
     * ISO 8601 duration.
     */
    duration?: string;
    /**
     * Cache row UUID.
     */
    id?: string;
    /**
     * Cache last-updated timestamp.
     */
    last_updated?: string;
    /**
     * Like count.
     */
    like_count?: number;
    /**
     * Publication date.
     */
    published_at?: string;
    /**
     * Thumbnail URL.
     */
    thumbnail_url?: string;
    /**
     * Video title.
     */
    title?: string;
    /**
     * Linked tracklist UUIDs; non-nil slice.
     */
    tracklist_ids?: Array<string>;
    /**
     * YouTube video ID.
     */
    video_id?: string;
    /**
     * View count.
     */
    view_count?: number;
};

