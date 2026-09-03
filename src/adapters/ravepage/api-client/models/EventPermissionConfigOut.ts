/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventPermissionConfigOut = {
    /**
     * AllowPublicRSVP is whether non-members can RSVP. Defaults true.
     */
    allow_public_rsvp?: boolean;
    /**
     * CreateEventRoles is the role allowlist for event creation in
     * this group.
     */
    create_event_roles?: Array<string>;
    /**
     * CreatedAt is the row creation timestamp (UTC).
     */
    created_at?: string;
    default_visibility?: string;
    /**
     * DeleteEventRoles is the role allowlist for deleting events.
     */
    delete_event_roles?: Array<string>;
    /**
     * EditEventRoles is the role allowlist for editing events.
     */
    edit_event_roles?: Array<string>;
    /**
     * GroupID is the parent group.
     */
    group_id?: string;
    /**
     * ID is the row's primary key.
     */
    id?: string;
    /**
     * ManageRulesRoles is the role allowlist for managing event rules.
     */
    manage_rules_roles?: Array<string>;
    /**
     * ModerateEventRoles is the role allowlist for moderating events
     * (ban users, manage reports).
     */
    moderate_event_roles?: Array<string>;
    /**
     * UpdatedAt is the most-recent mutation timestamp (UTC).
     */
    updated_at?: string;
};

