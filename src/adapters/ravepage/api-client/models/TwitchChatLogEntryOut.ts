/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TwitchChatLogEntryOut = {
    /**
     * Chatter badges (list of {set_id, id}).
     */
    badges?: Array<Record<string, string>>;
    /**
     * Chatter display name.
     */
    chatter_display_name?: string;
    /**
     * Chatter login.
     */
    chatter_login?: string;
    /**
     * Chatter Twitch ID.
     */
    chatter_twitch_id?: string;
    /**
     * Chatter name color.
     */
    color?: string;
    /**
     * Entry ID (UUID).
     */
    id?: string;
    /**
     * Twitch message ID.
     */
    message_id?: string;
    /**
     * Message content.
     */
    message_text?: string;
    /**
     * Message type.
     */
    message_type?: string;
    /**
     * When the message was sent.
     */
    sent_at?: string;
};

