/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TracklistsByMediaIn = {
    /**
     * ExternalRefs are PLATFORM ids (SC numeric track id, YT videoId),
     * never cache-row uuids. May be empty (returns an empty map).
     */
    external_refs?: Array<string>;
    /**
     * Provider is the provider slug - "soundcloud" | "youtube".
     */
    provider?: string;
};

