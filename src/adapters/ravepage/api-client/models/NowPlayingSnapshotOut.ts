/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NowPlayingMatchOut } from './NowPlayingMatchOut';
export type NowPlayingSnapshotOut = {
    /**
     * Channels is the per-channel state map keyed by channel id
     * ("1", "2", …). Same non-nil + pass-through guarantees as
     * `Decks`.
     */
    channels?: Record<string, Array<number>>;
    /**
     * Decks is the per-deck state map keyed by deck id ("A", "B", …).
     * Always non-nil - an empty snapshot emits `{}`, never `null`.
     */
    decks?: Record<string, Array<number>>;
    /**
     * Master is the global master-clock state.
     * Never null - service layer guarantees the literal `{}` when the
     * row's master block is absent.
     */
    master?: Array<number>;
    /**
     * Match is the hydrated catalog match for the currently-loaded
     * track - the live matcher chain's top candidate, enriched with
     * title + credited artists + buy/stream provider links so the
     * renderer needs no second fetch. Null when no match has been
     * computed for the active deck.
     */
    match?: NowPlayingMatchOut;
    stream_id?: string;
    /**
     * UpdatedAt is the snapshot's last-write timestamp.
     */
    updated_at?: string;
    /**
     * Version is the monotonic counter incremented per merged ingest
     * frame. `snapshot_version` (
         */
        version?: number;
    };

