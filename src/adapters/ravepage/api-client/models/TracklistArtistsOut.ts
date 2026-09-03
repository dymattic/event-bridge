/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SetArtistOut } from './SetArtistOut';
export type TracklistArtistsOut = {
    /**
     * Artists are the ranked artists (track count desc, capped at 25).
     * Never null (empty when the tracklist has no matched items).
     */
    artists?: Array<SetArtistOut>;
    /**
     * Count is the number of artists in this response.
     */
    count?: number;
    /**
     * TracklistID is the tracklist UUID, echoed for client correlation.
     */
    tracklist_id?: string;
};

