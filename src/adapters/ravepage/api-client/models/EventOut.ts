/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { MediaUploadID } from './MediaUploadID';
export type EventOut = {
    /**
     * AccessibilityFlags lists accessibility-related markers.
     */
    accessibility_flags?: Array<string>;
    /**
     * AgeGate is `all_ages | 18_plus | 21_plus`.
     */
    age_gate?: string;
    /**
     * BannerURL is the legacy plain-URL banner field.
     */
    banner_url?: string;
    /**
     * CanEdit is true when the authenticated viewer may modify this
     * event (owner of a user-organized event, or an event_users
     * editor). False for anonymous + non-editor viewers and on list
     * responses. Conservative: never a false-positive grant .
     */
    can_edit?: boolean;
    /**
     * Capacity is the maximum attendee count.
     */
    capacity?: number;
    /**
     * ClubURL is the club page URL.
     */
    club_url?: string;
    /**
     * ContentWarnings is the editorial content-warning list.
     */
    content_warnings?: Array<string>;
    /**
     * CoverImageURL is the legacy plain-URL poster field.
     */
    cover_image_url?: string;
    /**
     * CoverMediaUploadID is the prefixed media-upload reference for
     * the event's poster. Optional.
     */
    cover_media_upload_id?: MediaUploadID;
    /**
     * CreatedAt is the event-row creation timestamp.
     */
    created_at?: string;
    /**
     * Description is the freeform event description.
     */
    description?: string;
    /**
     * DescriptionShort is the brief teaser description.
     */
    description_short?: string;
    /**
     * DiscordInviteURL is the Discord invite URL.
     */
    discord_invite_url?: string;
    /**
     * EndsAt is the event end timestamp.
     */
    ends_at?: string;
    /**
     * EnergyLevel is one of `chill | medium | high | extreme`.
     */
    energy_level?: string;
    /**
     * ExternalEventURL is the external event page URL.
     */
    external_event_url?: string;
    /**
     * Featured is the editorial-featured flag.
     */
    featured?: boolean;
    /**
     * ID is the canonical prefixed event identifier. Wire form:
     * `evt_<uuid>`.
     */
    id?: EventID;
    /**
     * IsPublic is the legacy public-visibility flag.
     */
    is_public?: boolean;
    /**
     * JoinURL is the canonical join link.
     */
    join_url?: string;
    /**
     * Languages is the list of ISO-639-1 language codes.
     */
    languages?: Array<string>;
    /**
     * Location is the freeform location string.
     */
    location?: string;
    /**
     * MyRole is the viewer's coarse edit role for this event. Null for
     * anonymous viewers, non-editors, and list responses.
     */
    my_role?: 'owner' | 'editor' | 'collaborator' | 'viewer';
    /**
     * OpenDecks marks "open decks" community events.
     */
    open_decks?: boolean;
    /**
     * OrganizerID is the polymorphic organizer reference.
     */
    organizer_id?: string;
    /**
     * OrganizerType is one of `user | group | club`. The matching
     * `OrganizerID` is interpreted accordingly. Pointer so absent
     * (legacy / null) emits JSON null.
     */
    organizer_type?: string;
    /**
     * Platforms is the list of platform tags (`pc`, `quest`, etc.).
     * JSON null when absent .
     */
    platforms?: Array<string>;
    /**
     * Relationship is the coarse viewer↔event relationship. Null for
     * anonymous viewers and list responses; "none" for an
     * authenticated non-editor.
     */
    relationship?: 'owner' | 'editor' | 'collaborator' | 'none';
    /**
     * RestrictionFlags lists restriction markers (e.g. flashing
     * lights, full-body-tracking required).
     */
    restriction_flags?: Array<string>;
    /**
     * RRule is the RFC 5545 recurrence rule.
     */
    rrule?: string;
    /**
     * SceneType is one of `club | festival | rave | concert |
     * showcase`.
     */
    scene_type?: string;
    /**
     * ShareURL is the canonical share link.
     */
    share_url?: string;
    /**
     * Slug is the URL-friendly identifier.
     */
    slug?: string;
    /**
     * StartsAt is the event start timestamp.
     */
    starts_at?: string;
    /**
     * Status is one of `draft|scheduled|live|ended|cancelled`.
     * Empty string when null in DB .
     */
    status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
    /**
     * StreamURL is the live stream URL.
     */
    stream_url?: string;
    /**
     * Subtitle is the freeform short tagline.
     */
    subtitle?: string;
    /**
     * Tags is the freeform tag list.
     */
    tags?: Array<string>;
    /**
     * Timezone is the IANA timezone name (e.g. "Europe/Berlin").
     */
    timezone?: string;
    /**
     * Title is the required event title.
     */
    title?: string;
    /**
     * UpdatedAt is the event-row last-update timestamp.
     */
    updated_at?: string;
    /**
     * VenueName is the freeform venue name.
     */
    venue_name?: string;
    /**
     * Visibility is one of `public|unlisted|private`.
     */
    visibility?: 'public' | 'unlisted' | 'private';
    /**
     * WorldURL is the VRChat world URL.
     */
    world_url?: string;
};

