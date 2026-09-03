/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BillingAccountOut = {
    address_line1?: string;
    address_line2?: string;
    cf_stream_default_recording_mode?: string;
    city?: string;
    country_code?: string;
    created_at?: string;
    display_name?: string;
    /**
     * ID is the prefixed account identifier ("ba_<uuid>").
     */
    id?: string;
    is_active?: boolean;
    legal_name?: string;
    /**
     * OwnerGroupID is "grp_<uuid>" for group-owned accounts, null
     * for personal.
     */
    owner_group_id?: string;
    /**
     * OwnerUserID is "usr_<uuid>" for personal accounts, null for
     * group-owned.
     */
    owner_user_id?: string;
    postal_code?: string;
    updated_at?: string;
    vat_id?: string;
    /**
     * VatIDValidatedAt is the last VIES validation timestamp, or
     * null.
     */
    vat_id_validated_at?: string;
};

