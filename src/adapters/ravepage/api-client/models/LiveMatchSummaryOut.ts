/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LiveMatchCandidateOut } from './LiveMatchCandidateOut';
export type LiveMatchSummaryOut = {
    /**
     * Candidates is the full ranked alternate list ordered by `rank
     * ASC`.
     */
    candidates?: Array<LiveMatchCandidateOut>;
    match_attempted_at?: string;
    /**
     * MatchConfidence / MatchConfidencePct / MatchSource /
     * MatchAttemptedAt are nullable denormalisations of the top match.
     * Pointer-typed so absent values wire-emit JSON `null`.
     */
    match_confidence?: number;
    match_confidence_pct?: number;
    match_source?: string;
    set_log_entry_id?: string;
    /**
     * TrackID is the prefixed wire form "trk_<uuid>" of the resolved
     * top match, or nil when the matcher emitted ZERO candidates that
     * cleared the threshold.
     */
    track_id?: string;
};

