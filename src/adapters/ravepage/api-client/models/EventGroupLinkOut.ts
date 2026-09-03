/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventGroupLinkOut = {
    /**
     * CreatedAt - when the link was created (UTC ISO-8601).
     */
    created_at?: string;
    /**
     * CreatedByUserID - user who created the link (audit). Nullable.
     */
    created_by_user_id?: string;
    /**
     * EventID - event the group is linked to.
     */
    event_id?: string;
    /**
     * GroupID - linked platform group id.
     */
    group_id?: string;
    /**
     * GroupName - display name of the linked group. Empty when the
     * cross-worker enrichment failed or the group row vanished.
     */
    group_name?: string;
    /**
     * VRChatGroupID - VRChat group id carried by the platform group;
     * empty when null OR enrichment failed.
     */
    vrchat_group_id?: string;
};

