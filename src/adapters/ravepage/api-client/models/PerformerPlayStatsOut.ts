/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtistCountOut } from './ArtistCountOut';
import type { GenreCountOut } from './GenreCountOut';
export type PerformerPlayStatsOut = {
    /**
     * DistinctSets is the number of distinct live streams (sets).
     */
    distinct_sets?: number;
    /**
     * DistinctTracks is the number of distinct library tracks played.
     */
    distinct_tracks?: number;
    /**
     * PerformerID is the subject performer (`perf_<uuid>`).
     */
    performer_id?: string;
    /**
     * TopArtistsPlayed are the artists they play most (whose tracks
     * they spin), plays-DESC, capped at N. Linked-play-only.
     */
    top_artists_played?: Array<ArtistCountOut>;
    /**
     * TopGenres are the genres they spin most, plays-DESC, capped at N.
     */
    top_genres?: Array<GenreCountOut>;
    /**
     * TotalPlays is the total play count attributed to this performer
     * in the window.
     */
    total_plays?: number;
    /**
     * Window is the echoed aggregation window (normalized); "all" when
     * no window filter was applied.
     */
    window?: string;
};

