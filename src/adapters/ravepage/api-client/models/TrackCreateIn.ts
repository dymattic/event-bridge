/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackCreateIn = {
    /**
     * DurationMS is the track length in milliseconds.
     */
    duration_ms?: number;
    /**
     * ISRC is the International Standard Recording Code.
     */
    isrc?: string;
    /**
     * ParentTrackID points at the original track when this row is a
     * remix / edit / VIP version. Accepts bare UUID or
     * `trk_<uuid>`; the route parser strips the prefix.
     */
    parent_track_id?: string;
    /**
     * PrimaryPerformerID, when set, attaches a `track_artists` row
     * with role=primary on creation. Accepts bare UUID or
     * `perf_<uuid>`.
     */
    primary_performer_id?: string;
    /**
     * ReleaseDate is the first-known release date. RFC3339-parsed
     * from the wire; nil emits as JSON null. A future cycle can
     * route it through (the `tracks.release_date` column is
     * nullable on the DB side).
     */
    release_date?: string;
    /**
     * Source identifies where the row was first created from. source or
     * "user_manual"`.
     * max_length=40 per Pydantic.
     */
    source?: string;
    /**
     * Title is the display title for the track. Pre-trimmed by the service .strip()`).
     */
    title?: string;
    /**
     * VersionLabel is the free-text version qualifier
     * ("Tiësto Remix" / "VIP Mix" / "Radio Edit"). Empty string is
     * distinct from nil - normalises empty-after-strip to
     * nil at
     */
    version_label?: string;
};

