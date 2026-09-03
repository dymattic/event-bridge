/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackFingerprintCreateIn = {
    /**
     * AcoustidID is the AcoustID recording UUID when the
     * fingerprint was sourced from or matched against AcoustID.
     */
    acoustid_id?: string;
    /**
     * DurationMS is the total duration of the recording the
     * fingerprint covers, in milliseconds. : REQUIRED,
     * `Field(ge=1)` -
     */
    duration_ms?: number;
    /**
     * FingerprintB64 is the base64-encoded Chromaprint payload the
     * client computed locally (`fpcalc -raw -base64` or equivalent).
     * URL-safe and standard alphabets are both accepted by the
     * decoder. : REQUIRED, `Field(min_length=1)` -
     */
    fingerprint_b64?: string;
    /**
     * SampleRate is the sample rate the fingerprint was computed at.
     * Chromaprint's canonical config is 11025; other values should
     * not be mixed in the same index.
     */
    sample_rate?: number;
    /**
     * SourceMediaUploadID points back at the original `media_uploads`
     * row when the client wants to associate the fingerprint with a
     * previously-uploaded media artifact. md`. nil-pointer = absent.
     */
    source_media_upload_id?: string;
};

