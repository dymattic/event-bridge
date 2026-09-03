/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProviderLink = {
    /**
     * Confirmed is true when the link is vote-confirmed (vs a
     * suggested/unconfirmed external id).
     */
    confirmed?: boolean;
    /**
     * Playback is the legal playback verdict from isrc_provider_links;
     * ABSENT for track_external_ids rows (FE applies per-provider
     * defaults there).
     */
    playback?: 'none' | 'embed' | 'stream';
    /**
     * Provider is the platform key. `audius` (#65) is the only value the
     * player may STREAM from; tidal/beatport are deep links and spotify
     * is an iFrame embed - see TrackPlatformLinkOut.playback for the
     * per-link legal verdict. The DB column is free-string (varchar) -
     * this enum is the wire vocabulary the FE codegen binds to, so a new
     * provider MUST be added here or the FE cannot receive it.
     */
    provider?: 'spotify' | 'apple_music' | 'soundcloud' | 'youtube' | 'bandcamp' | 'beatport' | 'tidal' | 'deezer' | 'audius' | 'musicbrainz' | 'other';
    /**
     * ProviderTrackID is the platform-native track id (e.g. an Audius
     * hashid), null when unknown. Filled from both link stores.
     */
    provider_track_id?: string;
    /**
     * URL is the buy/stream link, null when the row carries only a
     * provider track id with no resolved URL yet.
     */
    url?: string;
};

