/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkshopBrowseItem } from './WorkshopBrowseItem';
export type WorkshopBrowseResponse = {
    /**
     * Items is the page of browse rows.
     */
    items?: Array<WorkshopBrowseItem>;
    /**
     * NextCursor is the opaque pagination cursor; null when exhausted.
     */
    next_cursor?: string;
};

