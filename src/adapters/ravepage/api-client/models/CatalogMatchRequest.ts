/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CatalogMatchRequest = {
    /**
     * Artist - optional free-text artist; boosts the score when it
     * agrees with the cached uploader/channel. Empty is allowed.
     */
    artist?: string;
    /**
     * DurationMS - native track duration in ms; boosts the score when
     * it agrees within a window. 0 = unknown (no boost).
     */
    duration_ms?: number;
    /**
     * LimitPerProvider - max candidates per platform (1-20). Defaults
     * to 5 on zero/negative, caps at 20.
     */
    limit_per_provider?: number;
    /**
     * Title - native track title. Required. The primary match key.
     */
    title?: string;
};

