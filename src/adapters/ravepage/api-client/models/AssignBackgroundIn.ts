/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AssignBackgroundIn = {
    /**
     * CallerIsAdmin - bypasses upload-ownership check when true.
     */
    caller_is_admin?: boolean;
    /**
     * CallerUserID - bare UUID of the user issuing the assign (must
     * equal `{user_id}` path param OR caller must be admin).
     */
    caller_user_id?: string;
    /**
     * MediaUploadID - UUID of the upload to assign. nil to clear.
     */
    media_upload_id?: string;
};

