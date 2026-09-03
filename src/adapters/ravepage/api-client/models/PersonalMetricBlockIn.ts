/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricBlockIn = {
    /**
     * BlockedUserID is the viewer to block, prefixed or bare UUID.
     */
    blocked_user_id?: string;
    /**
     * OwnerID is the group id when owner_kind=group; ignored for
     * owner_kind=user, which always means the caller.
     */
    owner_id?: string;
    /**
     * OwnerKind is whose stats are being protected: `user` (the
     * caller) or `group` (a group the caller administers).
     */
    owner_kind?: 'user' | 'group';
};

