/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventUpdateIn = {
    accessibility_flags?: Array<string>;
    age_gate?: string;
    banner_url?: string;
    capacity?: number;
    club_url?: string;
    content_warnings?: Array<string>;
    cover_image_url?: string;
    cover_media_upload_id?: string;
    description?: string;
    description_short?: string;
    discord_invite_url?: string;
    ends_at?: string;
    energy_level?: string;
    external_event_url?: string;
    featured?: boolean;
    is_public?: boolean;
    join_url?: string;
    languages?: Array<string>;
    location?: string;
    open_decks?: boolean;
    /**
     * OrganizerID matches organizer_type semantics.
     */
    organizer_id?: string;
    /**
     * OrganizerType is the polymorphic organizer-kind.
     */
    organizer_type?: string;
    platforms?: Array<string>;
    restriction_flags?: Array<string>;
    rrule?: string;
    scene_type?: string;
    share_url?: string;
    slug?: string;
    starts_at?: string;
    status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
    stream_url?: string;
    subtitle?: string;
    tags?: Array<string>;
    timezone?: string;
    title?: string;
    venue_name?: string;
    visibility?: 'public' | 'unlisted' | 'private';
    world_url?: string;
};

