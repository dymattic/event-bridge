/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventTimingInfo } from './EventTimingInfo';
import type { LineupEntry } from './LineupEntry';
export type EventDetail = {
    accessibility_flags?: Array<string>;
    age_gate?: string;
    /**
     * Live metrics.
     */
    attendee_count_current?: number;
    attendee_count_peak?: number;
    banner_url?: string;
    calendar_url?: string;
    club_url?: string;
    content_warnings?: Array<string>;
    created_at?: string;
    description_long?: string;
    description_short?: string;
    discord_invite_url?: string;
    ends_at?: string;
    energy_level?: string;
    external_event_url?: string;
    featured?: boolean;
    followed_host?: boolean;
    /**
     * Freshness metadata.
     */
    generated_at?: string;
    /**
     * Metadata.
     */
    genres?: Array<string>;
    host_id?: string;
    host_name?: string;
    host_type?: string;
    id?: EventID;
    /**
     * Action links.
     */
    join_url?: string;
    languages?: Array<string>;
    /**
     * Lineup.
     */
    lineup?: Array<LineupEntry>;
    lineup_count?: number;
    live_data_updated_at?: string;
    momentum_score?: number;
    open_decks?: boolean;
    platforms?: Array<string>;
    poster_url?: string;
    recommended_for_user?: boolean;
    recommended_reason?: string;
    restriction_flags?: Array<string>;
    /**
     * User context.
     */
    saved_by_user?: boolean;
    scene_type?: string;
    share_url?: string;
    slug?: string;
    stale_after?: string;
    starts_at?: string;
    status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
    stream_url?: string;
    subtitle?: string;
    tags?: Array<string>;
    timezone?: string;
    /**
     * Timing helpers.
     */
    timing?: EventTimingInfo;
    title?: string;
    trend_score?: number;
    updated_at?: string;
    visibility?: 'public' | 'unlisted' | 'private';
    world_url?: string;
};

