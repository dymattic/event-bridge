/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StreamTokenRefreshOut = {
    /**
     * PublishToken is the freshly-minted short-lived token (same claims +
     * scope + jti as the presented one, new TTL).
     */
    publish_token?: string;
    /**
     * PublishTokenExpiresAt is the new absolute expiry (UTC).
     */
    publish_token_expires_at?: string;
    /**
     * StreamID is the prefixed wire form `strm_<uuid>`, echoed unchanged.
     */
    stream_id?: string;
};

