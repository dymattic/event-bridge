/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProviderResolveItem = {
    artist?: string;
    /**
     * DurationMS - the caller's known track duration, 0 when unknown.
     * Fuzzy arms use it as a discriminator: a candidate whose duration
     * clearly disagrees is rejected no matter how well the text scores.
     */
    duration_ms?: number;
    /**
     * ISRC is the primary key. When set, providers that support ISRC
     * lookup (tidal, spotify, beatport) are queried by it - an exact,
     * high-confidence match.
     */
    isrc?: string;
    /**
     * Ref is an opaque caller-side correlation key echoed back on every
     * hit (tracks passes the canonical track id). Never interpreted.
     */
    ref?: string;
    /**
     * Title / Artist are the FALLBACK for providers with no ISRC search
     * (audius, youtube) and for ISRC-less items on providers with a
     * text search (spotify, apple_music); ignored on an ISRC lookup.
     */
    title?: string;
};

