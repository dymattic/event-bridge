/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformRefQuery } from './PlatformRefQuery';
export type PlatformRefsLookupRequest = {
    /**
     * Refs are the rows to resolve/hydrate. Capped at
     * MaxPlatformRefsLookupRefs.
     */
    refs?: Array<PlatformRefQuery>;
};

