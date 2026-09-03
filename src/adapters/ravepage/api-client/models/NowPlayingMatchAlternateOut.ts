/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HydratedTrack } from './HydratedTrack';
export type NowPlayingMatchAlternateOut = {
    /**
     * Confidence is the candidate's score in [0,1].
     */
    confidence?: number;
    /**
     * ConfidencePct is Confidence as a clamped 0-100 integer.
     */
    confidence_pct?: number;
    /**
     * Source is the matcher that produced the candidate.
     */
    source?: string;
    /**
     * Track is the hydrated canonical candidate track.
     */
    track?: HydratedTrack;
};

