/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClubID } from './ClubID';
import type { GroupID } from './GroupID';
import type { UserID } from './UserID';
export type ClubOut = {
    /**
     * Bio is the freeform biography. Optional.
     */
    bio?: string;
    /**
     * Capacity is the venue capacity. Optional.
     */
    capacity?: number;
    /**
     * City is the city name. Optional.
     */
    city?: string;
    /**
     * ClaimedAt is the claim timestamp. Optional.
     */
    claimed_at?: string;
    /**
     * ClaimedByUserID is the user who claimed the club, when
     * `IsClaimed` is true. Optional.
     */
    claimed_by_user_id?: UserID;
    /**
     * ClubURL is the in-platform club page URL. Optional.
     */
    club_url?: string;
    /**
     * Country is the country name. Optional.
     */
    country?: string;
    /**
     * CreatedAt + UpdatedAt are ISO-8601 timestamps with timezone
     * offset.
     */
    created_at?: string;
    /**
     * GroupID is the owning group (prefixed `grp_<uuid>`).
     * Optional - null for user-owned clubs.
     */
    group_id?: GroupID;
    /**
     * ID is the canonical prefixed club identifier. Wire form:
     * `club_<uuid>`.
     */
    id?: ClubID;
    /**
     * ImageURL is the legacy plain-URL image field. Optional.
     */
    image_url?: string;
    /**
     * IsClaimed is true iff a user has claimed the club.
     */
    is_claimed?: boolean;
    /**
     * Location is the freeform location string. Optional.
     */
    location?: string;
    /**
     * Name is the club's display name. Required.
     */
    name?: string;
    /**
     * Slug is the URL slug (lowercase, alphanumeric + dashes).
     * UNIQUE across the table.
     */
    slug?: string;
    /**
     * Source is the provenance string (e.g. "manual", "import").
     * Optional.
     */
    source?: string;
    /**
     * Tags is the freeform tag list. Go
     * matches the nullability by representing absent as `nil` and
     * empty as `[]`.
     */
    tags?: Array<string>;
    updated_at?: string;
    /**
     * UserID is the linked owner user (prefixed `usr_<uuid>`).
     * Optional - null when no user has claimed the club.
     */
    user_id?: UserID;
    /**
     * WebsiteURL is the club's website URL. Optional.
     */
    website_url?: string;
};

