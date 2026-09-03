/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerID } from './PerformerID';
export type OauthClaimInitOut = {
    /**
     * AuthURL is the URL the FE should redirect the user to to
     * complete OAuth verification.
     */
    auth_url?: string;
    /**
     * CodeVerifier is the PKCE verifier the FE must persist for the
     * callback.
     */
    code_verifier?: string;
    /**
     * PerformerID echoes the performer being claimed. Wire form
     * `perf_<uuid>`.
     */
    performer_id?: PerformerID;
    /**
     * State is the CSRF state token.
     */
    state?: string;
};

