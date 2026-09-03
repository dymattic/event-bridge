/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudCommentAuthorOut } from './SoundCloudCommentAuthorOut';
export type SoundCloudCommentItemOut = {
    /**
     * Comment text.
     */
    body?: string;
    /**
     * ISO 8601 creation timestamp.
     */
    created_at?: string;
    /**
     * Comment ID.
     */
    id?: number;
    /**
     * Timed-comment position in ms; null = non-timed.
     */
    timestamp_ms?: number;
    /**
     * Comment author.
     */
    user?: SoundCloudCommentAuthorOut;
};

