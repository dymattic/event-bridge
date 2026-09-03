/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TrackFieldSourceOut = {
    /**
     * FetchedAt is when the provider data was last fetched (RFC3339
     * UTC) - the cache refresh time, not the catalog write time.
     */
    fetched_at?: string;
    /**
     * Field is the track metadata field the back-reference covers
     * (title / artist_text / duration_ms / url / isrc / ...).
     */
    field?: string;
    /**
     * Provider is the data provider the value came from.
     */
    provider?: string;
    /**
     * SourceID is the provider-native id of the source row (SC
     * numeric track id as string, YT video id, ...).
     */
    source_id?: string;
};

