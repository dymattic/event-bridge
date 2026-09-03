/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CollectionShareAccessOut = {
    /**
     * Allowed - true iff an active (non-expired) MediaCollectionShare
     * row grants the caller view access to a collection containing
     * this upload, either directly (target_type=user, target_id=caller)
     * or via a group the caller is a member of (target_type=group, any
     * membership role - the table carries no min-role floor).
     */
    allowed?: boolean;
};

