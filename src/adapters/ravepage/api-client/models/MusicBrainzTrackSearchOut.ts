/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MusicBrainzLinkSuggestionOut } from './MusicBrainzLinkSuggestionOut';
import type { MusicBrainzRecordingMatchOut } from './MusicBrainzRecordingMatchOut';
import type { TracklistItemOut } from './TracklistItemOut';
export type MusicBrainzTrackSearchOut = {
    error?: string;
    match?: MusicBrainzRecordingMatchOut;
    search_query?: string;
    suggestions?: Array<MusicBrainzLinkSuggestionOut>;
    track?: TracklistItemOut;
};

