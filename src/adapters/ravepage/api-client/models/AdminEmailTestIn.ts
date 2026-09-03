/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminEmailTestIn = {
    /**
     * Body is the plain-text body. Required.
     */
    body?: string;
    /**
     * Subject is the email subject. Required.
     */
    subject?: string;
    /**
     * To is the recipient. Optional; falls back to current user's
     * email when omitted .
     */
    to?: string;
};

