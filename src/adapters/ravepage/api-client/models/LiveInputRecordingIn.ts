/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LiveInputRecordingIn = {
    /**
     * AllowedOrigins is a list of hostnames allowed to embed.
     */
    allowed_origins?: Array<string>;
    /**
     * HideLiveViewerCount hides viewer count from the player.
     */
    hide_live_viewer_count?: boolean;
    /**
     * Mode is "automatic" or "off". Empty = use account default.
     */
    mode?: string;
    /**
     * RequireSignedURLs forces signed URLs.
     */
    require_signed_urls?: boolean;
};

