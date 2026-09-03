/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistItemIn } from './PlaylistItemIn';
export type PlaylistItemsPutIn = {
    /**
     * Append false (default, byte-compatible for existing clients) replaces
     * the whole item list; true appends the items after the current tail,
     * positions continuing from the current max.
     */
    append?: boolean;
    /**
     * ExpectCount is an optimistic-concurrency guard, meaningful only with
     * append=true: if the playlist's CURRENT item count differs, the write
     * is rejected 409 (a torn/racing chunked push must not interleave).
     * Omitted = no check.
     */
    expect_count?: number;
    /**
     * Items in playlist order (per-request cap 1000).
     */
    items?: Array<PlaylistItemIn>;
};

