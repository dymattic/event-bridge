/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProcessingTaskStopOut = {
    /**
     * CleanedFiles is the count of temp files removed (always 0 in
     * Go port - see DTO docstring).
     */
    cleaned_files?: number;
    message?: string;
    /**
     * Success is true when the upload was actually transitioned to
     * `cancelled`; false when it was already in a terminal state.
     */
    success?: boolean;
};

