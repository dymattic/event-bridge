/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventID } from './EventID';
import type { PromoTaskID } from './PromoTaskID';
import type { UserID } from './UserID';
export type PromoTaskOut = {
    /**
     * CreatedAt is the row creation timestamp (UTC).
     */
    created_at?: string;
    /**
     * CreatedBy is the user who created the task - prefixed
     * `usr_<uuid>`.
     */
    created_by?: UserID;
    /**
     * EventID is the parent event reference - prefixed `evt_<uuid>`.
     */
    event_id?: EventID;
    /**
     * ID is the canonical prefixed promo-task identifier. Wire form:
     * `ptk_<uuid>`.
     */
    id?: PromoTaskID;
    /**
     * Notes is the optional free-form notes field. JSON null when
     * NULL in DB.
     */
    notes?: string;
    /**
     * Platform is the optional platform/channel the task targets
     * (e.g. Instagram, TikTok, Email). Up to 100 chars. JSON null
     * when NULL in DB.
     */
    platform?: 'instagram' | 'tiktok' | 'email' | 'discord' | 'x' | 'bluesky' | 'youtube' | 'soundcloud' | 'other';
    /**
     * ScheduledAt is the optional target execution time (UTC).
     * JSON null when NULL in DB.
     */
    scheduled_at?: string;
    /**
     * Status is the current status. One of `pending |
     * in_progress | done | cancelled`. Defaults to `pending`.
     */
    status?: 'pending' | 'in_progress' | 'done' | 'cancelled';
    /**
     * Title is the short task title (1-255 chars).
     */
    title?: string;
    /**
     * UpdatedAt is the row last-update timestamp (UTC). now(timezone.utc)`
     * (
         * in every UPDATE statement.
         */
        updated_at?: string;
    };

