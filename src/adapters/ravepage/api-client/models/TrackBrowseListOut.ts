/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TrackBrowseOut } from './TrackBrowseOut';
export type TrackBrowseListOut = {
    limit?: number;
    offset?: number;
    /**
     * Total is the full filtered row count (pagination).
     */
    total?: number;
    tracks?: Array<TrackBrowseOut>;
};

