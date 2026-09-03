/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupID } from './GroupID';
import type { UserID } from './UserID';
export type EventBanCreateIn = {
    /**
     * BannedUserID is the user being banned. Required.
     */
    banned_user_id?: UserID;
    /**
     * ExpiresAt is the optional ban expiry timestamp. JSON null for
     * permanent bans.
     */
    expires_at?: string;
    /**
     * IsPermanent flags whether this ban never expires. Defaults to
     * false `).
     */
    is_permanent?: boolean;
    /**
     * OrganizerGroupID is the optional group-wide ban scope. When set
     * the ban applies to all events under that group; when null the
     * ban is event-scoped (per the path event_id).
     */
    organizer_group_id?: GroupID;
    /**
     * Reason is the optional free-form ban reason.
     */
    reason?: string;
};

