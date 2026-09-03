/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EnrichLinkOut = {
    /**
     * Artist - cached uploader/channel (best-effort).
     */
    artist?: string;
    /**
     * Confidence - match score in [0, 1].
     */
    confidence?: number;
    /**
     * Platform - "soundcloud" or "youtube".
     */
    platform?: string;
    /**
     * ProviderTrackID - provider-native id (SC numeric id / YT video id).
     */
    provider_track_id?: string;
    /**
     * Status - "linked" | "already_linked" | "conflict".
     */
    status?: string;
    /**
     * Title - cached title of the matched external track.
     */
    title?: string;
    /**
     * URL - canonical buy/stream link.
     */
    url?: string;
};

