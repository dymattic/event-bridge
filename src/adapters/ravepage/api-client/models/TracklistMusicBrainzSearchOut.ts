/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MusicBrainzTrackSearchOut } from './MusicBrainzTrackSearchOut';
export type TracklistMusicBrainzSearchOut = {
    failed_matches?: number;
    results?: Array<MusicBrainzTrackSearchOut>;
    search_timestamp?: string;
    searched_tracks?: number;
    successful_matches?: number;
    total_suggestions?: number;
    total_tracks?: number;
    tracklist_id?: string;
    tracklist_name?: string;
};

