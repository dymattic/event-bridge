/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SocialAccountID } from './SocialAccountID';
export type SocialAccountView = {
    /**
     * ID is the canonical prefixed social-account identifier. Wire
     * form: `sa_<uuid>`. Maps to `social_accounts.id`.
     */
    id?: SocialAccountID;
    /**
     * NeedsReauth is the operational-state flag. Defaults false on
     * fresh rows; flipped to true by the publisher when an OAuth
     * refresh fails.
     */
    needs_reauth?: boolean;
    /**
     * OwnerID is the concrete entity UUID matching OwnerType.
     */
    owner_id?: string;
    /**
     * OwnerType is one of `user`, `group`, `club`, `performer`.
     */
    owner_type?: string;
    /**
     * Provider is the platform name (`x`, `bluesky`, `instagram`,
     * `youtube`, `soundcloud`).
     */
    provider?: string;
    /**
     * ProviderID is the external account id (DID for Bluesky;
     * numeric / string for OAuth providers).
     */
    provider_id?: string;
    /**
     * ProviderUsername is the user-facing handle. Nullable.
     */
    provider_username?: string;
    /**
     * VerifiedAt is the timestamp of the last successful credential
     * verification. Nullable. Wire emits ISO-8601 (UTC).
     */
    verified_at?: string;
};

