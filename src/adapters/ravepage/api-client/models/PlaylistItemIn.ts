/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlaylistItemIn = {
    /**
     * ArtistText - fallback when a linked source carries no artist.
     */
    artist_text?: string;
    /**
     * CanonicalTrackID (`trk_<uuid>` or bare UUID) - snapshot from the
     * canonical track.
     */
    canonical_track_id?: string;
    /**
     * LibraryTrackID (`lib_<uuid>` or bare UUID) - MUST be one of the
     * caller's own library rows (BOLA); snapshot from that row.
     */
    library_track_id?: string;
    /**
     * Title - required for free-text items; fallback when a linked
     * source carries no title.
     */
    title?: string;
};

