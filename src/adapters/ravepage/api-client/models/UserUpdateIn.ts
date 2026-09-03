/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserUpdateIn = {
    /**
     * Email - optional new email. Uniqueness enforced.
     */
    email?: string;
    /**
     * Password - optional. When supplied, only the local hashed_password
     * column is updated. Login credentials live in the Zitadel IdP and
     * are NOT changed here - manage the login password via Zitadel.
     */
    password?: string;
    /**
     * Username - optional new handle. Uniqueness enforced.
     */
    username?: string;
};

