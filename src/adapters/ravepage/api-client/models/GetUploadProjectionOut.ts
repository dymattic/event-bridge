/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UploadProjection } from './UploadProjection';
export type GetUploadProjectionOut = {
    /**
     * OK - true when the upload was found AND is in a state the
     * caller is allowed to consume. The current implementation
     * returns ok=true for any pipeline_status - callers decide if
     * they want to surface tombstoned uploads. (groups's background
     * reader treats blob_missing as "background not found".)
     */
    ok?: boolean;
    /**
     * Reason - `ok` / `upload_not_found`. Stable enum for
     * observability.
     */
    reason?: 'ok' | 'upload_not_found';
    /**
     * Upload - the narrow projection. nil when the upload is not
     * found (HTTP 200 + ok=false; callers map to 404). This shape
     * mirrors Contract 2 (`UploadAttachableOut.Upload`) so callers
     * can share serialization helpers.
     */
    upload?: UploadProjection;
};

