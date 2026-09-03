/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BeatgridMarker } from './BeatgridMarker';
import type { CuePoint } from './CuePoint';
import type { LibraryFingerprintStatus } from './LibraryFingerprintStatus';
import type { LibrarySource } from './LibrarySource';
export type LibraryTrackOut = {
    /**
     * AddedAt is the RFC3339 creation timestamp.
     */
    added_at?: string;
    /**
     * Album / release name.
     */
    album?: string;
    /**
     * ArtistText is the raw credited-artist text.
     */
    artist_text?: string;
    /**
     * ArtworkURL is the cover to render: the linked canonical track's
     * artwork_url when set, else this row's embedded-tag artwork path
     * (host-relative /library/tracks/{id}/artwork), else null.
     * Populated on list reads; write responses report null.
     */
    artwork_url?: string;
    /**
     * Beatgrid is the full marker array (empty when the source carried none).
     */
    beatgrid?: Array<BeatgridMarker>;
    /**
     * BPM (0 when unknown).
     */
    bpm?: number;
    /**
     * Camelot is the normalized Camelot wheel code parsed from `key`
     * ("1A".."12B"), null when key is absent/unparseable.
     */
    camelot?: string;
    /**
     * CanonicalTrackID is the resolved canonical track (`trk_<uuid>`),
     * null when unmatched (the row banks a provisional cluster).
     */
    canonical_track_id?: string;
    /**
     * Comment from the DJ-software tags.
     */
    comment?: string;
    /**
     * Cues is the full cue/hotcue array (empty when none synced).
     */
    cues?: Array<CuePoint>;
    /**
     * DropsMS is the DJ-marked drop points, milliseconds from track
     * start, sorted ascending + deduped. Empty = no drops synced.
     */
    drops_ms?: Array<number>;
    /**
     * DurationMS (0 when unknown).
     */
    duration_ms?: number;
    /**
     * FingerprintStatus classifies the link quality.
     */
    fingerprint_status?: LibraryFingerprintStatus;
    /**
     * Genre.
     */
    genre?: string;
    /**
     * HasWaveform is true when a waveform is stored for this row
     * (GET /library/tracks/{id}/waveform). Populated on list reads;
     * write responses report false.
     */
    has_waveform?: boolean;
    /**
     * ID is the prefixed library-row id (`lib_<uuid>`).
     */
    id?: string;
    /**
     * ISRC (normalized; empty when absent).
     */
    isrc?: string;
    /**
     * Key (musical key, e.g. Camelot or open-key notation).
     */
    key?: string;
    /**
     * Label / publisher.
     */
    label?: string;
    /**
     * LastPlayedAt is the RFC3339 last-played timestamp, null when not carried.
     */
    last_played_at?: string;
    /**
     * MatchConfidence of the canonical link (0..1, null when unmatched).
     */
    match_confidence?: number;
    /**
     * MatchSource is the matcher arm that resolved the link (isrc, title_artist, chromaprint, …).
     */
    match_source?: string;
    /**
     * PlayCount as the DJ software reported it (0 when not carried).
     */
    play_count?: number;
    /**
     * Rating is the DJ-software star rating 1-5 (0 = unrated).
     */
    rating?: number;
    /**
     * ReleaseYear (0 when unknown).
     */
    release_year?: number;
    /**
     * Source is the write-path that created this row.
     */
    source?: LibrarySource;
    /**
     * SourceKind is the originating format/tool (traktor_xml, recordbox, …).
     */
    source_kind?: string;
    /**
     * Title as imported/entered.
     */
    title?: string;
    /**
     * UpdatedAt is the RFC3339 last-write timestamp.
     */
    updated_at?: string;
};

