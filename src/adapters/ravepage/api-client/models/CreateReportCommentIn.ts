/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateReportCommentIn = {
    /**
     * Body is the comment body. Required, 1..10000 chars.
     */
    body?: string;
    /**
     * IsInternal asks for an admin-only internal comment. Silently
     * downgraded to false for non-admin callers .
     */
    is_internal?: boolean;
};

