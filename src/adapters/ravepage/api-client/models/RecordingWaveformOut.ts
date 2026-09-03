/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingWaveformOut = {
    /**
     * BandsB64 is base64 of the spectral bands (3 bytes per bucket);
     * omitted when never uploaded.
     */
    bands_b64?: string;
    /**
     * Buckets is the decoded peak-bucket count.
     */
    buckets?: number;
    /**
     * DurationMS is the analyzed length; null when unknown.
     */
    duration_ms?: number;
    /**
     * PeaksB64 is base64 of the raw uint8 bucket array.
     */
    peaks_b64?: string;
    /**
     * RecordingID is the recording (`strm_<uuid>`).
     */
    recording_id?: string;
    /**
     * UpdatedAt is when the waveform was last written (RFC3339 UTC).
     */
    updated_at?: string;
};

