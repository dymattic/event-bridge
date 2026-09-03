/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HydratedTrack } from './HydratedTrack';
import type { NowPlayingMatchAlternateOut } from './NowPlayingMatchAlternateOut';
export type NowPlayingMatchOut = {
    /**
     * Alternates are the runner-up candidates, hydrated, best-first.
     * Never null (empty slice when none).
     */
    alternates?: Array<NowPlayingMatchAlternateOut>;
    /**
     * AutoLinked is true when the score cleared the auto-link threshold
     * and the set-log entry's track_id was written.
     */
    auto_linked?: boolean;
    /**
     * Confidence is the matcher chain's top-candidate score in [0,1].
     */
    confidence?: number;
    /**
     * ConfidencePct is Confidence as a clamped 0-100 integer.
     */
    confidence_pct?: number;
    /**
     * Source is the winning matcher: isrc | title_artist | providers |
     * chromaprint | acoustid.
     */
    source?: string;
    /**
     * Track is the hydrated canonical track. CanonicalTrackID is always
     * set; Title/Artists/Providers populate when catalog hydration
     * succeeds (ids-only when the hydrator is absent or the track row
     * is gone).
     */
    track?: HydratedTrack;
};

