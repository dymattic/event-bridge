/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackFingerprintOut = {
    /**
     * AcoustidID is the AcoustID recording UUID when the fingerprint
     * was sourced from or matched against AcoustID. nil otherwise.
     */
    acoustid_id?: string;
    /**
     * CreatedAt is the row creation timestamp (RFC3339 UTC).
     */
    created_at?: string;
    /**
     * CreatedByUserID is the user who uploaded or triggered the
     * fingerprint compute. nil for system-created rows
     * (server_worker pass or acoustid_match pass).
     */
    created_by_user_id?: string;
    /**
     * DurationMS is the duration of the recording the fingerprint
     * covers, in milliseconds. Required by Chromaprint's lookup
     * algorithm.
     */
    duration_ms?: number;
    /**
     * ID is the canonical fingerprint row id. ID`.
     */
    id?: string;
    /**
     * SampleRate is the sample rate used to compute the fingerprint.
     * Chromaprint's canonical config is 11025; other values should
     * not be mixed in the same index.
     */
    sample_rate?: number;
    /**
     * Source identifies the fingerprint's origin:
     *
     * - "server_worker" - computed by our background worker
     * against R2/MinIO audio.
     * - "client_upload" - DJ desktop / mobile client computed
     * locally (`fpcalc -raw -base64`).
     * - "acoustid_match" - received from an AcoustID lookup
     * response.
     * the field description but the column is unconstrained free
     * text ( Go port mirrors -
     * any non-empty string up to 40 codepoints is accepted on the
     * write path and emitted verbatim on the read path.
     */
    source?: string;
    /**
     * SourceMediaUploadID points back at the original `media_uploads`
     * row when known (e.g. the worker-computed branch). nil when
     * unknown (e.g. client_upload arms that have no server-side
     * media artifact, or acoustid_match arms).
     */
    source_media_upload_id?: string;
    /**
     * TrackID is the canonical track this fingerprint is attached to.
     */
    track_id?: string;
};

