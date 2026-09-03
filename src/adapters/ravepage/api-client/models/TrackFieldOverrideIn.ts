/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BeatgridMarker } from './BeatgridMarker';
export type TrackFieldOverrideIn = {
    /**
     * Markers is the full beatgrid marker array - REQUIRED for
     * field=beatgrid, ignored otherwise.
     */
    markers?: Array<BeatgridMarker>;
    /**
     * Value is the authoritative display value for scalar fields
     * (title/artist_text/album/label/bpm/key/duration_ms/isrc/
     * release_year). Required + non-empty for scalars; ignored for
     * beatgrid.
     */
    value?: string;
};

