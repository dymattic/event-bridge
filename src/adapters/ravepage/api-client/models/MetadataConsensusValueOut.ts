/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BeatgridMarker } from './BeatgridMarker';
export type MetadataConsensusValueOut = {
    /**
     * Camelot is the normalized Camelot-wheel form ("8A"); present
     * only on `key`-field values whose text parses, omitted otherwise.
     */
    camelot?: string;
    /**
     * Confidence in [0,1] - distinct-reporter, source-weighted.
     */
    confidence?: number;
    /**
     * ConfidencePct is the rounded 0-100 view for badges.
     */
    confidence_pct?: number;
    /**
     * DistinctReporters that reported this value.
     */
    distinct_reporters?: number;
    /**
     * Markers are the parsed beatgrid markers; present only for the
     * `beatgrid` field, nil otherwise.
     */
    markers?: Array<BeatgridMarker>;
    /**
     * Observations is the raw report count (replays included).
     */
    observations?: number;
    /**
     * Value is the display form (verbatim from the most recent
     * observation carrying it). For beatgrid this is the signature.
     */
    value?: string;
};

