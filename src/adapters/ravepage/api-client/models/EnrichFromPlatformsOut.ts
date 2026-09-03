/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichLinkOut } from './EnrichLinkOut';
export type EnrichFromPlatformsOut = {
    /**
     * AlreadyLinked - matches already attached to THIS track.
     */
    already_linked?: Array<EnrichLinkOut>;
    /**
     * Conflicts - matches already attached to a DIFFERENT track (skipped,
     * never stolen).
     */
    conflicts?: Array<EnrichLinkOut>;
    /**
     * Linked - newly written external-id suggestions.
     */
    linked?: Array<EnrichLinkOut>;
    /**
     * NoReliableSignal - true when the track has NEITHER an artist NOR an
     * ISRC after aggregating structured credits, DJ library file-tags and
     * the consensus ledger. Nothing was matched or written; the FE should
     * prompt the user to add an artist or ISRC before enriching (title/
     * duration-only linking is banned).
     */
    no_reliable_signal?: boolean;
    /**
     * TrackID - the enriched track (bare UUID).
     */
    track_id?: string;
};

