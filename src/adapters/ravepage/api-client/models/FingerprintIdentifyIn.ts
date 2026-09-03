/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FingerprintIdentifyIn = {
    /**
     * FingerprintB64 is the client-computed Chromaprint fingerprint
     * (fpcalc -raw -base64), URL-safe or standard base64. Required.
     */
    fingerprint_b64?: string;
    /**
     * Limit caps returned candidates (default 5, max 25). Optional.
     */
    limit?: number;
};

