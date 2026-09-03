/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SetsService {
    /**
     * Get tracklist data for a set (retired)
     * Returns 410 Gone. The `{set_id}` segment was never a set id - it was read as a TRACKLIST id, and every failure answered `200 {"tracks":[]}`, so callers got no signal. Use `GET /tracklists/{tracklist_id}` (same id, full payload, honest 404). The Location header points at the replacement.
     * @returns void
     * @throws ApiError
     */
    public static getSetTracklist({
        setId,
    }: {
        /**
         * Unused; the value was always a tracklist id
         */
        setId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sets/{set_id}/tracklist',
            path: {
                'set_id': setId,
            },
            errors: {
                410: `Route retired; use GET /tracklists/{tracklist_id}`,
            },
        });
    }
}
