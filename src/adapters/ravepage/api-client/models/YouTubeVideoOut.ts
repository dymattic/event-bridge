/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { YouTubeThumbnailSet } from './YouTubeThumbnailSet';
import type { YouTubeVideoStatistics } from './YouTubeVideoStatistics';
export type YouTubeVideoOut = {
    /**
     * Channel ID.
     */
    channelId?: string;
    /**
     * Channel title.
     */
    channelTitle?: string;
    /**
     * Video description.
     */
    description?: string;
    /**
     * YouTube video ID.
     */
    id?: string;
    /**
     * Publication date.
     */
    publishedAt?: string;
    /**
     * Video statistics.
     */
    statistics?: YouTubeVideoStatistics;
    /**
     * Thumbnails in different sizes.
     */
    thumbnails?: YouTubeThumbnailSet;
    /**
     * Video title.
     */
    title?: string;
};

