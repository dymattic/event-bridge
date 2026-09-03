/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LikeToggleOut = {
    /**
     * LikeCount is the updated total like count after the toggle.
     */
    like_count?: number;
    /**
     * Liked is the new like state after the toggle. `true` after
     * POST, `false` after DELETE.
     */
    liked?: boolean;
};

