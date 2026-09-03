/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldValueSource } from './FieldValueSource';
import type { MetadataField } from './MetadataField';
export type TrackFieldOverrideEntry = {
    /**
     * Field is the overridden metadata field.
     */
    field?: MetadataField;
    /**
     * Source is always artist-provided for an override entry.
     */
    source?: FieldValueSource;
    /**
     * Value is the authoritative display value (marker JSON for beatgrid).
     */
    value?: string;
};

