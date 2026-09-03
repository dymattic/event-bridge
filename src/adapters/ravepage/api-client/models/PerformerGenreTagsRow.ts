/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PerformerGenreTagsRow = {
    /**
     * PerformerID is the bare-UUID string of the performer.
     */
    performer_id?: string;
    /**
     * Tags are the DISTINCT raw genre-tag strings aggregated across the
     * performer's slots. Always non-nil and non-empty on the wire.
     */
    tags?: Array<string>;
};

