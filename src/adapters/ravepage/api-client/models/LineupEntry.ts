/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventPerformerID } from './EventPerformerID';
import type { PerformerID } from './PerformerID';
export type LineupEntry = {
    billing_order?: number;
    ends_at?: string;
    genre_tags?: Array<string>;
    id?: EventPerformerID;
    is_current?: boolean;
    is_headliner?: boolean;
    performer_avatar_url?: string;
    performer_id?: PerformerID;
    performer_name?: string;
    performer_slug?: string;
    slot_title?: string;
    stage_name?: string;
    starts_at?: string;
};

