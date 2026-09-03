/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StreamVodOut } from './StreamVodOut';
export type StreamVodListOut = {
    items?: Array<StreamVodOut>;
    /**
     * NextCursor is the opaque pagination token (ISO timestamp of
     * the last item's created_at) when the page is full; null
     * otherwise.
     */
    next_cursor?: string;
};

