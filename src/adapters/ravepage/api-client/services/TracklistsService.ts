/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TrackLinkCreateIn } from '../models/TrackLinkCreateIn';
import type { TrackLinkOut } from '../models/TrackLinkOut';
import type { TrackLinkUpdateIn } from '../models/TrackLinkUpdateIn';
import type { TracklistCreateIn } from '../models/TracklistCreateIn';
import type { TracklistFormatOut } from '../models/TracklistFormatOut';
import type { TracklistLinkSoundCloudIn } from '../models/TracklistLinkSoundCloudIn';
import type { TracklistLinkYouTubeIn } from '../models/TracklistLinkYouTubeIn';
import type { TracklistMusicBrainzSearchOut } from '../models/TracklistMusicBrainzSearchOut';
import type { TracklistOut } from '../models/TracklistOut';
import type { TracklistSoundCloudSearchOut } from '../models/TracklistSoundCloudSearchOut';
import type { TracklistUpdateIn } from '../models/TracklistUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TracklistsService {
    /**
     * List the caller's tracklists
     * Returns every tracklist the caller is a member of via `tracklist_users` (M2M), each with its `tracks` array populated in track order. Sortable by `name` / `imported_at` / `created_at` / `updated_at`; prefix `-` for descending. Unknown sort fields silently fall back to insertion order . `users` / `youtube_videos` / `soundcloud_tracks` embeds are `[]` - call `GET /tracklists/{tracklist_id}` for those.
     * @returns TracklistOut OK
     * @throws ApiError
     */
    public static listTracklists({
        sort,
    }: {
        /**
         * Sort field; prefix '-' for descending (default '-imported_at')
         */
        sort?: any,
    }): CancelablePromise<Array<TracklistOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracklists',
            query: {
                'sort': sort,
            },
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a tracklist
     * Creates a new tracklist owned by the authenticated caller, optionally pre-populated with a `tracks` array (capped at 10,000 items). Each item is also Upserted into the caller's library (`user_library_tracks`), so the response items carry the hydrated `library_track_id` / `canonical_track_id` / `canonical_title` / `artwork_url` / `match_*` fields once resolved (unknown tracks ride the async canonical-rematch pipeline).
     * @returns TracklistOut Created
     * @throws ApiError
     */
    public static createTracklist({
        requestBody,
    }: {
        /**
         * Tracklist create payload
         */
        requestBody: TracklistCreateIn,
    }): CancelablePromise<TracklistOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracklists',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                413: `Too many items (>10,000)`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Detect tracklist file format
     * Sniffs a tracklist file's contents and returns the detected format string. Returns 400 when no format can be detected. Pure in-process - no DB, no external HTTP. py:496-534`.
     * @returns TracklistFormatOut OK
     * @throws ApiError
     */
    public static detectTracklistFormat({
        formData,
    }: {
        formData: {
            /**
             * Tracklist file to sniff
             */
            file: Blob;
        },
    }): CancelablePromise<TracklistFormatOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracklists/detect-format',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Format not detected or invalid multipart body`,
                401: `Authentication required`,
                413: `File too large (>10 MB)`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Link a SoundCloud track to a tracklist
     * Attaches a SoundCloud track to a tracklist via the cross-worker social-platforms entity-links contract. Caller must be a member of the tracklist (or platform admin); BOLA-safe 404 otherwise.
     * @returns TracklistOut OK
     * @throws ApiError
     */
    public static linkSoundcloudToTracklist({
        requestBody,
    }: {
        /**
         * Link payload (tracklist_id required; provide soundcloud_track_id OR soundcloud_track_uuid)
         */
        requestBody: TracklistLinkSoundCloudIn,
    }): CancelablePromise<TracklistOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracklists/link/soundcloud',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Tracklist or SoundCloud track not found`,
                422: `Missing/invalid tracklist_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Link a YouTube video to a tracklist
     * Attaches a YouTube video to a tracklist via the cross-worker social-platforms entity-links contract.
     * @returns TracklistOut OK
     * @throws ApiError
     */
    public static linkYoutubeToTracklist({
        requestBody,
    }: {
        /**
         * Link payload (tracklist_id required; provide youtube_video_id OR youtube_video_uuid)
         */
        requestBody: TracklistLinkYouTubeIn,
    }): CancelablePromise<TracklistOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracklists/link/youtube',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Tracklist or YouTube video not found`,
                422: `Missing/invalid tracklist_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlink a SoundCloud track from a tracklist
     * Removes the tracklist-SoundCloud-link row via the cross-worker social-platforms entity-links contract. Caller must be a tracklist member (or admin); BOLA-safe 404 otherwise. The `soundcloud_track_id` path segment is the SoundCloud track_id (numeric) per
     * @returns TracklistOut OK
     * @throws ApiError
     */
    public static unlinkSoundcloudFromTracklist({
        tracklistId,
        soundcloudTrackId,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * SoundCloud track_id (numeric) OR cache UUID
         */
        soundcloudTrackId: any,
    }): CancelablePromise<TracklistOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tracklists/unlink/soundcloud/{tracklist_id}/{soundcloud_track_id}',
            path: {
                'tracklist_id': tracklistId,
                'soundcloud_track_id': soundcloudTrackId,
            },
            errors: {
                401: `Authentication required`,
                404: `Tracklist or SoundCloud track not found / not linked`,
                422: `Invalid IDs`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Unlink a YouTube video from a tracklist
     * Removes the tracklist-YouTube-link row via the cross-worker social-platforms entity-links contract. Caller must be a tracklist member (or admin); BOLA-safe 404 otherwise. The `youtube_video_id` segment accepts either a cache-row UUID OR a raw YouTube video ID.
     * @returns TracklistOut OK
     * @throws ApiError
     */
    public static unlinkYoutubeFromTracklist({
        tracklistId,
        youtubeVideoId,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * YouTube cache UUID OR raw YouTube video ID (e.g. 0K1Vld4tKXc)
         */
        youtubeVideoId: any,
    }): CancelablePromise<TracklistOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tracklists/unlink/youtube/{tracklist_id}/{youtube_video_id}',
            path: {
                'tracklist_id': tracklistId,
                'youtube_video_id': youtubeVideoId,
            },
            errors: {
                401: `Authentication required`,
                404: `Tracklist or YouTube video not found / not linked`,
                422: `Invalid tracklist_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Upload a tracklist file
     * Parses a tracklist file (one of: tracktor_html, tracktor_xml, recordbox, serato, virtualdj) and persists a tracklist + items in a single transaction. Each parsed item is also Upserted into the uploader's library (`user_library_tracks`) - an upload is another way of adding tracks to the library; unknown tracks ride the async canonical-rematch pipeline and the response items hydrate `library_track_id` / `canonical_*` / `match_*` once resolved. Caller becomes the tracklist owner (member edge in `tracklist_users`). Multipart body - `file` is required; `name` and `format` optional form fields (`format` overrides content-sniff).
     * @returns TracklistOut OK
     * @throws ApiError
     */
    public static uploadTracklistFile({
        formData,
    }: {
        formData: {
            /**
             * Tracklist file (max 10 MiB)
             */
            file: Blob;
            /**
             * Force format (else content-sniff)
             */
            format?: 'tracktor_html' | 'tracktor_xml' | 'recordbox' | 'serato' | 'virtualdj';
            /**
             * Tracklist display name (defaults to original filename)
             */
            name?: string;
        },
    }): CancelablePromise<TracklistOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracklists/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Could not detect/parse file`,
                401: `Authentication required`,
                413: `File too large (>10 MiB) or too many tracks (>10000)`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a tracklist
     * Deletes a tracklist + cascades to `tracklist_items` and `tracklist_users` in one transaction. Caller must be a member (or platform admin). BOLA-safe 404 when not a member.
     * @returns void
     * @throws ApiError
     */
    public static deleteTracklist({
        tracklistId,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tracklists/{tracklist_id}',
            path: {
                'tracklist_id': tracklistId,
            },
            errors: {
                401: `Authentication required`,
                404: `Tracklist not found`,
                422: `Invalid tracklist_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get a tracklist by ID
     * Anonymous-allowed. Returns the tracklist + its items in track-number order, per-item track links, and the hydrated `users` / `youtube_videos` / `soundcloud_tracks` embeds (cross-worker; fail-open to `[]` on hydrator outage). `sets[]` carries the sets (recordings) that reference this tracklist, VISIBILITY-FILTERED for the caller: anonymous callers see public/unlisted sets only; an authenticated caller additionally sees their own and `logged_in` ones. Never null.
     * @returns TracklistOut OK
     * @throws ApiError
     */
    public static getTracklist({
        tracklistId,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
    }): CancelablePromise<TracklistOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracklists/{tracklist_id}',
            path: {
                'tracklist_id': tracklistId,
            },
            errors: {
                404: `Tracklist not found`,
                422: `Invalid tracklist_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a tracklist (rename only)
     * Renames a tracklist. Caller must be a member of the tracklist via `tracklist_users` (or a platform admin). BOLA-safe 404 when not a member.
     * @returns TracklistOut OK
     * @throws ApiError
     */
    public static updateTracklist({
        tracklistId,
        requestBody,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * Tracklist update payload (name only effective in Go port)
         */
        requestBody: TracklistUpdateIn,
    }): CancelablePromise<TracklistOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tracklists/{tracklist_id}',
            path: {
                'tracklist_id': tracklistId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Tracklist not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * List links for a tracklist item
     * Returns every link row attached to the item, ordered by `created_at` ASC. Caller must be a member of the parent tracklist (or admin); BOLA-safe 404 otherwise.
     * @returns TrackLinkOut OK
     * @throws ApiError
     */
    public static listTrackLinks({
        tracklistId,
        itemId,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * Tracklist item UUID
         */
        itemId: any,
    }): CancelablePromise<Array<TrackLinkOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tracklists/{tracklist_id}/items/{item_id}/links',
            path: {
                'tracklist_id': tracklistId,
                'item_id': itemId,
            },
            errors: {
                401: `Authentication required`,
                404: `Tracklist item not found`,
                422: `Invalid IDs`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a track link
     * Inserts a new link row for the given tracklist item. Caller must be a member of the parent tracklist (or admin); BOLA-safe 404 otherwise.
     * @returns TrackLinkOut Created
     * @throws ApiError
     */
    public static createTrackLink({
        tracklistId,
        itemId,
        requestBody,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * Tracklist item UUID
         */
        itemId: any,
        /**
         * Track link create payload
         */
        requestBody: TrackLinkCreateIn,
    }): CancelablePromise<TrackLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracklists/{tracklist_id}/items/{item_id}/links',
            path: {
                'tracklist_id': tracklistId,
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Tracklist item not found`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a track link
     * Deletes a track link row. Caller must be a member of the parent tracklist (or admin); BOLA-safe 404 otherwise.
     * @returns void
     * @throws ApiError
     */
    public static deleteTrackLink({
        tracklistId,
        itemId,
        linkId,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * Tracklist item UUID
         */
        itemId: any,
        /**
         * Track link UUID
         */
        linkId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tracklists/{tracklist_id}/items/{item_id}/links/{link_id}',
            path: {
                'tracklist_id': tracklistId,
                'item_id': itemId,
                'link_id': linkId,
            },
            errors: {
                401: `Authentication required`,
                404: `Track link not found`,
                422: `Invalid IDs`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a track link
     * Updates a track link row. Caller must be a member of the parent tracklist (or admin); BOLA-safe 404 otherwise.
     * @returns TrackLinkOut OK
     * @throws ApiError
     */
    public static updateTrackLink({
        tracklistId,
        itemId,
        linkId,
        requestBody,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * Tracklist item UUID
         */
        itemId: any,
        /**
         * Track link UUID
         */
        linkId: any,
        /**
         * Track link update payload
         */
        requestBody: TrackLinkUpdateIn,
    }): CancelablePromise<TrackLinkOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tracklists/{tracklist_id}/items/{item_id}/links/{link_id}',
            path: {
                'tracklist_id': tracklistId,
                'item_id': itemId,
                'link_id': linkId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request body`,
                401: `Authentication required`,
                404: `Track link not found`,
                422: `Invalid IDs`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Search MusicBrainz for tracklist links
     * Searches MusicBrainz for each item in the tracklist and returns link suggestions per row. Per-item failures are captured in the row's `error` field rather than failing the whole batch.
     * @returns TracklistMusicBrainzSearchOut OK
     * @throws ApiError
     */
    public static searchMusicbrainzForTracklist({
        tracklistId,
        limitPerTrack,
        useApiFallback,
        includeReleaseLinks,
        includeReleaseGroupLinks,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * Max suggestions per track (1-50; default 10)
         */
        limitPerTrack?: any,
        /**
         * Accepted but ignored
         */
        useApiFallback?: any,
        /**
         * Accepted but ignored
         */
        includeReleaseLinks?: any,
        /**
         * Accepted but ignored
         */
        includeReleaseGroupLinks?: any,
    }): CancelablePromise<TracklistMusicBrainzSearchOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracklists/{tracklist_id}/search/musicbrainz',
            path: {
                'tracklist_id': tracklistId,
            },
            query: {
                'limit_per_track': limitPerTrack,
                'use_api_fallback': useApiFallback,
                'include_release_links': includeReleaseLinks,
                'include_release_group_links': includeReleaseGroupLinks,
            },
            errors: {
                401: `Authentication required`,
                404: `Tracklist not found (BOLA-safe; member or admin required)`,
                422: `Invalid tracklist_id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Search SoundCloud for tracklist links
     * Per-item failures captured in the row's `error` field. Caller must be a tracklist member (or admin); BOLA-safe 404 otherwise.
     * @returns TracklistSoundCloudSearchOut OK
     * @throws ApiError
     */
    public static searchSoundcloudForTracklist({
        tracklistId,
        limitPerTrack,
    }: {
        /**
         * Tracklist ID (bare UUID or tl_<uuid>)
         */
        tracklistId: any,
        /**
         * Max suggestions per track (1-20; default 5)
         */
        limitPerTrack?: any,
    }): CancelablePromise<TracklistSoundCloudSearchOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tracklists/{tracklist_id}/search/soundcloud',
            path: {
                'tracklist_id': tracklistId,
            },
            query: {
                'limit_per_track': limitPerTrack,
            },
            errors: {
                401: `Authentication required or SoundCloud token expired`,
                403: `Caller has not linked their SoundCloud account`,
                404: `Tracklist not found (BOLA-safe; member or admin required)`,
                422: `Invalid tracklist_id`,
                500: `Internal error`,
                502: `SoundCloud upstream failure`,
            },
        });
    }
}
