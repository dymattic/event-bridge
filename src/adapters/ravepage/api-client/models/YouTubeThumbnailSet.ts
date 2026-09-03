/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { YouTubeThumbnail } from './YouTubeThumbnail';
export type YouTubeThumbnailSet = {
    /**
     * 120x90 - always present.
     */
    default?: YouTubeThumbnail;
    /**
     * 480x360.
     */
    high?: YouTubeThumbnail;
    /**
     * 1280x720 - newer content only.
     */
    maxres?: YouTubeThumbnail;
    /**
     * 320x180.
     */
    medium?: YouTubeThumbnail;
    /**
     * 640x480 - videos only.
     */
    standard?: YouTubeThumbnail;
};

