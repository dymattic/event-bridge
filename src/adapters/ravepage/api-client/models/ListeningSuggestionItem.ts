/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HydratedTrack } from './HydratedTrack';
import type { SuggestionSeedRef } from './SuggestionSeedRef';
export type ListeningSuggestionItem = {
    /**
     * Agreement is how many distinct seed tracks point at this
     * suggestion.
     */
    agreement?: number;
    /**
     * ArtistCreditName is the display artist credit from ListenBrainz.
     */
    artist_credit_name?: string;
    /**
     * BecauseOf is the top contributing seed track.
     */
    because_of?: SuggestionSeedRef;
    /**
     * RecordingMBID is the suggested recording's MusicBrainz id.
     */
    recording_mbid?: string;
    /**
     * RecordingName is the display title from ListenBrainz (stub
     * fallback; canonical title in track wins when set).
     */
    recording_name?: string;
    /**
     * Resolved is true when the recording maps to a canonical track in
     * OUR catalog (track is then non-null).
     */
    resolved?: boolean;
    /**
     * Score is the aggregate suggestion strength:
     * Σ_seeds(lb_score × recency_decay) × agreement. Comparable within
     * one response only.
     */
    score?: number;
    /**
     * Track is the hydrated canonical track; null for unresolved stubs.
     */
    track?: HydratedTrack;
};

