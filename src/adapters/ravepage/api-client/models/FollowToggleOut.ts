/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FollowToggleOut = {
    /**
     * FollowerCount is the updated follower count after the toggle.
     */
    follower_count?: number;
    /**
     * Following is the new follow state after the toggle. `true`
     * after POST, `false` after DELETE.
     */
    following?: boolean;
};

