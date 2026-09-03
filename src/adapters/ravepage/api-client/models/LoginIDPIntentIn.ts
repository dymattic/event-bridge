/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginIDPIntentIn = {
    /**
     * FailureURL is the SPA route Zitadel redirects to on provider failure.
     */
    failure_url?: string;
    /**
     * IDPID is the Zitadel IDP id (from GET /auth/login/idps).
     */
    idp_id?: string;
    /**
     * SuccessURL is the SPA route Zitadel redirects to on provider success;
     * it carries ?id=<idpIntentId>&token=<idpIntentToken> which the SPA feeds
     * into POST /auth/sessions to complete login.
     */
    success_url?: string;
};

