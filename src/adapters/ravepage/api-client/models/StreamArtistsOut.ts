/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SetArtistOut } from './SetArtistOut';
export type StreamArtistsOut = {
    /**
     * Artists are the ranked artists (track count desc, capped at 25).
     * Never null (empty when the set has no matched plays).
     */
    artists?: Array<SetArtistOut>;
    /**
     * Count is the number of artists in this response.
     */
    count?: number;
    /**
     * StreamID is the set's live stream (`strm_<uuid>`), echoed for
     * client correlation.
     */
    stream_id?: string;
};

