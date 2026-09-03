/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ComponentInstallRequest = {
    /**
     * CustomParams overrides the component's param-schema defaults.
     */
    custom_params?: Record<string, any>;
    /**
     * TargetID is the showcase-section id (bare UUID or `shs_<uuid>`).
     */
    target_id?: string;
    /**
     * TargetType is fixed `showcase_section`.
     */
    target_type?: 'showcase_section';
};

