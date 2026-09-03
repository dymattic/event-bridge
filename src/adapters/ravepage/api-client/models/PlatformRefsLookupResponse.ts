/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformRefHit } from './PlatformRefHit';
export type PlatformRefsLookupResponse = {
    /**
     * Hits maps PlatformRefQuery.Key → the resolved row. Refs with no
     * cached row (purged, never cached, or ToU-gated) are ABSENT -
     * absence is the normal miss signal, not an error. Always non-nil
     * on the wire (`{}`, never `null`).
     */
    hits?: Record<string, PlatformRefHit>;
};

