/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UploadStatusFilter } from './UploadStatusFilter';
import type { UserMediaUploadItem } from './UserMediaUploadItem';
export type UserUploadsResponse = {
    /**
     * AppliedFilter echoes the `status` query filter back to the
     * caller. Null when no filter was supplied. Carries the
     * UploadStatusFilter named-enum schema for FE codegen.
     */
    applied_filter?: UploadStatusFilter;
    has_more?: boolean;
    limit?: number;
    offset?: number;
    total?: number;
    total_count?: number;
    uploads?: Array<UserMediaUploadItem>;
};

