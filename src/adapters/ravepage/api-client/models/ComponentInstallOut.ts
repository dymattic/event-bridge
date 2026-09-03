/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ComponentInstallOut = {
    /**
     * ComponentID is the component's prefixed id.
     */
    component_id?: string;
    /**
     * CustomParams stores the user-supplied param overrides.
     */
    custom_params?: Record<string, any>;
    /**
     * ID is the installation row's bare UUID.
     */
    id?: string;
    /**
     * InstalledAt is the install timestamp.
     */
    installed_at?: string;
    /**
     * IsActive flags whether the install is currently applied.
     */
    is_active?: boolean;
    /**
     * TargetID is the bare-UUID target id (polymorphic - kept raw).
     */
    target_id?: string;
    /**
     * TargetType discriminator (currently `showcase_section`).
     */
    target_type?: string;
    /**
     * UserID is the installer's prefixed user id.
     */
    user_id?: string;
};

