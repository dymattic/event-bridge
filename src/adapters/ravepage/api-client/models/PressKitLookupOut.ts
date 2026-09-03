/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PressKitOut } from './PressKitOut';
export type PressKitLookupOut = {
    /**
     * Items maps a profile's BARE-UUID string to its press kit. The key
     * is normalized to bare-UUID regardless of whether the request asked
     * for the bare or `pro_`-prefixed form; the PressKitOut inside still
     * carries the prefixed id.
     *
     * Entries are present ONLY for profiles that exist AND are viewable
     * by the caller. Missing, private, unpublished, and orphaned
     * profiles are silently ABSENT from the map - BOLA-safe: the map
     * never distinguishes "not found" from "not allowed".
     *
     * Always non-nil on the wire (`{}` when nothing matches) - NOT
     * omitempty - so consumers can distinguish a legitimately empty
     * result from an absent-field serialization bug. Mirrors
     * `LookupPerformersResponse.Performers`.
     */
    items?: Record<string, PressKitOut>;
};

