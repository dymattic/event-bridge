/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ComponentRatingOut = {
    /**
     * CreatedAt is the rating timestamp.
     */
    created_at?: string;
    /**
     * ID is the rating row's bare UUID.
     */
    id?: string;
    /**
     * Rating is the score (1..5).
     */
    rating?: number;
    /**
     * Review is the optional review text.
     */
    review?: string;
    /**
     * UserID is the rater's prefixed user id.
     */
    user_id?: string;
};

