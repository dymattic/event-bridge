/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WaveformOut = {
    /**
     * BandsB64 - base64 spectral band energies, 3 bytes per peak
     * bucket (low/mid/high, uint8 each); omitted when none stored.
     */
    bands_b64?: string;
    /**
     * Buckets is the decoded peak count.
     */
    buckets?: number;
    /**
     * DropsMS - the library row's DJ-marked drop points (ms from track
     * start, sorted ASC), served alongside the peaks so waveform UIs
     * render drop markers in one read. Empty = none synced.
     */
    drops_ms?: Array<number>;
    /**
     * DurationMS of the analyzed audio, null when not carried.
     */
    duration_ms?: number;
    /**
     * PeaksB64 is the base64-encoded raw uint8 bucket array.
     */
    peaks_b64?: string;
};

