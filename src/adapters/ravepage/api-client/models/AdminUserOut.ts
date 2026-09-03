/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminUserOut = {
    created_at?: string;
    email?: string;
    email_verified?: boolean;
    /**
     * prefixed: "usr_<uuid>"
     */
    id?: string;
    is_admin?: boolean;
    mfa_enabled?: boolean;
    status?: 'active' | 'suspended' | 'banned' | 'deleted';
    status_changed_at?: string;
    status_changed_by_user_id?: string;
    status_reason?: string;
    suspended_until?: string;
    updated_at?: string;
    username?: string;
};

