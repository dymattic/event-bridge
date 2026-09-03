/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalMetricVisibilitySetIn } from './PersonalMetricVisibilitySetIn';
export type PersonalMetricVisibilityIn = {
    /**
     * Stats is the set of changes to apply.
     */
    stats?: Array<PersonalMetricVisibilitySetIn>;
    /**
     * SubjectID is REQUIRED whenever a change crosses the private
     * boundary in either direction. Going public re-keys the caller's
     * subject rows to their user_id and deletes the subject copies;
     * going private re-keys the user_id rows to this subject and
     * deletes the user_id copies.
     */
    subject_id?: string;
};

