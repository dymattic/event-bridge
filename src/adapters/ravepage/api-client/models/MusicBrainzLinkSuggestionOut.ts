/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TrackLinkCreateIn } from './TrackLinkCreateIn';
export type MusicBrainzLinkSuggestionOut = {
    link_type?: string;
    platform?: 'youtube' | 'soundcloud' | 'bluesky' | 'twitch' | 'x' | 'instagram' | 'spotify';
    relationship_type?: string;
    source_entity?: string;
    source_mbid?: string;
    suggested_link?: TrackLinkCreateIn;
    url?: string;
};

