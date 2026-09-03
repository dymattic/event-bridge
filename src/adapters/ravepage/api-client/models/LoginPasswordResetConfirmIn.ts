/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginPasswordResetConfirmIn = {
    /**
     * Code is the one-time verification code from the reset link.
     */
    code?: string;
    /**
     * NewPassword is the user's chosen password (TLS-protected, never logged).
     */
    new_password?: string;
    /**
     * UserID is the Zitadel user id from the reset link.
     */
    user_id?: string;
};

