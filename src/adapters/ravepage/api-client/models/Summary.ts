/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Summary = {
    /**
     * event only
     */
    attendee_count_current?: number;
    /**
     * typed avatar slot (user/performer/group)
     */
    avatar_url?: string;
    /**
     * typed banner slot
     */
    banner_url?: string;
    /**
     * user/performer
     */
    bio?: string;
    /**
     * showcases - resolvable FE route, never an id path
     */
    canonical_path?: string;
    /**
     * user/performer
     */
    display_name?: string;
    /**
     * event only
     */
    ends_at?: string;
    /**
     * generic tags
     */
    genres?: Array<string>;
    id?: string;
    /**
     * primary thumbnail
     */
    image_url?: string;
    /**
     * group only
     */
    member_count?: number;
    /**
     * groups, performers
     */
    name?: string;
    /**
     * release only - YYYY-MM-DD
     */
    release_date?: string;
    /**
     * release only
     */
    release_type?: string;
    /**
     * events, showcases
     */
    slug?: string;
    /**
     * event only
     */
    starts_at?: string;
    /**
     * event only
     */
    status?: string;
    /**
     * secondary line
     */
    subtitle?: string;
    /**
     * events, releases, tracklists, showcases
     */
    title?: string;
    /**
     * event only
     */
    venue_name?: string;
};

