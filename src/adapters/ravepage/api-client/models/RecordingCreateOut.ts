/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingCreateOut = {
    /**
     * RecordingID is the new recording (`strm_<uuid>`).
     */
    recording_id?: string;
    /**
     * TracklistID is the stored tracklist created alongside
     * (`tl_<uuid>`); null when the payload carried no tracklist.
     */
    tracklist_id?: string;
};

