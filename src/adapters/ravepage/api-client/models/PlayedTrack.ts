/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HydratedTrack } from './HydratedTrack';
export type PlayedTrack = {
    /**
     * Deck is the DJ-software deck label when known (e.g. "A"/"B").
     */
    deck?: string;
    /**
     * Linked is true when the play resolved to a canonical track.
     */
    linked?: boolean;
    /**
     * PlayedAt is the RFC3339 UTC play time.
     */
    played_at?: string;
    /**
     * Position is the 1-based order within the list (by played_at).
     */
    position?: number;
    /**
     * RawArtist is the library row's verbatim artist text.
     */
    raw_artist?: string;
    /**
     * RawTitle is the library row's verbatim title (display fallback).
     */
    raw_title?: string;
    /**
     * Track is the hydrated canonical track (CanonicalTrackID null when
     * unlinked - RawTitle/RawArtist then carry the display fallback).
     */
    track?: HydratedTrack;
};

