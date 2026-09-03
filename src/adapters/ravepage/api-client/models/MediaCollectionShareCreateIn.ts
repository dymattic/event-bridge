/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MediaCollectionShareCreateIn = {
    /**
     * ExpiresAt is the optional share-expiry timestamp.
     */
    expires_at?: string;
    /**
     * Permission is the share role granted - defaults to `viewer`.
     */
    permission?: 'viewer' | 'editor';
    /**
     * TargetID is the principal identifier. Accepts the prefixed
     * wire form matching TargetType (`usr_…` / `grp_…`) or a bare
     * UUID. Required.
     */
    target_id?: string;
    /**
     * TargetType is the principal kind - `user` / `group`. Required.
     */
    target_type?: 'user' | 'group';
};

