/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudCommentItemOut } from './SoundCloudCommentItemOut';
export type SoundCloudCommentsOut = {
    /**
     * Cache write timestamp.
     */
    cached_at?: string;
    /**
     * Comments for this page; non-nil slice.
     */
    items?: Array<SoundCloudCommentItemOut>;
    /**
     * Opaque cursor for next page.
     */
    next_cursor?: string;
    /**
     * Total comment count as reported by SoundCloud.
     */
    total_count?: number;
    /**
     * SoundCloud track ID.
     */
    track_id?: number;
};

