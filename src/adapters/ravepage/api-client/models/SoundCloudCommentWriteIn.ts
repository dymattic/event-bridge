/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudCommentWriteIn = {
    /**
     * Comment text (1..2000 chars).
     */
    body?: string;
    /**
     * Playback position in ms for timed comments; omit for non-timed.
     */
    timestamp_ms?: number;
};

