/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AssignUploadToGroupIn = {
    /**
     * GroupID - the group to attach the upload to. Bare UUID or
     * `grp_<uuid>`.
     */
    group_id?: string;
    /**
     * IsAdmin - caller's admin flag from the gateway-signed claim.
     */
    is_admin?: boolean;
    /**
     * UserID - the caller. Bare UUID or `usr_<uuid>`.
     */
    user_id?: string;
};

