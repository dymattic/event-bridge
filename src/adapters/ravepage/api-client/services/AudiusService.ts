/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { audiusArtistDetailOut } from '../models/audiusArtistDetailOut';
import type { audiusSearchOut } from '../models/audiusSearchOut';
import type { AudiusTrackOut } from '../models/AudiusTrackOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AudiusService {
    /**
     * Get one cached Audius artist + catalog
     * ANONYMOUS. `identifier` is the hashed Audius user id OR the @handle. Returns the artist plus their cached tracks.
     * @returns audiusArtistDetailOut OK
     * @throws ApiError
     */
    public static getAudiusArtist({
        identifier,
        limit,
    }: {
        /**
         * Audius user id (hashed) or @handle
         */
        identifier: any,
        /**
         * Max tracks (default 50, cap 200)
         */
        limit?: any,
    }): CancelablePromise<audiusArtistDetailOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/audius/artists/{identifier}',
            path: {
                'identifier': identifier,
            },
            query: {
                'limit': limit,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Search cached Audius tracks
     * ANONYMOUS. Free-text search (title / artist / genre / tags) over the Audius track cache. Cache-only - never calls Audius live. Set/mix rows are excluded. Each row carries `playable` (= the API's access.stream gate): false means the track is token/NFT-gated and MUST NOT be streamed, only linked. `license` is the uploader's declared license - render it, the Open Music License requires attribution when streaming Audius audio.
     * @returns audiusSearchOut OK
     * @throws ApiError
     */
    public static searchAudiusTracks({
        query,
        limit,
        offset,
    }: {
        /**
         * Search text
         */
        query: any,
        /**
         * Max rows (default 20, cap 200)
         */
        limit?: any,
        /**
         * Offset
         */
        offset?: any,
    }): CancelablePromise<audiusSearchOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/audius/search',
            query: {
                'query': query,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get one cached Audius track
     * ANONYMOUS. `track_id` is the SHORT HASHED Audius id (e.g. `WNPPk`), not the numeric id. Honor `playable` (= access.stream) and render `license` (OML attribution).
     * @returns AudiusTrackOut OK
     * @throws ApiError
     */
    public static getAudiusTrack({
        trackId,
    }: {
        /**
         * Audius track id (hashed, e.g. WNPPk)
         */
        trackId: any,
    }): CancelablePromise<AudiusTrackOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/audius/tracks/{track_id}',
            path: {
                'track_id': trackId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Trending cached Audius tracks
     * ANONYMOUS. The most-played cached Audius tracks, optionally filtered by genre. STREAMABLE ONLY - a discovery rail never surfaces a track the player cannot legally play. Cache-only; never calls Audius live.
     * @returns audiusSearchOut OK
     * @throws ApiError
     */
    public static listAudiusTrending({
        genre,
        limit,
    }: {
        /**
         * Genre filter
         */
        genre?: any,
        /**
         * Max rows (default 20, cap 100)
         */
        limit?: any,
    }): CancelablePromise<audiusSearchOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/external/audius/trending',
            query: {
                'genre': genre,
                'limit': limit,
            },
        });
    }
}
