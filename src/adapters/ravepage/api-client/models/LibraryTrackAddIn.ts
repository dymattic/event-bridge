/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BeatgridMarker } from './BeatgridMarker';
import type { CuePoint } from './CuePoint';
export type LibraryTrackAddIn = {
    /**
     * Album / release name.
     */
    album?: string;
    /**
     * ArtistText is the raw credited-artist text.
     */
    artist_text?: string;
    /**
     * Beatgrid is an optional full marker array.
     */
    beatgrid?: Array<BeatgridMarker>;
    /**
     * BPM.
     */
    bpm?: number;
    /**
     * Comment from the DJ-software tags.
     */
    comment?: string;
    /**
     * Cues is an optional cue/hotcue marker array. Omitting it on a
     * re-add preserves the stored cues (COALESCE).
     */
    cues?: Array<CuePoint>;
    /**
     * DropsMS is an optional array of DJ-marked drop points
     * (milliseconds from track start, ints >= 0, max 64; server sorts
     * + dedupes). Omitting it preserves stored drops; an explicit empty
     * array clears them.
     */
    drops_ms?: Array<number>;
    /**
     * DurationMS.
     */
    duration_ms?: number;
    /**
     * FilePath is an optional local path used ONLY to derive an irreversible
     * sha256 dedup hash when no title/isrc is present. It is never stored
     * and never returned (privacy: local paths stay on the client).
     */
    file_path?: string;
    /**
     * FingerprintB64 is an optional base64 chromaprint for matching.
     */
    fingerprint_b64?: string;
    /**
     * Genre.
     */
    genre?: string;
    /**
     * ISRC.
     */
    isrc?: string;
    /**
     * Key (musical key).
     */
    key?: string;
    /**
     * Label / publisher.
     */
    label?: string;
    /**
     * LastPlayedAt is an optional RFC3339 last-played timestamp.
     */
    last_played_at?: string;
    /**
     * PlayCount as the DJ software reports it.
     */
    play_count?: number;
    /**
     * Rating is the DJ-software star rating 0-5 (0 = unrated → stored null).
     */
    rating?: number;
    /**
     * ReleaseYear.
     */
    release_year?: number;
    /**
     * Title (required - at least one of title/isrc/file_path forms the dedup key).
     */
    title?: string;
};

