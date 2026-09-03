/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DeleteUploadOut = {
    /**
     * Deleted - true when the upload is gone: removed by this call, or
     * already absent. False only when the caller was refused.
     */
    deleted?: boolean;
    /**
     * Reason - `ok` / `not_owner`. Stable enum for observability.
     */
    reason?: 'ok' | 'not_owner';
};

