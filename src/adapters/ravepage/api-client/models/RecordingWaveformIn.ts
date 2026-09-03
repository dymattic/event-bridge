/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingWaveformIn = {
    /**
     * BandsB64 is base64 of spectral band energies - 3 bytes per peak
     * bucket (low/mid/high, uint8 each). Optional; decoded length must
     * equal exactly 3x the decoded peaks length. Omitted preserves the
     * stored value.
     */
    bands_b64?: string;
    /**
     * DurationMS is the analyzed length. Optional; 0/omitted preserves
     * the stored value.
     */
    duration_ms?: number;
    /**
     * PeaksB64 is base64 of a raw uint8 bucket array. Required,
     * non-empty; decoded size 1..262144 bytes.
     */
    peaks_b64?: string;
};

