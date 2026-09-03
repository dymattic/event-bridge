/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkshopInstallOut = {
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
     * ItemID is the item's prefixed id (`wsi_<uuid>`).
     */
    item_id?: string;
    /**
     * ItemKind is the installed item's kind.
     */
    item_kind?: string;
    /**
     * TargetID is the bare-UUID target id (polymorphic - kept raw).
     */
    target_id?: string;
    /**
     * TargetType is the install-target discriminator.
     */
    target_type?: string;
    /**
     * UserID is the installer's prefixed user id.
     */
    user_id?: string;
};

