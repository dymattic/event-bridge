/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlaylistItemOut = {
    /**
     * AddedAt is the RFC3339 write timestamp.
     */
    added_at?: string;
    /**
     * ArtistText snapshotted at add time.
     */
    artist_text?: string;
    /**
     * ArtworkURL is the linked canonical track's cover-art URL, null
     * when the item is unlinked or the track has no artwork.
     */
    artwork_url?: string;
    /**
     * CanonicalTrackID links a catalog track (`trk_<uuid>`), null when none.
     */
    canonical_track_id?: string;
    /**
     * ID is the prefixed item id (`pli_<uuid>`).
     */
    id?: string;
    /**
     * LibraryTrackID links the owner's library row (`lib_<uuid>`), null when none.
     */
    library_track_id?: string;
    /**
     * Position in the playlist (0-based, contiguous).
     */
    position?: number;
    /**
     * Title snapshotted at add time.
     */
    title?: string;
};

