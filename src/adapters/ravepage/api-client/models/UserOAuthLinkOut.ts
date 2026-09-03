/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OAuthLinkID } from './OAuthLinkID';
import type { UserID } from './UserID';
export type UserOAuthLinkOut = {
    /**
     * CreatedAt is when the link was created.
     */
    created_at?: string;
    /**
     * ID is the OAuth link row id (prefix: oal_).
     */
    id?: OAuthLinkID;
    /**
     * Provider is the OAuth provider name (e.g. soundcloud, youtube, x).
     */
    provider?: string;
    /**
     * ProviderEmail is the email from the OAuth provider (may be nil).
     */
    provider_email?: string;
    /**
     * ProviderID is the user id from the OAuth provider.
     */
    provider_id?: string;
    /**
     * ProviderUsername is the username from the OAuth provider (may be nil).
     */
    provider_username?: string;
    /**
     * UpdatedAt is when the link was last updated.
     */
    updated_at?: string;
    /**
     * UserID is the FK to users (prefix: usr_).
     */
    user_id?: UserID;
};

