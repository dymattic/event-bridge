/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingLoudnessIn = {
    /**
     * IntegratedLUFS is the programme loudness (LUFS). Values at or
     * below -70 denote silence (-inf is conventionally sent as -99);
     * accepted verbatim, never clamped.
     */
    integrated_lufs?: number;
    /**
     * LRA is the loudness range (LU).
     */
    lra?: number;
    /**
     * MomentaryB64 is base64 of a little-endian float32 array - one
     * momentary-loudness sample per step_ms.
     */
    momentary_b64?: string;
    /**
     * StepMS is the momentary-series sample interval in milliseconds.
     * Per-recording: analysers widen the grid for long sets, so this is
     * stored as given and never validated against a fixed value.
     */
    step_ms?: number;
    /**
     * TruePeakDB is the true-peak maximum (dBTP).
     */
    true_peak_db?: number;
};

