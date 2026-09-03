/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackBrowseOut = {
    /**
     * ArtistText is the consensus artist_text winner, falling back to
     * the credited track_artists names joined in position order; null
     * when neither exists.
     */
    artist_text?: string;
    /**
     * ArtworkURL is the cover-art URL (provider CDN); null unknown.
     */
    artwork_url?: string;
    /**
     * BPM is the consensus bpm winner; null when unobserved.
     */
    bpm?: number;
    /**
     * Camelot is the normalized wheel code ("8A") of the key winner;
     * null when the key is absent or unparseable.
     */
    camelot?: string;
    /**
     * DurationMS is the track length in milliseconds; null unknown.
     */
    duration_ms?: number;
    /**
     * ExternalProviders lists providers this track can be reached on
     * (e.g. ["soundcloud","audius"]); [] when none - FE playability
     * signal. Union of two stores, neither copied into the other:
     * track_external_ids (our own per-track ids: hydration sweeps,
     * provider-match mint, user suggestions - so `musicbrainz` and other
     * non-playable authorities appear here too) and the #65
     * isrc_provider_links cache, restricted to rows whose LEGAL
     * `playback` verdict is not `none` (deep-link-only providers stay on
     * TrackOut.platform_links). Unverified third-party dataset links
     * (ListenBrainz / MusicBrainz url-rels) are NEVER listed here - they
     * live on TrackOut.platform_links tagged with source + verified.
     */
    external_providers?: Array<string>;
    /**
     * Genre / Label / Key - consensus winner display values; null when
     * unobserved.
     */
    genre?: string;
    /**
     * HasHostedAudio - a PUBLICLY-readable recording with FIRST-PARTY
     * hosted audio contains this track (F2). Playback rank #1: when
     * true, GET /tracks/{id} carries the playable recording(s) in
     * `hosted_audio[]` - go there rather than to a third-party provider.
     * Caller-INDEPENDENT (browse is a shared cacheable surface), so it
     * is a lower bound: an authenticated owner may additionally see
     * their own private recordings on the detail read while this stays
     * false.
     */
    has_hosted_audio?: boolean;
    /**
     * HasWaveform - a linked library row carries waveform peaks
     * (GET /tracks/{id}/waveform will serve).
     */
    has_waveform?: boolean;
    /**
     * ID is the canonical track row id (bare UUID - TrackOut parity).
     */
    id?: string;
    /**
     * IsCanonical mirrors tracks.is_canonical.
     */
    is_canonical?: boolean;
    key?: string;
    label?: string;
    /**
     * ReleaseDate is the first-known release date (RFC3339); null
     * unknown.
     */
    release_date?: string;
    /**
     * Title is the display title. Required, non-empty.
     */
    title?: string;
    /**
     * VersionLabel is the free-text version qualifier; null for
     * original recordings.
     */
    version_label?: string;
};

