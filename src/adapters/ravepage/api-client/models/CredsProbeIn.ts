/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CredsProbeIn = {
    /**
     * AuthCookie - VRChat `auth` cookie (mandatory).
     */
    auth_cookie?: string;
    /**
     * CallerTraceID - request-scoped trace id.
     */
    caller_trace_id?: string;
    /**
     * ExtraCookies - additional challenge cookies harvested from the
     * browser session (e.g., `cf_clearance`).
     */
    extra_cookies?: Record<string, string>;
    /**
     * TwoFactorAuthCookie - VRChat `twoFactorAuth` cookie (optional).
     */
    two_factor_auth_cookie?: string;
};

