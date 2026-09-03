/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VerifyClientAppRequest = {
    /**
     * ClientID - the public client identifier sent by the upstream
     * caller in the `X-Client-ID` header. 32-char hex string in
     * production `).
     */
    client_id?: string;
    /**
     * ClientSecret - the plaintext secret sent by the upstream caller
     * in the `X-Client-Secret` header. URL-safe base64 in production `).
     */
    client_secret?: string;
};

