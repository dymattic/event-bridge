/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackUpdateIn = {
    durationMS?: number;
    /**
     * DurationMS is NULLABLE - explicit null clears the duration.
     * Non-null values are int64-compatible; ge=0 enforced at route.
     */
    durationMSSet?: boolean;
    isCanonical?: boolean;
    /**
     * IsCanonical is NOT NULL on the DB. Route layer rejects
     * explicit null with 422 ("is_canonical must be a boolean").
     */
    isCanonicalSet?: boolean;
    isrc?: string;
    /**
     * ISRC is NULLABLE - explicit null clears the rights code.
     * max_length=32 enforced at route.
     */
    isrcset?: boolean;
    parentTrackID?: string;
    /**
     * ParentTrackID is NULLABLE - explicit null clears the
     * remix-parent linkage. Accepts bare UUID or `trk_<uuid>` per
     * project memory `request_schemas_use_prefixed_ids.md`. The
     * raw string is held here; the route layer prefix-strips and
     * parses to a UUID before reaching the service.
     */
    parentTrackIDSet?: boolean;
    releaseDate?: string;
    /**
     * ReleaseDate is NULLABLE - explicit null clears the column.
     */
    releaseDateSet?: boolean;
    title?: string;
    /**
     * TitleSet records whether the payload contained the `title`
     * key. Title is NOT NULL on the DB; the route layer rejects
     * explicit null with 422 ("title must be 1 to 500 characters").
     */
    titleSet?: boolean;
    versionLabel?: string;
    /**
     * VersionLabel is NULLABLE - explicit null clears the column.
     */
    versionLabelSet?: boolean;
};

