/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OAuthLinkID } from './OAuthLinkID';
import type { PerformerID } from './PerformerID';
export type PerformerOauthLinkOut = {
    /**
     * CreatedAt is the row creation timestamp.
     */
    created_at?: string;
    /**
     * ID is the prefixed oauth-link id. Wire form `oal_<uuid>`.
     */
    id?: OAuthLinkID;
    /**
     * NeedsReauth flags rows whose token refresh failed.
     */
    needs_reauth?: boolean;
    /**
     * PerformerID is the parent performer's prefixed id.
     */
    performer_id?: PerformerID;
    /**
     * Provider is the platform name (`soundcloud`, `youtube`, etc.).
     */
    provider?: string;
    /**
     * ProviderEmail is the user-facing email.
     */
    provider_email?: string;
    /**
     * ProviderID is the external account id.
     */
    provider_id?: string;
    /**
     * ProviderUsername is the user-facing handle.
     */
    provider_username?: string;
    /**
     * ReauthReason is the optional last-failure reason string.
     */
    reauth_reason?: string;
    /**
     * UpdatedAt is the last-modified timestamp.
     */
    updated_at?: string;
};

