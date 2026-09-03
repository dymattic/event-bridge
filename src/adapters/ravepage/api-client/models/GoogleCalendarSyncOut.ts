/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GoogleCalendarSyncOut = {
    created?: number;
    deleted?: number;
    /**
     * Failed counts per-event pushes that errored non-fatally (e.g. a
     * deleted-event 404 self-healed, a rate-limit, or a transient 5xx).
     * The run continued past these; a non-zero value ≠ run failure.
     */
    failed?: number;
    skipped?: number;
    updated?: number;
};

