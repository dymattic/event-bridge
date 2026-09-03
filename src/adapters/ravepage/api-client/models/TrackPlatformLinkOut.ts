/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackPlatformLinkOut = {
    /**
     * Confidence in [0,1] for #65 rows: 1.0 = exact ISRC match, lower =
     * fuzzy title/artist. Omitted on the dataset arms.
     */
    confidence?: number;
    /**
     * Platform is the platform key (host-inferred for MB rels).
     */
    platform?: 'spotify' | 'apple_music' | 'soundcloud' | 'youtube' | 'bandcamp' | 'beatport' | 'tidal' | 'deezer' | 'amazon_music' | 'audius' | 'other';
    /**
     * PlatformTrackID is the platform-native track id when known
     * (ListenBrainz mappings + #65 provider resolution); null for MB
     * url-rels.
     */
    platform_track_id?: string;
    /**
     * Playback is the LEGAL verdict on what the client may DO with this
     * link - NOT a capability guess. Honor it:
     *
     * none - deep link ONLY. Never feed it to a player. TIDAL
     * playback is PROHIBITED for a multi-provider DJ player
     * without written TIDAL approval; Beatport is a store link.
     * embed - the provider's OWN hosted embed/iFrame (Spotify). Do not
     * extract or proxy the audio.
     * stream - we may stream the full track ourselves (Audius, Open
     * Music License - attribution required).
     *
     * Empty on the listenbrainz/musicbrainz arms (no licence attached to
     * a dataset link) - treat empty as `none`.
     */
    playback?: 'none' | 'embed' | 'stream';
    /**
     * Source is the provenance of the mapping.
     */
    source?: 'listenbrainz' | 'musicbrainz' | 'tidal_api' | 'spotify_api' | 'audius_api' | 'beatport_api';
    /**
     * URI is the provider-native URI (`spotify:track:<id>`) - what an
     * embed player wants. Null unless the provider has a URI form (#65).
     */
    uri?: string;
    /**
     * URL is the public link; null when only a platform-native id is
     * known (e.g. soundcloud numeric ids - use platform_track_id).
     */
    url?: string;
    /**
     * Verified is false until the target platform confirms the link. For
     * #65 rows it is true exactly when the match was made on ISRC (exact)
     * rather than title/artist (fuzzy).
     */
    verified?: boolean;
};

