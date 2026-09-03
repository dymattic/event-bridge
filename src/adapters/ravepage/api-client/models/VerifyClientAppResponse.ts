/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VerifyClientAppResponse = {
    /**
     * AllowedScopes is the JSONB `client_apps.allowed_scopes` array.
     * Audit currently does not enforce scopes on /metrics/record; the
     * field is exposed for future per-scope authz. Empty slice = no
     * scopes configured .
     */
    allowed_scopes?: Array<string>;
    /**
     * ID is the `client_apps.id` UUID.
     */
    id?: string;
    /**
     * IsActive is the `client_apps.is_active` flag. The contract
     * returns 401 (not 200) when the row exists but is_active=false;
     * the field is exposed for future caller-side logic that may want
     * to fast-path on a recently-deactivated row.
     */
    is_active?: boolean;
    /**
     * Name is the human-readable client name (admin-set at /admin/
     * clients create time). Audit may surface this in log fields.
     */
    name?: string;
};

