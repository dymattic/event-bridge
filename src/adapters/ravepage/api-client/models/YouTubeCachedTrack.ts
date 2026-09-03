/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type YouTubeCachedTrack = {
    /**
     * Artist - uploading channel title (youtube_channel_cache join).
     * Channel names land as artist-name metadata ONLY - NO performer
     * minting from YT channels (entity-resolution rework, P6-P8).
     */
    artist?: string;
    /**
     * ArtworkURL - thumbnail (custom wins). Optional.
     */
    artwork_url?: string;
    /**
     * ChannelCustomURL - @handle / custom URL of the channel.
     */
    channel_custom_url?: string;
    /**
     * ChannelDescription - channel about text.
     */
    channel_description?: string;
    /**
     * ChannelSubscribers - subscriber count (0 unknown/hidden).
     */
    channel_subscribers?: number;
    /**
     * ChannelThumbnailURL - channel avatar.
     */
    channel_thumbnail_url?: string;
    /**
     * ChannelYouTubeID - YT channel id of the uploader ("" unknown).
     */
    channel_youtube_id?: string;
    /**
     * DurationMS - duration in ms parsed from the ISO-8601 cache value
     * (0 when unknown).
     */
    duration_ms?: number;
    /**
     * Embeddable - videos.list status flag; nil = unknown. The FE
     * IFrame player gate (P3) needs it alongside the link.
     */
    embeddable?: boolean;
    /**
     * FetchedAt - when the cache row was last refreshed from YT
     * (RFC3339 UTC; youtube_videos.last_updated). Becomes the
     * per-field provenance fetched_at on the tracks side.
     */
    fetched_at?: string;
    /**
     * IsSetMix - true when the row is a DJ set / mix / podcast (the
     * hydration sweep skips it).
     */
    is_set_mix?: boolean;
    /**
     * PermalinkURL - canonical watch URL.
     */
    permalink_url?: string;
    /**
     * SetMixReason - "duration_gt_20m" | "keyword:<kw>" | "" (single
     * track). Same value persisted on the cache row.
     */
    set_mix_reason?: string;
    /**
     * TagList - space-joined snippet tags (setmix keyword surface).
     */
    tag_list?: string;
    /**
     * Title - display title (custom_title wins over the YT title).
     */
    title?: string;
    /**
     * VideoID - YT video id (the provider_track_id key).
     */
    video_id?: string;
};

