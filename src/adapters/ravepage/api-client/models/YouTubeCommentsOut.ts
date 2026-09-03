/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { YouTubeCommentItemOut } from './YouTubeCommentItemOut';
export type YouTubeCommentsOut = {
    /**
     * Cache write timestamp.
     */
    cached_at?: string;
    /**
     * Comments for this page; non-nil slice.
     */
    items?: Array<YouTubeCommentItemOut>;
    /**
     * Opaque page token.
     */
    next_cursor?: string;
    /**
     * Total comment count.
     */
    total_count?: number;
    /**
     * YouTube video ID.
     */
    video_id?: string;
};

