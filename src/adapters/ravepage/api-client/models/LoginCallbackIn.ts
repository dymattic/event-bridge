/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginCallbackIn = {
    /**
     * AuthRequestID is the Zitadel auth request id from the authorize redirect.
     */
    auth_request_id?: string;
    /**
     * SessionID + SessionToken come from POST /auth/sessions.
     */
    session_id?: string;
    session_token?: string;
};

