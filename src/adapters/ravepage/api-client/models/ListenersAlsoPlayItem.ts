/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HydratedTrack } from './HydratedTrack';
export type ListenersAlsoPlayItem = {
    /**
     * ArtistCreditName is the display artist credit from ListenBrainz.
     */
    artist_credit_name?: string;
    /**
     * RecordingMBID is the similar recording's MusicBrainz id.
     */
    recording_mbid?: string;
    /**
     * RecordingName is the display title from ListenBrainz (stub
     * fallback when unresolved; canonical title in track wins when set).
     */
    recording_name?: string;
    /**
     * Resolved is true when the recording maps to a canonical track in
     * OUR catalog (track is then non-null).
     */
    resolved?: boolean;
    /**
     * Score is the ListenBrainz co-listen strength (higher = stronger).
     */
    score?: number;
    /**
     * Track is the hydrated canonical track (id/title/artists/provider
     * playability); null for unresolved external stubs.
     */
    track?: HydratedTrack;
};

