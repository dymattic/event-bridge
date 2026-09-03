/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EntityLinkResponse = {
    /**
     * AlreadyInTargetState - true when the row was already linked
     * (op=link) or already absent (op=unlink). False when a mutation
     * happened. The caller can branch on this for analytics; the wire
     * status is 200 either way for "link" but 404 for "unlink + not
     * found" .
     */
    already_in_target_state?: boolean;
    /**
     * ResolvedPlatformUUID - the cache row UUID the link table now
     * references. Useful for logging + idempotency-key construction
     * on the caller side.
     */
    resolved_platform_uuid?: string;
};

