/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventGenreTagsRow = {
    /**
     * EventID is the bare-UUID string of the event.
     */
    event_id?: string;
    /**
     * Tags are the DISTINCT raw genre-tag strings from events.tags.
     * Always non-nil and non-empty on the wire.
     */
    tags?: Array<string>;
    /**
     * UpdatedAt is the RFC3339 event `updated_at` - the keyset column.
     */
    updated_at?: string;
};

