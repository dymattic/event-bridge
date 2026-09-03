/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OIDCClientRegisteredOut = {
    /**
     * AppID is the Zitadel application id (use it to DELETE the client).
     */
    app_id?: string;
    /**
     * ClientID is the OIDC client_id the registrant configures in their app.
     */
    client_id?: string;
    /**
     * ClientSecret is non-empty only for confidential clients. One-shot.
     */
    client_secret?: string;
    /**
     * Name is the human label.
     */
    name?: string;
    /**
     * RedirectURIs echoes the registered callback allow-list.
     */
    redirect_uris?: Array<string>;
};

