/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricBlockOut = {
    /**
     * BlockedUserID of the entry, prefixed.
     */
    blocked_user_id?: string;
    /**
     * CreatedAt is when the block was added, RFC3339.
     */
    created_at?: string;
    /**
     * OwnerID of the entry, prefixed.
     */
    owner_id?: string;
    /**
     * OwnerKind of the entry.
     */
    owner_kind?: 'user' | 'group';
};

