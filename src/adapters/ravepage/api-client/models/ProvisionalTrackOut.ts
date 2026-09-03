/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProvisionalTrackOut = {
    /**
     * CreatedAt is the mint time (RFC3339).
     */
    created_at?: string;
    /**
     * DistinctReporters from the minted cluster; null when unknown.
     */
    distinct_reporters?: number;
    /**
     * IsCanonical flips true after promote.
     */
    is_canonical?: boolean;
    /**
     * Observations from the minted cluster; null when unknown.
     */
    observations?: number;
    /**
     * Title is the minted display title.
     */
    title?: string;
    /**
     * TrackID is the prefixed id (`trk_<uuid>`).
     */
    track_id?: string;
};

