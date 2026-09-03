/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PresetInstallOut = {
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
     * PresetID is the preset's prefixed id.
     */
    preset_id?: string;
    /**
     * TargetID is the bare-UUID target id (polymorphic - kept raw).
     */
    target_id?: string;
    /**
     * TargetType discriminator (`showcase_page`).
     */
    target_type?: string;
    /**
     * UserID is the installer's prefixed user id.
     */
    user_id?: string;
};

