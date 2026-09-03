/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { YouTubeChannelStatistics } from './YouTubeChannelStatistics';
import type { YouTubeThumbnailSet } from './YouTubeThumbnailSet';
export type YouTubeChannelOut = {
    /**
     * Custom URL.
     */
    customUrl?: string;
    /**
     * Channel description.
     */
    description?: string;
    /**
     * YouTube channel ID.
     */
    id?: string;
    /**
     * Channel creation date.
     */
    publishedAt?: string;
    /**
     * Channel statistics.
     */
    statistics?: YouTubeChannelStatistics;
    /**
     * Thumbnails in different sizes.
     */
    thumbnails?: YouTubeThumbnailSet;
    /**
     * Channel title.
     */
    title?: string;
};

