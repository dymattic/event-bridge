/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkshopInstallRequest = {
    /**
     * CustomParams overrides the item's default params (optional).
     */
    custom_params?: Record<string, any>;
    /**
     * TargetID is the target id (bare UUID or prefixed).
     */
    target_id?: string;
    /**
     * TargetType is `showcase_page` / `showcase_section` / … per kind.
     */
    target_type?: string;
};

