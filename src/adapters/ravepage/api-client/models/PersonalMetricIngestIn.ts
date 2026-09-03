/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalMetricOccurrenceIn } from './PersonalMetricOccurrenceIn';
export type PersonalMetricIngestIn = {
    /**
     * Occurrences is the batch, max 500 per request.
     */
    occurrences?: Array<PersonalMetricOccurrenceIn>;
    /**
     * SubjectID is the caller's opaque subject, base64url-unpadded over
     * 32 bytes (HMAC-SHA256 output), derived CLIENT-side from the
     * per-user data key. Its PRESENCE selects the private storage path:
     * the row is written keyed by this value and no user_id is written
     * anywhere. Omit it to record under the authenticated user_id
     * instead (the public path, for stats whose audience is not
     * `private`).
     *
     * Treat this like a bearer credential: it is never returned by any
     * endpoint, never logged, and never accepted in a URL.
     */
    subject_id?: string;
};

