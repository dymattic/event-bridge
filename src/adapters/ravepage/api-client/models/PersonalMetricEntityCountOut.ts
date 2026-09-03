/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricEntityCountOut = {
    /**
     * Count is how many times THIS subject/user recorded it.
     */
    count?: number;
    /**
     * EntityID is the canonical id, prefixed.
     */
    entity_id?: string;
    /**
     * EntityType of the row.
     */
    entity_type?: 'event' | 'track' | 'club' | 'group' | 'artist' | 'label' | 'genre' | 'release';
    /**
     * FirstSeenAt is the first recorded occurrence, RFC3339.
     */
    first_seen_at?: string;
    /**
     * LastSeenAt is the most recent recorded occurrence, RFC3339.
     */
    last_seen_at?: string;
};

