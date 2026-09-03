/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OutboxDepthResponse = {
    /**
     * OldestUnpublishedAgeSeconds - now() minus the oldest unpublished
     * row's `created_at`, in whole seconds. nil when UnpublishedRows==0
     * (min(created_at) is NULL). The primary staleness signal: a growing
     * age means the relay is falling behind (it polls ~1s).
     */
    oldest_unpublished_age_seconds?: number;
    /**
     * UnpublishedRows - rows with `published_at IS NULL` at read time.
     * Spikes transiently during write bursts; the relay drains them.
     */
    unpublished_rows?: number;
};

