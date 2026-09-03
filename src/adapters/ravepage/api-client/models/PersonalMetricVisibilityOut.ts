/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalMetricVisibilityStateOut } from './PersonalMetricVisibilityStateOut';
export type PersonalMetricVisibilityOut = {
    /**
     * Notice restates the property the UI must show verbatim: going
     * private stops FUTURE disclosure, it does not retract past
     * disclosure.
     */
    notice?: string;
    /**
     * Stats is every stat key with its effective audience.
     */
    stats?: Array<PersonalMetricVisibilityStateOut>;
};

