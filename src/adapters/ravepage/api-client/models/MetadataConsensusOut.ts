/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetadataFieldConsensusOut } from './MetadataFieldConsensusOut';
export type MetadataConsensusOut = {
    /**
     * Fields carries one entry per field with at least one observed
     * value. Never null.
     */
    fields?: Array<MetadataFieldConsensusOut>;
    /**
     * TrackID is the prefixed track id (`trk_<uuid>`).
     */
    track_id?: string;
};

