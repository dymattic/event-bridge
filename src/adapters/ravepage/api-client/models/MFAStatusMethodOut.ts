/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MFAStatusMethodOut = {
    created_at?: string;
    /**
     * prefixed: "mfa_<uuid>"
     */
    id?: string;
    is_primary?: boolean;
    is_verified?: boolean;
    label?: string;
    method?: string;
    sso_provider?: string;
};

