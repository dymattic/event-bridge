/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryBulkRowStatus } from './LibraryBulkRowStatus';
import type { LibraryFingerprintStatus } from './LibraryFingerprintStatus';
export type LibraryBulkResultOut = {
    /**
     * CanonicalTrackID of the resolved link (`trk_<uuid>`), null when unmatched.
     */
    canonical_track_id?: string;
    /**
     * Error detail when status=error, else null.
     */
    error?: string;
    /**
     * FingerprintStatus of the resolved row (empty on error).
     */
    fingerprint_status?: LibraryFingerprintStatus;
    /**
     * Index into the request's `tracks` array.
     */
    index?: number;
    /**
     * LibraryTrackID of the upserted row (`lib_<uuid>`; empty on error).
     */
    library_track_id?: string;
    /**
     * MatchConfidence of the link (0..1, null when unmatched).
     */
    match_confidence?: number;
    /**
     * MatchSource is the matcher arm that linked (null when unmatched).
     */
    match_source?: string;
    /**
     * Status: created | updated | error.
     */
    status?: LibraryBulkRowStatus;
};

