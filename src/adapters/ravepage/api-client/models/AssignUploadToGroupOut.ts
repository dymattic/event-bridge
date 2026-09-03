/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignUploadToGroupRow } from './AssignUploadToGroupRow';
export type AssignUploadToGroupOut = {
    /**
     * Assignment - the result row when ok=true. nil otherwise.
     */
    assignment?: AssignUploadToGroupRow;
    /**
     * OK - true when the assignment landed.
     */
    ok?: boolean;
    /**
     * Reason - `ok` / `upload_not_found` / `not_owner`. Stable enum.
     */
    reason?: 'ok' | 'upload_not_found' | 'not_owner';
};

