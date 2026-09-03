/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { EventTimingInfo } from './EventTimingInfo';
import type { EventVRChatInstanceSummary } from './EventVRChatInstanceSummary';
export type EventSummary = {
    /**
     * AgeGate is the age gate string.
     */
    age_gate?: string;
    /**
     * AttendeeCountCurrent is the live attendee count snapshot. Reads
     * the `events.attendee_count_current` column if present.
     */
    attendee_count_current?: number;
    /**
     * BannerURL is the legacy banner_url field.
     */
    banner_url?: string;
    /**
     * CreatedAt + UpdatedAt are the row timestamps.
     */
    created_at?: string;
    /**
     * DurationMinutes is the total duration (mirrors Timing.DurationMinutes
     * at the EventSummary level).
     */
    duration_minutes?: number;
    /**
     * EndsAt is the event end timestamp.
     */
    ends_at?: string;
    /**
     * EnergyLevel is the events-owned mood dimension (`events.energy_level`,
     * e.g. "chill" / "peak" / "hard"). JSON null when unset.
     */
    energy_level?: string;
    /**
     * Featured is the editorial-featured flag.
     */
    featured?: boolean;
    /**
     * FollowedHost is the per-caller followed-host flag.
     */
    followed_host?: boolean;
    /**
     * Genres is the list of canonical genre slugs for this event. tags` column
     * (organizer-declared genre words + slot-genre words aggregated to
     * the event row by the create/lineup surface), normalized to
     * canonical taxonomy-shaped slugs (lowercase + slugify), deduped,
     * order-preserved (primary genre first), capped at 5. Emits JSON
     * `[]` when the event carries no genre-bearing tags . The `?genres=` timeline filter matches on the SAME source
     * so the displayed genres and the filter always agree. The deeper
     * tracks-worker consensus taxonomy (entity_genres) still powers the
     * aggregate surfaces (top_genres / filter-options) and is a phase-2
     * per-event enrichment candidate via a bulk contract.
     */
    genres?: Array<string>;
    /**
     * HostID is the raw UUID of the organizer . The FE
     * reconstructs the prefixed form by combining HostType + HostID.
     */
    host_id?: string;
    /**
     * HostName is the organizer display name.
     */
    host_name?: string;
    /**
     * HostType is one of `user | group | club | role | event`.
     */
    host_type?: string;
    /**
     * ID is the typed prefixed event identifier (`evt_<uuid>`).
     */
    id?: EventID;
    /**
     * InsightLine is the editorial insight line.
     */
    insight_line?: string;
    /**
     * JoinURL is the canonical join link.
     */
    join_url?: string;
    /**
     * OpenDecks marks "open decks" community events.
     */
    open_decks?: boolean;
    /**
     * Platforms is the list of platform tags. JSON null when absent .
     */
    platforms?: Array<string>;
    /**
     * PosterURL is the legacy cover_image_url field.
     */
    poster_url?: string;
    /**
     * SavedByUser is the per-caller saved flag.
     */
    saved_by_user?: boolean;
    /**
     * SceneType is the events-owned scene descriptor (`events.scene_type`). JSON null
     * when unset.
     */
    scene_type?: string;
    /**
     * ShareURL is the canonical share link.
     */
    share_url?: string;
    /**
     * Slug is the URL-friendly identifier. JSON null when absent.
     */
    slug?: string;
    /**
     * StartsAt is the event start timestamp.
     */
    starts_at?: string;
    /**
     * Status is the stored status; safe-defaulted to "scheduled" when
     * NULL in DB.
     */
    status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
    /**
     * Subtitle is the freeform short tagline.
     */
    subtitle?: string;
    /**
     * Tags is the raw events-owned freeform tag list (organizer-declared
     * genre words + descriptors) straight from `events.tags`.
     * Emits JSON `[]` when absent (kept non-nil for wire stability).
     */
    tags?: Array<string>;
    /**
     * Timezone is the IANA timezone name.
     */
    timezone?: string;
    /**
     * Timing is the computed timing helpers.
     */
    timing?: EventTimingInfo;
    /**
     * Title is the required event title.
     */
    title?: string;
    /**
     * TrendScore is the float trend score (0.0 default).
     */
    trend_score?: number;
    updated_at?: string;
    /**
     * Visibility is the stored visibility; safe-defaulted to "public"
     * when NULL in DB.
     */
    visibility?: 'public' | 'unlisted' | 'private';
    /**
     * VRChatInstances is the list of active VRChat instances linked
     * to this event.
     */
    vrchat_instances?: Array<EventVRChatInstanceSummary>;
};

