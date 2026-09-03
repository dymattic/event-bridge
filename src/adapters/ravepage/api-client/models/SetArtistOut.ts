/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SetArtistGenreCountOut } from './SetArtistGenreCountOut';
export type SetArtistOut = {
    /**
     * Genres are the artist's raw-genre counts within this set, count
     * desc. Never null (empty when no genre text is banked).
     */
    genres?: Array<SetArtistGenreCountOut>;
    /**
     * Name is the credited artist name.
     */
    name?: string;
    /**
     * PerformerID is the resolved performer (`perf_<uuid>`); null for
     * credit-only (unresolved) artists.
     */
    performer_id?: string;
    /**
     * TrackCount is the artist's distinct matched tracks in this set.
     */
    track_count?: number;
};

