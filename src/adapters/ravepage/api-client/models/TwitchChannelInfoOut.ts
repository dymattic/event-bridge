/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TwitchChannelInfoOut = {
    /**
     * Broadcaster user ID.
     */
    broadcaster_id?: string;
    /**
     * BCP-47 language tag.
     */
    broadcaster_language?: string;
    /**
     * Broadcaster login.
     */
    broadcaster_login?: string;
    /**
     * Broadcaster display name.
     */
    broadcaster_name?: string;
    /**
     * Content classification labels.
     */
    content_classification_labels?: Array<string>;
    /**
     * Stream delay in seconds.
     */
    delay?: number;
    /**
     * Current game/category ID.
     */
    game_id?: string;
    /**
     * Current game/category name.
     */
    game_name?: string;
    /**
     * Whether stream is branded content.
     */
    is_branded_content?: boolean;
    /**
     * Channel tags.
     */
    tags?: Array<string>;
    /**
     * Stream title.
     */
    title?: string;
};

