/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FollowStatusOut = {
    /**
     * EntityID is the polymorphic target identifier.
     */
    entity_id?: string;
    /**
     * EntityType is the polymorphic kind tag.
     */
    entity_type?: string;
    /**
     * FollowedBy reports the REVERSE direction: whether this entity
     * follows the authenticated caller back. Together with
     * `following` it gives the caller mutual-follow state in one
     * request, which is the precondition for sending a friend
     * request (`POST /friends/requests/{user_id}`).
     *
     * Only meaningful for `entity_type=user`; a club or group does
     * not follow people, so every other entity type reports `false`.
     * Anonymous callers get `false`.
     */
    followed_by?: boolean;
    /**
     * FollowerCount is the total number of followers for this
     * entity across all users.
     */
    follower_count?: number;
    /**
     * Following reports whether the authenticated caller currently
     * follows this entity.
     */
    following?: boolean;
};

