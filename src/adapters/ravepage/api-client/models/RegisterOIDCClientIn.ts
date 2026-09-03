/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterOIDCClientIn = {
    /**
     * Confidential: true → server-side web app (BASIC auth, returns a
     * client_secret); false (default) → public SPA + PKCE (no secret).
     */
    confidential?: boolean;
    /**
     * DevMode relaxes Zitadel's https/redirect checks. Non-prod only.
     */
    dev_mode?: boolean;
    /**
     * Name is the human label shown in the Zitadel console.
     */
    name?: string;
    /**
     * PostLogoutRedirectURIs are the allowed end-session return URIs.
     */
    post_logout_redirect_uris?: Array<string>;
    /**
     * RedirectURIs is the OIDC callback allow-list (≥1). https, or http
     * only for localhost / when dev_mode is set.
     */
    redirect_uris?: Array<string>;
};

