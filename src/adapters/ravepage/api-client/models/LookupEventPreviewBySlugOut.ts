/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventPreviewGroup } from './EventPreviewGroup';
import type { EventPreviewLineupEntry } from './EventPreviewLineupEntry';
export type LookupEventPreviewBySlugOut = {
    /**
     * CoverImageURL is the events.cover_image_url column (or "" when
     * null). The discover-side composer prefers this over the
     * synthetic `/v1/og/...` URL when populated .
     */
    cover_image_url?: string;
    /**
     * CreatedAt is RFC3339 UTC. Used as PreviewDTO.published_at.
     */
    created_at?: string;
    /**
     * Description is the events.description column.
     */
    description?: string;
    /**
     * DescriptionShort is the events.description_short column. description fallback chain.
     */
    description_short?: string;
    /**
     * EndsAt is RFC3339 UTC. Used as
     * PreviewDTO.structured_data.endDate AND drives the
     * PreviewDTO.expires_at (`ends_at + 6h` per parity at
     */
    ends_at?: string;
    /**
     * EventID is the bare-UUID string of the matched events row.
     */
    event_id?: string;
    /**
     * Groups are the co-hosting/collaborating group credits from
     * event_group_links, name-enriched via the groups contract.
     * Fail-soft: lookup errors drop the affected entry.
     */
    groups?: Array<EventPreviewGroup>;
    /**
     * Lineup is the public lineup (same source the event-detail page
     * shows: events -> profiles LookupEventPerformers), minus declined
     * entries, capped producer-side (see MaxPreviewLineup). Fail-soft
     * to empty on RPC error.
     */
    lineup?: Array<EventPreviewLineupEntry>;
    /**
     * Location is the events.location column (or "" when null). Used
     * as a fallback for `structured_data.location.name` AND as the
     * `structured_data.location.address` value.
     */
    location?: string;
    /**
     * OrganizerID is the bare-UUID string of the organizer (or "" for
     * legacy rows). Echoed verbatim alongside OrganizerType.
     */
    organizer_id?: string;
    /**
     * OrganizerName is the display name of the primary organizer
     * (groups LookupGroup for organizer_type=group/club, identity
     * display-name for =user). "" when unknown or when the lookup
     * fail-softs. Feeds PreviewDTO.author + JSON-LD organizer.
     */
    organizer_name?: string;
    /**
     * OrganizerType is one of "user", "group", "club", or "" (legacy).
     * Echoed verbatim.
     */
    organizer_type?: string;
    /**
     * PosterURL is the absolute, anonymously-fetchable URL of the
     * event's share image, resolved producer-side (banner_url when the
     * public event page heroes it, else cover_image_url; relative
     * values absolutized against EVENTS_MEDIA_STREAM_BASE_URL). "" when
     * the event has no usable image - the composer then falls back to
     * the synthetic /v1/og card.
     */
    poster_url?: string;
    /**
     * Ref echoes the request path param verbatim so the discover-side
     * composer can correlate when multiple in-flight calls share a
     * connection. Identical to either UUID or slug per the request.
     */
    ref?: string;
    /**
     * Slug is the events.slug column (may be empty for legacy rows).
     */
    slug?: string;
    /**
     * StartsAt is RFC3339 UTC. Used as
     * PreviewDTO.structured_data.startDate.
     */
    starts_at?: string;
    /**
     * Status is the events.status column ("scheduled" / "live" /
     * "ended" / "cancelled" / NULL). The discover-side composer maps
     * this to schema.org EventStatusType .
     */
    status?: 'draft' | 'scheduled' | 'live' | 'ended' | 'cancelled';
    /**
     * Tags is the events.tags JSON array (or empty).
     */
    tags?: Array<string>;
    /**
     * Timezone is the events.timezone column - an IANA zone name
     * ("Europe/Berlin") or "" when null. The discover-side composer
     * renders lineup set times in this zone with an explicit label
     * (crawl-cached descriptions are viewer-agnostic) and stamps
     * structured_data start/end dates with the zone's offset. "" -> UTC.
     */
    timezone?: string;
    /**
     * Title is the events.title column. Used as PreviewDTO.title.
     */
    title?: string;
    /**
     * UpdatedAt is RFC3339 UTC. Used as PreviewDTO.modified_at and
     * feeds into PreviewDTO.cache_key version computation.
     */
    updated_at?: string;
    /**
     * VenueName is the events.venue_name column (or "" when null).
     * Used to populate `structured_data.location.name` .
     */
    venue_name?: string;
    /**
     * Visibility is the events.visibility column ("public" /
     * "unlisted" / "private"). The producer never returns rows that
     * would fail the visibility filter - this field is echoed for
     * observability and for forward-compat where the discover-side
     * composer may want to set different cache headers per visibility.
     */
    visibility?: 'public' | 'unlisted' | 'private';
};

