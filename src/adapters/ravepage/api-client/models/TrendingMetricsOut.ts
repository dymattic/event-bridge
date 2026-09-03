/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArtistCountOut } from './ArtistCountOut';
import type { GenreCountOut } from './GenreCountOut';
import type { MetricsWindow } from './MetricsWindow';
export type TrendingMetricsOut = {
    /**
     * TopArtists are the most-played credited artists, plays-DESC,
     * capped at N. Linked-play-only (unlinked plays carry no resolvable
     * artist).
     */
    top_artists?: Array<ArtistCountOut>;
    /**
     * TopGenres are the most-played genres, plays-DESC, capped at N.
     */
    top_genres?: Array<GenreCountOut>;
    /**
     * Window is the echoed aggregation window (normalized).
     */
    window?: MetricsWindow;
};

