/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OwnRecordingOut } from './OwnRecordingOut';
export type OwnRecordingsOut = {
    /**
     * Count is the number of recordings in this response page.
     */
    count?: number;
    /**
     * Recordings are the caller's recordings. Never null.
     */
    recordings?: Array<OwnRecordingOut>;
};

