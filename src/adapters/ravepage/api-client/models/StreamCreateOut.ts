/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StreamCreateOut = {
    /**
     * PublishToken is the short-lived signed token the desktop carries
     * on the publish-token-gated endpoints (heartbeat / end / ingest).
     */
    publish_token?: string;
    /**
     * PublishTokenExpiresAt is the absolute expiry (UTC).
     */
    publish_token_expires_at?: string;
    /**
     * ReplacedStreamID is the prior active stream's prefixed id when a
     * new /streams call auto-ended one; nil otherwise.
     */
    replaced_stream_id?: string;
    /**
     * StartedAt is the new row's started_at.
     */
    started_at?: string;
    /**
     * StreamID is the prefixed wire form `strm_<uuid>`.
     */
    stream_id?: string;
};

