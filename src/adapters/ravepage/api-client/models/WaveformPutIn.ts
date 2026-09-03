/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WaveformPutIn = {
    /**
     * BandsB64 - optional base64 of spectral band energies, 3 bytes
     * per peak bucket (low/mid/high, uint8 each); decoded length MUST
     * equal 3× the decoded peaks length. Omitted/empty preserves
     * previously stored bands.
     */
    bands_b64?: string;
    /**
     * DurationMS of the analyzed audio (optional; 0 = not carried -
     * preserves a previously stored value).
     */
    duration_ms?: number;
    /**
     * PeaksB64 is the base64-encoded raw uint8 bucket array (typically
     * 8192 buckets; decoded size capped at 65536 bytes).
     */
    peaks_b64?: string;
};

