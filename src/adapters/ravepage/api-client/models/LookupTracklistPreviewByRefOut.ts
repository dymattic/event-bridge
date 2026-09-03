/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TracklistPreviewItem } from './TracklistPreviewItem';
export type LookupTracklistPreviewByRefOut = {
    /**
     * ArtworkURL is the producer-resolved image: custom YT thumbnail
     * -> YT thumbnail -> SC artwork. "" when none.
     */
    artwork_url?: string;
    /**
     * AuthorName is the first associated user's display name (falls
     * back to username). "" when none.
     */
    author_name?: string;
    created_at?: string;
    /**
     * Items are the first MaxTracklistPreviewItems entries in
     * track-number order. Never null.
     */
    items?: Array<TracklistPreviewItem>;
    /**
     * Name is the tracklist display name.
     */
    name?: string;
    /**
     * TrackCount is the FULL item count (items below are capped).
     */
    track_count?: number;
    /**
     * TracklistID is the bare-UUID string of the matched row.
     */
    tracklist_id?: string;
    updated_at?: string;
};

