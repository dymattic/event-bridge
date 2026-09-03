/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FingerprintStatus } from './FingerprintStatus';
import type { SuggestedResolution } from './SuggestedResolution';
export type LibraryMatchFlagOut = {
    /**
     * CanonicalTrackID is the currently-linked canonical track
     * (`trk_<uuid>`), or null when the row is unlinked.
     */
    canonical_track_id?: string;
    /**
     * FingerprintStatus is the print-vs-name corroboration verdict.
     */
    fingerprint_status?: FingerprintStatus;
    /**
     * LibraryTrackID is the caller's library row id (`lib_<uuid>`).
     */
    library_track_id?: string;
    /**
     * MatchConfidence is the matcher's name-match confidence [0,1], or
     * null when unlinked.
     */
    match_confidence?: number;
    /**
     * MatchSource is the matcher arm that linked the row
     * (isrc/title_artist/providers/chromaprint/acoustid), or null.
     */
    match_source?: string;
    /**
     * SuggestedResolution is the action the FE should offer.
     */
    suggested_resolution?: SuggestedResolution;
};

