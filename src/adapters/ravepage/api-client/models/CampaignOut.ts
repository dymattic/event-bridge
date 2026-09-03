/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CampaignID } from './CampaignID';
import type { MediaUploadID } from './MediaUploadID';
import type { UserID } from './UserID';
export type CampaignOut = {
    can_edit?: boolean;
    /**
     * CreatedAt - row creation timestamp.
     */
    created_at?: string;
    /**
     * CreatedBy - prefixed-uuid identifier of the user who created the
     * row; nil if the user was later deleted (ondelete=SET NULL).
     */
    created_by?: UserID;
    /**
     * DefaultBodyMD - optional default body markdown.
     */
    default_body_md?: string;
    /**
     * DefaultMediaUploadIDs - default media list (always non-nil; empty
     * slice if unset).
     */
    default_media_upload_ids?: Array<MediaUploadID>;
    /**
     * Description - optional descriptive blurb.
     */
    description?: string;
    /**
     * ID is the campaign row's prefixed-uuid identifier.
     */
    id?: CampaignID;
    /**
     * MyRole is the viewer's coarse edit role, normalised from the
     * effective-permissions role (publisher→collaborator). Null when
     * no permissions resolved.
     */
    my_role?: 'owner' | 'editor' | 'collaborator' | 'viewer';
    /**
     * OwnerID is the bare UUID of the owning entity .
     */
    owner_id?: string;
    /**
     * OwnerType - one of user / group / performer.
     */
    owner_type?: string;
    /**
     * Relationship is the coarse viewer↔campaign relationship, derived
     * from the effective-permissions source (owner→owner, admin→none,
     * collaborator_*→collaborator). Null when no permissions resolved.
     */
    relationship?: 'owner' | 'editor' | 'collaborator' | 'none';
    /**
     * Status - one of draft/active/paused/completed/cancelled/archived.
     */
    status?: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
    /**
     * TargetID is the bare UUID of the target entity (same shape
     * rationale as OwnerID).
     */
    target_id?: string;
    /**
     * TargetType - one of event / release.
     */
    target_type?: string;
    /**
     * Timezone - IANA timezone the schedule is anchored to.
     */
    timezone?: string;
    /**
     * Title - campaign title.
     */
    title?: string;
    /**
     * UpdatedAt - last-mutation timestamp.
     */
    updated_at?: string;
};

