/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TrackLinkOut } from './TrackLinkOut';
export type TracklistItemOut = {
    additional_data?: any;
    artist?: string;
    /**
     * ArtworkURL is the canonical track's cover (host-relative or absolute),
     * null when no linked artwork.
     */
    artwork_url?: string;
    bpm?: string;
    canonical_artist?: string;
    /**
     * CanonicalTitle / CanonicalArtist are the catalog track's
     * title/credited-artist (null when unlinked) - the enriched display
     * values; fall back to the raw `title`/`artist` above.
     */
    canonical_title?: string;
    /**
     * CanonicalTrackID is the resolved catalog track (`trk_<uuid>`),
     * null until the library row's rematch links it.
     */
    canonical_track_id?: string;
    created_at?: string;
    deck?: string;
    /**
     * DropsMS - the linked library row's DJ-marked drop points
     * (ms from track start, sorted ASC). Empty when unlinked/none.
     */
    drops_ms?: Array<number>;
    duration?: string;
    /**
     * EndOffsetMS is milliseconds from the start of the recording.
     * Same population rule as StartOffsetMS; omitted when the item
     * carried no end offset.
     */
    end_offset_ms?: number;
    genre?: string;
    has_artwork?: boolean;
    /**
     * HasWaveform / HasArtwork - library-media presence flags (false
     * when unlinked).
     */
    has_waveform?: boolean;
    id?: string;
    key?: string;
    label?: string;
    label_group_id?: string;
    /**
     * Library-owned enriched metadata (the uploader's values on the
     * library row). LibraryBPM is 0 when unknown.
     */
    library_bpm?: number;
    library_genre?: string;
    library_key?: string;
    library_label?: string;
    library_play_count?: number;
    library_rating?: number;
    /**
     * LibraryTrackID is the prefixed uploader-library row id
     * (`lib_<uuid>`), null when the item is not library-linked.
     */
    library_track_id?: string;
    /**
     * Never null.
     */
    links?: Array<TrackLinkOut>;
    match_confidence?: number;
    /**
     * MatchSource / MatchConfidence are the canonical-link provenance
     * (matcher arm + 0..1 score), null when unmatched.
     */
    match_source?: string;
    number?: string;
    performer_id?: string;
    played_public?: string;
    producer?: string;
    release?: string;
    release_date?: string;
    remixer?: string;
    /**
     * StartOffsetMS is milliseconds from the start of the recording.
     * Populated ONLY on the recording-tracklist read (a recording's
     * stored tracklist positions items against the hosted audio);
     * omitted for standalone tracklists.
     */
    start_offset_ms?: number;
    start_time?: string;
    time?: string;
    title?: string;
    track_number?: string;
    tracklist_id?: string;
    updated_at?: string;
};

