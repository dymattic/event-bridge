/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RecordingTracklistItemIn = {
    /**
     * Album is the release the track came from. Optional.
     */
    album?: string;
    /**
     * Artist is the track artist. Optional.
     */
    artist?: string;
    /**
     * BPM is the played tempo. Optional.
     */
    bpm?: number;
    /**
     * CanonicalTrackID pins the item to a known canonical track
     * (`trk_<uuid>`). Optional - the library ingest resolves a link
     * from the text fields when absent.
     */
    canonical_track_id?: string;
    /**
     * Deck is the deck the track played on. Optional.
     */
    deck?: string;
    /**
     * EndOffsetMS is milliseconds from the start of the recording.
     * Optional; when present it must be > start_offset_ms.
     */
    end_offset_ms?: number;
    /**
     * Key is the musical key (free text or Camelot). Optional.
     */
    key?: string;
    /**
     * Number is the 1-based position in the set. Optional.
     */
    number?: number;
    /**
     * StartOffsetMS is milliseconds from the start of the recording.
     * Required; must be >= 0.
     */
    start_offset_ms?: number;
    /**
     * Title is the track title. Required (an item with no title is
     * dropped - it cannot be keyed into the library).
     */
    title?: string;
};

