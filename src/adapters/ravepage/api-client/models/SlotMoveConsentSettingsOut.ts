/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformerID } from './PerformerID';
import type { SlotMoveConsentEntryOut } from './SlotMoveConsentEntryOut';
export type SlotMoveConsentSettingsOut = {
    /**
     * AllowWithoutConfirmation is the global default (OFF by default):
     * when true, ANY organizer's slot move applies confirmed unless a
     * per-grantee entry denies it.
     */
    allow_without_confirmation?: boolean;
    /**
     * Entries is the per-grantee override list, newest first. Always
     * non-nil (empty array when none).
     */
    entries?: Array<SlotMoveConsentEntryOut>;
    /**
     * PerformerID - `perf_<uuid>`.
     */
    performer_id?: PerformerID;
};

