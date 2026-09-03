/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileLatestContentItem = {
    /**
     * CoverURL is the preview image URL. Optional.
     */
    cover_url?: string;
    /**
     * CreatedAt is the publish / creation timestamp. Optional - falls
     * back to event start time for events .
     */
    created_at?: string;
    /**
     * ExternalURL is the canonical external URL (e.g. YouTube watch
     * link, SoundCloud track permalink). Optional.
     */
    external_url?: string;
    /**
     * ID is the underlying content id. Prefixed wire form, polymorphic
     * per kind: event→`evt_`, release→`rel_`, dj_set→`djs_`,
     * tracklist→`tl_`, media_upload→`upl_`, live_stream→`strm_`,
     * youtube_video / soundcloud_track→opaque platform id (no prefix).
     */
    id?: string;
    /**
     * Kind names the content table this row resolves through.
     */
    kind?: 'event' | 'release' | 'dj_set' | 'tracklist' | 'media_upload' | 'youtube_video' | 'soundcloud_track' | 'live_stream';
    /**
     * Score is the personalization rank in [0, 1]. Populated when the
     * viewer carries a `UserTasteProfile`; null for anonymous viewers
     * or entities with no taste signal.
     */
    score?: number;
    /**
     * Title is the display title. Optional.
     */
    title?: string;
};

