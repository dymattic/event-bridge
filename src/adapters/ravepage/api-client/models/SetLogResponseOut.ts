/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SetLogEntryOut } from './SetLogEntryOut';
export type SetLogResponseOut = {
    /**
     * Count is the PAGE-local count (len(entries)), NOT the total
     * across all pages.
     * `count=len(entries)` verbatim; the Go port mirrors. A future
     * `X-Total-Count` response header would be additive, not breaking.
     */
    count?: number;
    /**
     * Entries is the per-page list of set-log entries, in
     * (loaded_at ASC, created_at ASC) order. Always non-nil - zero
     * matches wire-emits `[]` not `null`.
     */
    entries?: Array<SetLogEntryOut>;
    stream_id?: string;
};

