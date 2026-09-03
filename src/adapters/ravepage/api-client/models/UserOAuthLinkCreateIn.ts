/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserOAuthLinkCreateIn = {
    /**
     * AccessToken is the optional OAuth access token; encrypted at
     * rest, never echoed back.
     */
    access_token?: string;
    /**
     * Provider is the OAuth provider name (e.g. soundcloud, youtube,
     * x). Required.
     */
    provider?: string;
    /**
     * ProviderEmail is the optional email from the provider.
     */
    provider_email?: string;
    /**
     * ProviderID is the user id from the OAuth provider. Required.
     */
    provider_id?: string;
    /**
     * ProviderUsername is the optional handle from the provider.
     */
    provider_username?: string;
    /**
     * RefreshToken is the optional OAuth refresh token; encrypted at
     * rest, never echoed back.
     */
    refresh_token?: string;
    /**
     * TokenExpiresAt is the optional expiry timestamp for the access
     * token.
     */
    token_expires_at?: string;
};

