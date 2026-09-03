/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReleaseLinks } from './ReleaseLinks';
export type TracklistLinksLookupResponse = {
    /**
     * ByTracklist maps bare-UUID tracklist id → its linked rows.
     * Always non-nil on the wire.
     */
    by_tracklist?: Record<string, ReleaseLinks>;
};

