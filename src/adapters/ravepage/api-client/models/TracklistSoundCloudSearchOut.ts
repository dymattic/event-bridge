/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudTrackSearchOut } from './SoundCloudTrackSearchOut';
export type TracklistSoundCloudSearchOut = {
    failed_searches?: number;
    results?: Array<SoundCloudTrackSearchOut>;
    search_timestamp?: string;
    searched_tracks?: number;
    successful_searches?: number;
    total_suggestions?: number;
    total_tracks?: number;
    tracklist_id?: string;
    tracklist_name?: string;
};

