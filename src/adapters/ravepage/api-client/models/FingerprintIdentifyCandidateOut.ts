/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FingerprintIdentifyCandidateOut = {
    /**
     * BitErrorRate is the fraction of differing bits over the aligned
     * value prefix (lower is closer).
     */
    bit_error_rate?: number;
    /**
     * Confidence is the acoustic-match score in [0, 0.99]; higher is a
     * closer recording match.
     */
    confidence?: number;
    /**
     * ConfidencePct is Confidence rounded to a 0..100 int for UI.
     */
    confidence_pct?: number;
    /**
     * FingerprintID is the specific stored fingerprint row that matched.
     */
    fingerprint_id?: string;
    /**
     * OverlapSegments is how many coarse subhashes the query shared
     * with this fingerprint (the pool-gate signal).
     */
    overlap_segments?: number;
    track_id?: string;
};

