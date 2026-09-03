/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudSuggestedLink = {
    /**
     * Description - pre-formatted display string
     * ("Stream '<title>' by <artist> on SoundCloud").
     */
    description?: string;
    /**
     * LinkType - always "stream" for SC tracks.
     */
    link_type?: string;
    /**
     * Platform - always "soundcloud".
     */
    platform?: 'soundcloud';
    /**
     * Title - pre-formatted display string ("Listen on SoundCloud").
     */
    title?: string;
    /**
     * URL - SC permalink (mirrors `permalink_url`).
     */
    url?: string;
};

