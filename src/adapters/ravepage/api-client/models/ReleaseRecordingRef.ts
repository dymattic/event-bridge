/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReleaseRecordingRef = {
    /**
     * RecordingID is the linked recording id (`strm_<uuid>`).
     */
    recording_id?: string;
    /**
     * StartedAt is the set start timestamp (RFC3339 UTC).
     */
    started_at?: string;
    /**
     * Title is the recording's DJ-set title; null when unset.
     */
    title?: string;
    /**
     * Visibility is the recording's read-audience policy.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
};

