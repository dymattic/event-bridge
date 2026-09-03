/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LikeStatusOut = {
    /**
     * ContentID is the polymorphic target identifier.
     */
    content_id?: string;
    /**
     * ContentType is the polymorphic kind tag.
     */
    content_type?: string;
    /**
     * LikeCount is the total number of likes on this content
     * across all users.
     */
    like_count?: number;
    /**
     * LikedByMe reports whether the authenticated caller has
     * liked this content.
     */
    liked_by_me?: boolean;
};

