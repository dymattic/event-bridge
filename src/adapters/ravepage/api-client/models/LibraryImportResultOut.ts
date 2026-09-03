/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LibraryFingerprintStatus } from './LibraryFingerprintStatus';
export type LibraryImportResultOut = {
    /**
     * ArtistText as parsed.
     */
    artist_text?: string;
    /**
     * CanonicalTrackID of the link when matched (`trk_<uuid>`), else null.
     */
    canonical_track_id?: string;
    /**
     * FingerprintStatus of the resolved row.
     */
    fingerprint_status?: LibraryFingerprintStatus;
    /**
     * LibraryTrackID is the prefixed id of the upserted row (`lib_<uuid>`).
     */
    library_track_id?: string;
    /**
     * Matched is true when the row auto-linked to a canonical track.
     */
    matched?: boolean;
    /**
     * Title as parsed.
     */
    title?: string;
};

