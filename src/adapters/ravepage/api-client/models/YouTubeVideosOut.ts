/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { YouTubePageInfo } from './YouTubePageInfo';
import type { YouTubeVideoOut } from './YouTubeVideoOut';
export type YouTubeVideosOut = {
    /**
     * Videos; non-nil slice.
     */
    items?: Array<YouTubeVideoOut>;
    /**
     * Token for next page.
     */
    nextPageToken?: string;
    /**
     * Pagination info.
     */
    pageInfo?: YouTubePageInfo;
    /**
     * Token for previous page.
     */
    prevPageToken?: string;
};

