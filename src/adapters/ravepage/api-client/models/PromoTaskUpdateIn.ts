/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PromoTaskUpdateIn = {
    notes?: string;
    platform?: 'instagram' | 'tiktok' | 'email' | 'discord' | 'x' | 'bluesky' | 'youtube' | 'soundcloud' | 'other';
    scheduled_at?: string;
    status?: 'pending' | 'in_progress' | 'done' | 'cancelled';
    title?: string;
};

