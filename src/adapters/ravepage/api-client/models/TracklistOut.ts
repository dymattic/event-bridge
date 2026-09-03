/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReleaseUserOut } from './ReleaseUserOut';
import type { TracklistItemOut } from './TracklistItemOut';
import type { TracklistSetOut } from './TracklistSetOut';
import type { TracklistSoundCloudTrackOut } from './TracklistSoundCloudTrackOut';
import type { TracklistYouTubeVideoOut } from './TracklistYouTubeVideoOut';
export type TracklistOut = {
    /**
     * CanEdit is true when the authenticated viewer may modify this
     * tracklist (a tracklist_users member). Conservative: never a
     * false-positive grant .
     */
    can_edit?: boolean;
    created_at?: string;
    id?: string;
    imported_at?: string;
    /**
     * MyRole is the viewer's coarse edit role. Null for anonymous
     * viewers and non-members.
     */
    my_role?: 'owner' | 'editor' | 'collaborator' | 'viewer';
    name?: string;
    /**
     * Relationship is the coarse viewer↔tracklist relationship. Null
     * for anonymous viewers; "owner" for a tracklist_users member;
     * "none" for an authenticated non-member.
     */
    relationship?: 'owner' | 'none';
    /**
     * Sets are the sets (recordings) that reference this tracklist -
     * the G-6 reverse edge of `recording_tracklists` ("played at"
     * back-links). N sets may share one tracklist. VISIBILITY-FILTERED
     * per caller: a set the caller may not read is absent, never a
     * stub. Fail-open to `[]` on a read error; never null.
     */
    sets?: Array<TracklistSetOut>;
    soundcloud_tracks?: Array<TracklistSoundCloudTrackOut>;
    tracks?: Array<TracklistItemOut>;
    updated_at?: string;
    /**
     * Users is a cross-worker hydrated embed (2026-06-08). Fail-open to
     * `[]`. Never null.
     */
    users?: Array<ReleaseUserOut>;
    /**
     * Provider links (2026-08-19, G-7). The EDGE is local + durable
     * (`tracklist_media`, keyed on the platform id); the display fields
     * hydrate cross-worker and go null when the platform cache row is
     * gone (ToU purge, artist unlink) - the link itself never does.
     * Same JSON keys as before; never null.
     */
    youtube_videos?: Array<TracklistYouTubeVideoOut>;
};

