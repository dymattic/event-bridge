/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaUploadID } from './MediaUploadID';
import type { UserID } from './UserID';
import type { UserOAuthLinkOut } from './UserOAuthLinkOut';
import type { UserStatus } from './UserStatus';
export type UserOut = {
    /**
     * AvatarMediaUploadID is the media upload used as the account
     * avatar (prefix: upl_). Nil when unset.
     */
    avatar_media_upload_id?: MediaUploadID;
    /**
     * AvatarURL is the server-built `/media/stream/{id}` absolute URL
     * derived from AvatarMediaUploadID. Nil when no avatar is set.
     */
    avatar_url?: string;
    /**
     * BackgroundMediaKind is image | video. Nil when no background set.
     */
    background_media_kind?: string;
    /**
     * BackgroundMediaUploadID is the media upload used as the profile
     * background (prefix: upl_). Nil when unset.
     */
    background_media_upload_id?: MediaUploadID;
    /**
     * CreatedAt is when the user was created.
     */
    created_at?: string;
    /**
     * DisplayName is the account-level display name. Nil → FE falls
     * back to Username.
     */
    display_name?: string;
    /**
     * Email is the user's email address (may be nil if never set).
     */
    email?: string;
    /**
     * EmailVerified reports whether the user's email is verified.
     */
    email_verified?: boolean;
    /**
     * ID is the user id (prefix: usr_).
     */
    id?: UserID;
    /**
     * IsAdmin reports whether the user has admin privileges.
     */
    is_admin?: boolean;
    /**
     * MFAEnabled reports whether MFA is enabled on this account.
     */
    mfa_enabled?: boolean;
    /**
     * OAuthLinks is the list of OAuth-provider links on this account.
     * Empty slice when none are linked. Tokens are NEVER emitted.
     */
    oauth_links?: Array<UserOAuthLinkOut>;
    /**
     * Status is the account status - one of UserStatus values.
     */
    status?: UserStatus;
    /**
     * StatusChangedAt is when the status last changed. Nil when never
     * changed (status has been "active" since creation).
     */
    status_changed_at?: string;
    /**
     * StatusReason carries the admin-facing reason for non-active
     * status. Nil when status=active.
     */
    status_reason?: string;
    /**
     * SuspendedUntil is the auto-expiry timestamp for suspensions.
     * Nil when status != suspended OR when suspension is indefinite.
     */
    suspended_until?: string;
    /**
     * UpdatedAt is when the user row was last updated.
     */
    updated_at?: string;
    /**
     * Username is the user's stable handle.
     */
    username?: string;
};

