/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PersonalMetricVisibilityStateOut = {
    /**
     * Audience now in force.
     */
    audience?: 'private' | 'followers' | 'mutuals' | 'public';
    /**
     * RowsMoved is how many edge rows were re-keyed by this change. 0
     * when the change did not cross the private boundary.
     */
    rows_moved?: number;
    /**
     * StatKey of this entry.
     */
    stat_key?: 'event' | 'track' | 'club' | 'group' | 'artist' | 'label' | 'genre' | 'release';
};

