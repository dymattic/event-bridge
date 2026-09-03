/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterHumanIn = {
    /**
     * DisplayName is the user-facing name shown on the profile. Optional -
     * defaults to the username.
     */
    display_name?: string;
    /**
     * Email is the account email; a verification link is sent to it.
     */
    email?: string;
    /**
     * Password is the chosen password (TLS-protected in transit, never logged).
     * Checked against the Zitadel org's password-complexity policy.
     */
    password?: string;
    /**
     * Username is the desired login handle (unique; also a public profile handle).
     */
    username?: string;
};

