/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventCollectionLinkIn = {
    /**
     * CollectionID - bare UUID or `mco_<uuid>` prefixed form.
     */
    collection_id?: string;
    /**
     * Role - one of gallery|highlights|press. Defaults to
     * "gallery" when empty.
     */
    role?: string;
    /**
     * SortOrder - display order; defaults to 0.
     */
    sort_order?: number;
};

