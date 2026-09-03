/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Problem = {
    /**
     * allow-listed keys, code lives here
     */
    details?: Record<string, any>;
    /**
     * user-safe text
     */
    message?: string;
    /**
     * always "error"
     */
    status?: 'error';
    /**
     * gateway-assigned
     */
    trace_id?: string;
};

