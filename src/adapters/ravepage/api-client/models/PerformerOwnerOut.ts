/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PerformerOwnerOut = {
    /**
     * Exists is true iff a `performers` row matched the path param. scalar_one_or_none()` truthy → row present; falsy → row
     * absent.
     */
    exists?: boolean;
    /**
     * OwnerUserID is the resolved `performers.user_id` value when
     * `exists` is true AND the column is non-null. nil when (a) the
     * row is absent OR (b) the row is present but unclaimed
     * (`user_id IS NULL` per
     * Bare UUID string when present (no `usr_` prefix).
     */
    owner_user_id?: string;
    /**
     * PerformerID echoes the request's path param so the caller can
     * correlate the response. Bare UUID string (no `perf_` prefix -
     * the contract is internal-mesh-only).
     */
    performer_id?: string;
};

