/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DMDeliveryItemOut = {
    /**
     * AttemptCount tracks retry attempts on the send pipeline.
     */
    attempt_count?: number;
    /**
     * CreatedAt is the row insertion timestamp (ISO-8601 RFC 3339).
     */
    created_at?: string;
    /**
     * ErrorCode is non-null only when Status == "failed".
     */
    error_code?: string;
    /**
     * ErrorMessage is non-null only when Status == "failed".
     */
    error_message?: string;
    /**
     * ID is the prefixed wire form "ddm_<uuid>". md`.
     */
    id?: string;
    /**
     * LastAttemptAt is non-null only once a send has been attempted at
     * least once.
     */
    last_attempt_at?: string;
    /**
     * RecipientDiscordUserID is the Discord snowflake (string) of the
     * DM recipient.
     */
    recipient_discord_user_id?: string;
    /**
     * Status is `pending` | `sent` | `failed`. Per project memory
     * `discord_delivered_semantics.md` there is NO "delivered" status
     * - `sent` means Discord accepted the message (HTTP 2xx). Read-
     * receipt is unobservable, so no "delivered" status is meaningful.
     */
    status?: 'pending' | 'sent' | 'failed';
};

