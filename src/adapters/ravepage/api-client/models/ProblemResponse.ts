/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProblemResponse = {
    /**
     * Details carries the allow-listed structured fields, including
     * the stable `code` key (e.g. EXTERNAL_UNAVAILABLE).
     */
    details?: Record<string, any>;
    /**
     * Message is user-safe error text.
     */
    message?: string;
    /**
     * Status is always the literal string "error".
     */
    status?: 'error';
    /**
     * TraceID is the gateway-assigned request id (also returned in the
     * X-Trace-Id response header).
     */
    trace_id?: string;
};

