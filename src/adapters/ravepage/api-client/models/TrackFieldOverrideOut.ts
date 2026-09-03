/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldValueSource } from './FieldValueSource';
import type { MetadataField } from './MetadataField';
export type TrackFieldOverrideOut = {
    /**
     * Field is the overridden metadata field.
     */
    field?: MetadataField;
    /**
     * ID is the override row id (bare UUID).
     */
    id?: string;
    /**
     * Source is always artist-provided for an override row.
     */
    source?: FieldValueSource;
    /**
     * TrackID is the prefixed track id (`trk_<uuid>`).
     */
    track_id?: string;
    /**
     * Value is the stored display value (marker-array JSON for beatgrid).
     */
    value?: string;
};

