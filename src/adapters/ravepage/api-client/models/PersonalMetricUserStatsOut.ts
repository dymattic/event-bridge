/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalMetricStatOut } from './PersonalMetricStatOut';
export type PersonalMetricUserStatsOut = {
    /**
     * Stats contains only what this viewer is permitted to see. Empty
     * means "not shared with you" and nothing more specific.
     */
    stats?: Array<PersonalMetricStatOut>;
    /**
     * UserID echoes the requested user, prefixed.
     */
    user_id?: string;
};

