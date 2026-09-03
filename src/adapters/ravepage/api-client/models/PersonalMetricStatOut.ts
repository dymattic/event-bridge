/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalMetricEntityCountOut } from './PersonalMetricEntityCountOut';
export type PersonalMetricStatOut = {
    /**
     * Audience is the configured visibility. Absent settings read as
     * `private` - nothing is public by default.
     */
    audience?: 'private' | 'followers' | 'mutuals' | 'public';
    /**
     * Items are the top rows by count.
     */
    items?: Array<PersonalMetricEntityCountOut>;
    /**
     * StatKey is the stat, 1:1 with entity_type.
     */
    stat_key?: 'event' | 'track' | 'club' | 'group' | 'artist' | 'label' | 'genre' | 'release';
    /**
     * Storage names which key the rows live under. `subject` means no
     * edge to this account exists in the database; `user` means the
     * link is stored deliberately because the stat is shared.
     */
    storage?: 'subject' | 'user';
};

