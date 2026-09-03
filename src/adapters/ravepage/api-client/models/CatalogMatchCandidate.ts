/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Platform } from './Platform';
export type CatalogMatchCandidate = {
    /**
     * Artist - SC uploader username / YT channel title (best-effort).
     */
    artist?: string;
    /**
     * ArtworkURL - cover/thumbnail. Optional.
     */
    artwork_url?: string;
    /**
     * DurationMS - cached duration in ms (0 when unknown / unparseable).
     */
    duration_ms?: number;
    /**
     * Platform - "soundcloud" or "youtube".
     */
    platform?: Platform;
    /**
     * ProviderTrackID - the provider-native id used as
     * `track_external_ids.provider_track_id`: SoundCloud numeric track
     * id (as string) / YouTube video id.
     */
    provider_track_id?: string;
    /**
     * Score - title (+artist/duration) similarity in [0, 1]. Tracks
     * uses it as the `track_external_ids.confidence` and to threshold.
     */
    score?: number;
    /**
     * Title - cached (or custom) title.
     */
    title?: string;
    /**
     * URL - canonical link: SC permalink_url / YT watch URL. Becomes
     * `track_external_ids.url`.
     */
    url?: string;
};

