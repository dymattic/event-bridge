/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GenreCountOut = {
    /**
     * DistinctTracks is the number of distinct library tracks tagged
     * with this genre in the window.
     */
    distinct_tracks?: number;
    /**
     * Genre is the raw library genre text, lower-cased+trimmed at the
     * aggregation layer so casing variants collapse to one bucket.
     */
    genre?: string;
    /**
     * Plays is the total number of plays tagged with this genre in the
     * window.
     */
    plays?: number;
};

