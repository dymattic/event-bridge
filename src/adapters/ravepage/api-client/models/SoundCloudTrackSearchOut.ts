/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SoundCloudSearchSuggestionOut } from './SoundCloudSearchSuggestionOut';
import type { TracklistItemOut } from './TracklistItemOut';
export type SoundCloudTrackSearchOut = {
    error?: string;
    search_query?: string;
    suggestions?: Array<SoundCloudSearchSuggestionOut>;
    track?: TracklistItemOut;
};

