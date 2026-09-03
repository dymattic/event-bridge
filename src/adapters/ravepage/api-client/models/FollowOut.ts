/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FollowID } from './FollowID';
export type FollowOut = {
    /**
     * CreatedAt is the follow-creation timestamp in RFC3339Nano /
     * ISO-8601 with timezone offset.
     */
    created_at?: string;
    entity_id?: string;
    /**
     * EntityType is the polymorphic kind tag. One of:
     * user | group | performer | event | label. ..]` enforces this set at the input boundary; the
     * wire shape is a plain string.
     */
    entity_type?: string;
    follower_user_id?: string;
    /**
     * ID is the prefixed follow-row identifier (`flw_<uuid>`).
     */
    id?: FollowID;
};

