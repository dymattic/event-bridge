/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginBeginOut = {
    /**
     * AuthRequestID is the Zitadel auth-request id (v2 ids are `V2_`-prefixed).
     */
    auth_request_id?: string;
    /**
     * ExpiresIn is how many seconds the attempt stays finalizable. After
     * that, begin again.
     */
    expires_in?: number;
};

