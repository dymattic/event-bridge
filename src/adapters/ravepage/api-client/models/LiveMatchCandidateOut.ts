/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LiveMatchCandidateOut = {
    /**
     * Confidence is the raw matcher score in [0.0, 1.0].
     */
    confidence?: number;
    /**
     * ConfidencePct is the server-side rounded percent in [0, 100].
     */
    confidence_pct?: number;
    /**
     * Evidence is the pass-through JSONB payload. Pointer-to-
     * json.RawMessage so the wire emits `null` when absent + verbatim
     * JSON bytes when present.
     */
    evidence?: Array<number>;
    /**
     * Rank is the 0-based ordinal - rank 0 is the top candidate.
     */
    rank?: number;
    /**
     * Source is the matcher name that produced this candidate.
     */
    source?: string;
    track_id?: string;
};

