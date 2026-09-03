/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LookupReleasePreviewByRefOut = {
    /**
     * AuthorName is the first associated user's display name (falls
     * back to username). "" when none.
     */
    author_name?: string;
    created_at?: string;
    /**
     * Description is the long-form copy ("" when null).
     */
    description?: string;
    /**
     * PosterURL is the producer-resolved share image: cover_image_url
     * -> custom YT thumbnail -> YT thumbnail -> SC artwork. "" when no
     * usable image.
     */
    poster_url?: string;
    /**
     * ReleaseDate is the ISO date the release went public ("" = null).
     */
    release_date?: string;
    /**
     * ReleaseID is the bare-UUID string of the matched releases row.
     */
    release_id?: string;
    /**
     * ReleaseType is one of single/ep/album/compilation/dj_set/... or
     * "" when null. Drives the discover-side subject-label map +
     * music.song override for singles.
     */
    release_type?: string;
    /**
     * Title is the release title.
     */
    title?: string;
    /**
     * TrackCount is the linked platform-embed count (SC tracks + YT
     * videos - releases carry no first-class track rows).
     */
    track_count?: number;
    updated_at?: string;
};

