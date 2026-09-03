/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReleaseRecordingRef } from './ReleaseRecordingRef';
import type { ReleaseSoundCloudTrackOut } from './ReleaseSoundCloudTrackOut';
import type { ReleaseUserOut } from './ReleaseUserOut';
import type { ReleaseYouTubeVideoOut } from './ReleaseYouTubeVideoOut';
export type ReleaseOut = {
    /**
     * CanEdit is true when the authenticated viewer may modify this
     * release (a release_users co-owner or a platform admin).
     * Conservative: never a false-positive grant.
     */
    can_edit?: boolean;
    /**
     * CoverImageURL points at the cover-art asset; nullable.
     */
    cover_image_url?: string;
    /**
     * CreatedAt is the row insert timestamp (UTC).
     */
    created_at?: string;
    /**
     * Description is the long-form copy; nullable.
     */
    description?: string;
    /**
     * ID is the bare-UUID identifier for this release.
     */
    id?: string;
    /**
     * InstagramPostIDs are linked Instagram post ids.
     */
    instagram_post_ids?: Array<string>;
    /**
     * MyRole is the viewer's coarse edit role. Null for anonymous
     * viewers and authenticated non-owners.
     */
    my_role?: 'owner' | 'editor' | 'collaborator' | 'viewer';
    /**
     * Recordings linked to this release (WS-rec reverse direction).
     * Visibility-filtered against the caller (a private recording linked
     * to a public release is hidden from non-owners). Never null.
     */
    recordings?: Array<ReleaseRecordingRef>;
    /**
     * Relationship is the coarse viewer↔release relationship. Null for
     * anonymous viewers; "owner" for a co-owner; "none" for an
     * authenticated non-owner (incl. platform admin).
     */
    relationship?: 'owner' | 'none';
    /**
     * ReleaseDate is the wall-clock date the release became public;
     * nullable; ISO-8601 string.
     */
    release_date?: string;
    /**
     * ReleaseType buckets the release; nullable.
     */
    release_type?: 'single' | 'ep' | 'album' | 'compilation' | 'dj_set';
    /**
     * SoundCloudTracks linked to the release (same hydration posture).
     */
    soundcloud_tracks?: Array<ReleaseSoundCloudTrackOut>;
    /**
     * Title is the human-readable release name.
     */
    title?: string;
    /**
     * UpdatedAt is the most recent mutation timestamp (UTC).
     */
    updated_at?: string;
    /**
     * UserIDs are the bare-UUID associated user ids.
     */
    user_ids?: Array<string>;
    /**
     * Never null.
     */
    users?: Array<ReleaseUserOut>;
    /**
     * Visibility is one of: public, unlisted, logged_in, private.
     */
    visibility?: 'public' | 'unlisted' | 'logged_in' | 'private';
    /**
     * YouTubeVideos linked to the release (social-platforms cache,
     * hydrated via mesh). Never null; empty when none linked or the
     * hydrator is unavailable (fail-open).
     */
    youtube_videos?: Array<ReleaseYouTubeVideoOut>;
};

