/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReleaseLinks } from './ReleaseLinks';
export type ReleaseLinksLookupResponse = {
    /**
     * ByRelease maps bare-UUID release id → its linked platform rows.
     * Entries present only for ids with ≥1 link; always non-nil on
     * the wire (`{}`, never `null`).
     */
    by_release?: Record<string, ReleaseLinks>;
};

