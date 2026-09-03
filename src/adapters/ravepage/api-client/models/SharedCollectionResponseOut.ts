/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaCollectionItemOut } from './MediaCollectionItemOut';
import type { MediaCollectionOut } from './MediaCollectionOut';
export type SharedCollectionResponseOut = {
    collection?: MediaCollectionOut;
    /**
     * Items is the per-collection item list, in (sort_order ASC,
     * created_at ASC) order. Always non-nil - zero matches wire-emits
     * `[]` not `null`.
     */
    items?: Array<MediaCollectionItemOut>;
};

