/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginFinalizeIn = {
    /**
     * AuthRequestID is the id from POST /auth/login/begin.
     */
    auth_request_id?: string;
    /**
     * SessionID + SessionToken come from POST /auth/sessions (newest token
     * if the session was advanced with a second factor).
     */
    session_id?: string;
    session_token?: string;
};

