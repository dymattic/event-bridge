/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SoundCloudTrackUpdateIn = {
    /**
     * Track description.
     */
    description?: string;
    /**
     * Whether downloads are enabled.
     */
    downloadable?: boolean;
    /**
     * Genre.
     */
    genre?: string;
    /**
     * Public/private sharing.
     */
    sharing?: 'public' | 'private';
    /**
     * Space-separated tags.
     */
    tag_list?: string;
    /**
     * Track title.
     */
    title?: string;
};

