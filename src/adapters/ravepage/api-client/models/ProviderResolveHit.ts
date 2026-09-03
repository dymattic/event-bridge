/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProviderResolveHit = {
    artist?: string;
    /**
     * Confidence in [0,1]. An ISRC match is 1.0; a title/artist match is
     * scored by the resolver and is always < 1.0.
     */
    confidence?: number;
    /**
     * DurationMS - 0 when unknown.
     */
    duration_ms?: number;
    /**
     * ISRC echoes the ISRC the hit was resolved under ("" for a
     * title/artist fallback match).
     */
    isrc?: string;
    /**
     * Method is how the match was made: "isrc" (exact) or
     * "title_artist" (fuzzy).
     */
    method?: string;
    /**
     * Playback is the LEGAL playback verdict (none | embed | stream).
     */
    playback?: string;
    /**
     * Provider is the provider key.
     */
    provider?: string;
    /**
     * ProviderISRC is the ISRC the provider ITSELF reports for the
     * matched item ("" when the provider exposes none - youtube). On an
     * ISRC lookup it equals ISRC (the clients re-verify). On a fuzzy
     * match it is DISCOVERY data: the caller may adopt it onto an
     * ISRC-less track once it deems the match verifiable, unlocking
     * exact resolution on every other provider in the next sweep.
     */
    provider_isrc?: string;
    /**
     * ProviderTrackID is the playable/linkable id on that provider.
     */
    provider_track_id?: string;
    /**
     * Ref echoes the request item's Ref.
     */
    ref?: string;
    /**
     * Title / Artist as the provider reports them (display + audit).
     */
    title?: string;
    /**
     * URI is the provider-native URI (spotify:track:<id>) - what an
     * embed wants. "" when the provider has no URI form.
     */
    uri?: string;
    /**
     * URL is the public track URL ("" when the provider has none).
     */
    url?: string;
};

