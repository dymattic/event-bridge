/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendTransactionalOut = {
    /**
     * Category - echoed category (post-validation).
     */
    category?: string;
    /**
     * Success - true iff the SMTP relay handoff completed without
     * permanent error. Transient retries are NOT surfaced - the
     * producer returns a 503 in that case.
     */
    success?: boolean;
    /**
     * To - echoed recipient (post-validation).
     */
    to?: string;
};

