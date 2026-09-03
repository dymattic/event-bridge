/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingAudioOut = {
    /**
     * AudioReady is true once the upload is attached and verified.
     */
    audio_ready?: boolean;
    /**
     * DurationMS is the upload's probed duration; null when unknown.
     */
    duration_ms?: number;
    /**
     * MediaUploadID is the attached upload (`upl_<uuid>`).
     */
    media_upload_id?: string;
    /**
     * RecordingID is the recording (`strm_<uuid>`).
     */
    recording_id?: string;
};

