/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingLoudnessOut = {
    /**
     * IntegratedLUFS is the programme loudness (LUFS); null when unset.
     */
    integrated_lufs?: number;
    /**
     * LRA is the loudness range (LU); null when unset.
     */
    lra?: number;
    /**
     * MomentaryB64 is base64 of the little-endian float32 momentary
     * series; omitted when never uploaded.
     */
    momentary_b64?: string;
    /**
     * RecordingID is the recording (`strm_<uuid>`).
     */
    recording_id?: string;
    /**
     * StepMS is the momentary-series sample interval; null when unset.
     */
    step_ms?: number;
    /**
     * TruePeakDB is the true-peak maximum (dBTP); null when unset.
     */
    true_peak_db?: number;
    /**
     * UpdatedAt is when the loudness was last written (RFC3339 UTC).
     */
    updated_at?: string;
};

