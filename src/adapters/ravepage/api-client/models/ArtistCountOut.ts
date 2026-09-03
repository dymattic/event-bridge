/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ArtistCountOut = {
    /**
     * CreditedName is the denormalized credit text from track_artists,
     * null only when the row carried no credit text.
     */
    credited_name?: string;
    /**
     * PerformerID is the linked performer (`perf_<uuid>`), null for a
     * credit-only artist row (no platform performer linked).
     */
    performer_id?: string;
    /**
     * PerformerName is the linked performer's display name, null when
     * unlinked or the cross-worker name lookup was unavailable.
     */
    performer_name?: string;
    /**
     * Plays is the number of plays crediting this artist in the window.
     */
    plays?: number;
};

