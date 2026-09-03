/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AudiusTrackOut = {
    artist?: string;
    artist_handle?: string;
    artist_id?: string;
    artwork_url?: string;
    bpm?: number;
    duration_ms?: number;
    genre?: string;
    /**
     * License is the uploader's DECLARED license. The Open Music License
     * requires attribution when we stream - render it.
     */
    license?: string;
    mood?: string;
    musical_key?: string;
    permalink_url?: string;
    /**
     * Playable mirrors access.stream: false ⇒ the player MUST NOT stream
     * it (token/NFT-gated); link out instead.
     */
    playable?: boolean;
    title?: string;
    track_id?: string;
};

