/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingTracklistPutAckOut = {
    /**
     * Cleared is true when the request emptied the stored tracklist, so
     * the read falls back to the play-log-derived list.
     */
    cleared?: boolean;
    /**
     * Count is the number of items stored. 0 when `cleared`.
     */
    count?: number;
    /**
     * RecordingID is the recording (`strm_<uuid>`).
     */
    recording_id?: string;
    /**
     * TracklistID is the stored tracklist (`tl_<uuid>`). Stable across
     * replaces - a re-publish keeps the same id. EMPTY when `cleared`
     * is true (the recording no longer has a stored tracklist).
     */
    tracklist_id?: string;
};

