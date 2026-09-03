/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DjSetsService {
    /**
     * Create a DJ set (retired)
     * Returns 410 Gone - DJ-sets are gone. Use `POST /releases` with `type=djset` instead. The Location header points at the canonical replacement. See project memory `project_djset_retired` (2026-05-22). parity (deprecated)
     * @returns void
     * @throws ApiError
     */
    public static createDjSetDeprecated(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dj-sets',
            errors: {
                401: `Authentication required`,
                410: `DJ-set resource retired; use POST /releases (type=djset)`,
            },
        });
    }
    /**
     * Get DJ set timeline (retired)
     * Returns 410 Gone - DJ-sets are gone. Use `GET /tracklists/{tracklist_id}` for tracklist payload. See `project_djset_retired`. parity (deprecated)
     * @returns void
     * @throws ApiError
     */
    public static getDjSetTimelineDeprecated({
        setId,
    }: {
        /**
         * DJ set UUID (unused; 410)
         */
        setId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dj-sets/{set_id}/timeline',
            path: {
                'set_id': setId,
            },
            errors: {
                401: `Authentication required`,
                410: `DJ-set resource retired; use GET /tracklists/{tracklist_id}`,
                422: `Invalid set_id`,
            },
        });
    }
    /**
     * Upload audio to a DJ set (retired)
     * Returns 410 Gone - DJ-sets are gone. See `project_djset_retired`. parity (deprecated)
     * @returns void
     * @throws ApiError
     */
    public static uploadDjSetAudioDeprecated({
        setId,
    }: {
        /**
         * DJ set UUID (unused; 410)
         */
        setId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dj-sets/{set_id}/upload-audio',
            path: {
                'set_id': setId,
            },
            errors: {
                401: `Authentication required`,
                410: `DJ-set resource retired`,
                422: `Invalid set_id`,
            },
        });
    }
    /**
     * Upload tracklist to a DJ set (retired)
     * Returns 410 Gone - DJ-sets are gone. Use `POST /tracklists/upload` to import a tracklist, then link via `POST /tracklists/link/...` flows. See `project_djset_retired`. parity (deprecated)
     * @returns void
     * @throws ApiError
     */
    public static uploadDjSetTracklistDeprecated({
        setId,
    }: {
        /**
         * DJ set UUID (unused; 410)
         */
        setId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dj-sets/{set_id}/upload-tracklist',
            path: {
                'set_id': setId,
            },
            errors: {
                401: `Authentication required`,
                410: `DJ-set resource retired; use POST /tracklists/upload`,
                422: `Invalid set_id`,
            },
        });
    }
}
