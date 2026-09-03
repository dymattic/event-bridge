/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserCreateIn = {
    /**
     * Email is optional but recommended (gates the verify-email follow-up).
     */
    email?: string;
    /**
     * Password is optional.
     */
    password?: string;
    /**
     * Username is required. Non-empty, no whitespace.
     */
    username?: string;
};

