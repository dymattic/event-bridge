/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PressKitSocialLink = {
    /**
     * Handle is the public handle / username
     * (`social_accounts.provider_username`). Null when the provider row
     * has none recorded.
     */
    handle?: string;
    /**
     * ProfileURL is the canonical public URL on the provider,
     * synthesized server-side from provider + handle. Null for unknown
     * providers or when the handle is missing.
     */
    profile_url?: string;
    /**
     * Provider is the provider slug. Known values: `x`, `bluesky`,
     * `instagram`, `youtube`, `soundcloud`, `twitch`. Free-form string
     * on the wire (unknown providers pass through as their slug).
     */
    provider?: string;
};

