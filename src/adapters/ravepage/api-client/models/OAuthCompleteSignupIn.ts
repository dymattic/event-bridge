/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OAuthCompleteSignupIn = {
    /**
     * Email is the user-supplied email collected by the FE.
     */
    email?: string;
    /**
     * FrontendRedirectURI is the FE landing target after the signup is
     * finalized. Same shape as POST /auth/{provider}/init.
     */
    frontend_redirect_uri?: string;
    /**
     * SignupToken is the value the FE received from the callback
     * redirect's `signup_token` query param. Opaque + HMAC-signed.
     */
    signup_token?: string;
};

