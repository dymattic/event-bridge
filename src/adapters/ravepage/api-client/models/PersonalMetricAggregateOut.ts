/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricAggregateOut = {
    /**
     * EntityID of the aggregate, prefixed.
     */
    entity_id?: string;
    /**
     * EntityType of the aggregate.
     */
    entity_type?: 'event' | 'track' | 'club' | 'group' | 'artist' | 'label' | 'genre' | 'release';
    /**
     * KThreshold is the suppression floor in force.
     */
    k_threshold?: number;
    /**
     * People is how many distinct subjects/users recorded this entity,
     * or null when the true count is below KThreshold. Suppressed, NOT
     * rounded: a count of 1 is a disclosure, not a metric. A null is
     * also what an entity with zero rows returns, so null carries no
     * information about which side of zero the truth is on.
     */
    people?: number;
    /**
     * Plays is the summed counter, or null under the same threshold.
     */
    plays?: number;
};

