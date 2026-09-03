/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TracklistSetOut = {
    /**
     * ID is the set = recording (= live stream) id, `strm_<uuid>` -
     * the same wire grammar RecordingOut.recording_id emits.
     */
    id?: string;
    /**
     * StartedAt is the set start timestamp (RFC3339 UTC).
     */
    started_at?: string;
    /**
     * Title is the set's DJ-set title; null when unset.
     */
    title?: string;
    /**
     * Visibility is the set's read-audience policy.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

