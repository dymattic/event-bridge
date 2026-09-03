/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackExternalIDCreateIn = {
    /**
     * Notes - OPTIONAL. Free-text breadcrumb. nil omits.
     */
    notes?: string;
    /**
     * Provider - REQUIRED. Short provider slug
     * ("soundcloud" / "beatport" / "musicbrainz" / "acoustid" /
     * "spotify" / "apple_music" / "youtube" / "bandcamp"). The
     * canonical values are documented in
     * to 40 codepoints.
     */
    provider?: string;
    /**
     * ProviderTrackID - REQUIRED. The provider's own identifier as
     * a string (BigInts, UUIDs, slugs all coexist; we store the raw
     * form).
     */
    provider_track_id?: string;
    /**
     * URL - OPTIONAL. Canonical public URL when available. nil omits.
     */
    url?: string;
};

