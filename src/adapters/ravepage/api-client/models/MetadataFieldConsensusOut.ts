/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetadataConsensusValueOut } from './MetadataConsensusValueOut';
import type { MetadataField } from './MetadataField';
export type MetadataFieldConsensusOut = {
    /**
     * Field is the metadata field name. Enum: title, artist_text,
     * album, label, bpm, key, duration_ms, isrc, release_year,
     * beatgrid, genre.
     */
    field?: MetadataField;
    /**
     * Values are candidate values, winner first (modal: most distinct
     * reporters, then confidence, then recency). Never null.
     */
    values?: Array<MetadataConsensusValueOut>;
};

