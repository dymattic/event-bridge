/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MediaCollectionShareOut = {
    /**
     * CollectionID is the parent collection (`mcol_<uuid>`).
     */
    collection_id?: string;
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * CreatedByUserID is the grantor user identifier. Nil for
     * rows predating the column.
     */
    created_by_user_id?: string;
    /**
     * ExpiresAt is the optional share-expiry timestamp.
     */
    expires_at?: string;
    /**
     * ID is the share row identifier (Phase A - not yet a first-
     * class prefixed resource; bare UUID on the wire).
     */
    id?: string;
    /**
     * Permission is the share role.
     */
    permission?: 'viewer' | 'editor';
    /**
     * TargetID is the principal identifier (prefixed wire form).
     */
    target_id?: string;
    /**
     * TargetType is the principal kind.
     */
    target_type?: 'user' | 'group';
};

