/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AudiusCachedTrack = {
    /**
     * Artist - uploader display name.
     */
    artist?: string;
    /**
     * ArtistAudiusID - the uploader's hashed user id. THE account key the
     * entity-resolution sweep scores on (artist-vs-label).
     */
    artist_audius_id?: string;
    /**
     * ArtistHandle - the uploader's @handle.
     */
    artist_handle?: string;
    artwork_url?: string;
    /**
     * Matching + display signals SC/YT do not provide.
     */
    bpm?: number;
    /**
     * DDEXApp - non-empty when the release arrived via a DDEX
     * distributor: label-supplied metadata, a stronger provenance signal
     * than a self-upload.
     */
    ddex_app?: string;
    duration_ms?: number;
    /**
     * FetchedAt - RFC3339 UTC; becomes the provenance fetched_at.
     */
    fetched_at?: string;
    genre?: string;
    /**
     * IsSetMix / SetMixReason - the shared/setmix verdict.
     */
    is_set_mix?: boolean;
    /**
     * ISRC / ISWC - usually empty. Only DDEX-delivered uploads carry them;
     * Audius cannot be SEARCHED by ISRC, so these only CONFIRM a match.
     */
    isrc?: string;
    iswc?: string;
    /**
     * License - the uploader's DECLARED license (a name, or an
     * Alternative License URI). Carried verbatim so the FE can render the
     * OML-required attribution. NOT a playback gate.
     */
    license?: string;
    mood?: string;
    musical_key?: string;
    permalink_url?: string;
    /**
     * RFC3339
     */
    release_date?: string;
    set_mix_reason?: string;
    /**
     * StreamAccess mirrors the API's `access.stream` - THE streamability
     * gate. False ⇒ the track must NEVER be handed to a player as
     * playable (it is token/NFT-gated), no matter what else says.
     */
    stream_access?: boolean;
    tag_list?: string;
    /**
     * Title - display title (custom_title wins).
     */
    title?: string;
    /**
     * TrackID - Audius track id, the SHORT HASHED form ("WNPPk"). This is
     * the provider_track_id key; the numeric track_id is never used.
     */
    track_id?: string;
};

