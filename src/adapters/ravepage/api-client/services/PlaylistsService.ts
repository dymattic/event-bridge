/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaylistBrowseOut } from '../models/PlaylistBrowseOut';
import type { PlaylistCreateIn } from '../models/PlaylistCreateIn';
import type { PlaylistItemsPutIn } from '../models/PlaylistItemsPutIn';
import type { PlaylistListOut } from '../models/PlaylistListOut';
import type { PlaylistOut } from '../models/PlaylistOut';
import type { PlaylistUpdateIn } from '../models/PlaylistUpdateIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlaylistsService {
    /**
     * List the caller's playlists
     * Returns the caller's own playlists plus playlists shared with them via an ACCEPTED grant (direct user grants and group grants whose group-membership role meets the grant's min_group_role). Each row carries `access` (owner|shared) and, for shared rows, `shared_role` (viewer|editor). Public playlists the caller has no relation to are NOT listed here - browse them via GET /playlists/browse.
     * @returns PlaylistListOut OK
     * @throws ApiError
     */
    public static listPlaylists(): CancelablePromise<PlaylistListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/playlists',
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Create a playlist
     * Creates a playlist owned by the caller. `visibility` defaults to `private`; `public` lists it on the Workshop browse surface, `unlisted` makes it readable by anyone holding the id. Items are written separately via PUT /playlists/{id}/items.
     * @returns PlaylistOut Created
     * @throws ApiError
     */
    public static createPlaylist({
        requestBody,
    }: {
        /**
         * Playlist create payload (title required)
         */
        requestBody: PlaylistCreateIn,
    }): CancelablePromise<PlaylistOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/playlists',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Browse public playlists
     * Public-visibility playlists, newest first - the v1 Workshop browse surface. Optional `q` filters by case-insensitive title substring. Paginate with `limit` (1-100, default 50) and `offset`.
     * @returns PlaylistBrowseOut OK
     * @throws ApiError
     */
    public static browsePlaylists({
        q,
        limit,
        offset,
    }: {
        /**
         * Title substring filter
         */
        q?: any,
        /**
         * Page size (1-100; default 50)
         */
        limit?: any,
        /**
         * Row offset (default 0)
         */
        offset?: any,
    }): CancelablePromise<PlaylistBrowseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/playlists/browse',
            query: {
                'q': q,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Authentication required`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Delete a playlist
     * Owner only - editor grants cannot delete. Items cascade; share grants on the playlist become inert (the access predicate re-checks the playlist row on every read). Foreign/unknown ids are a BOLA-safe 404.
     * @returns void
     * @throws ApiError
     */
    public static deletePlaylist({
        playlistId,
    }: {
        /**
         * Playlist ID (pl_<uuid> or bare UUID)
         */
        playlistId: any,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/playlists/{playlist_id}',
            path: {
                'playlist_id': playlistId,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found (or not the owner)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Get one playlist
     * Access-gated read: the owner, holders of an accepted grant (direct or via qualifying group membership), or - for public/unlisted visibility - any authenticated caller. Denied/unknown ids surface as a BOLA-safe 404. `?include=items` embeds the ordered item list (title/artist snapshots - readable without access to the owner's library).
     * @returns PlaylistOut OK
     * @throws ApiError
     */
    public static getPlaylist({
        playlistId,
        include,
    }: {
        /**
         * Playlist ID (pl_<uuid> or bare UUID)
         */
        playlistId: any,
        /**
         * Set to `items` to embed the ordered items
         */
        include?: any,
    }): CancelablePromise<PlaylistOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/playlists/{playlist_id}',
            path: {
                'playlist_id': playlistId,
            },
            query: {
                'include': include,
            },
            errors: {
                401: `Authentication required`,
                404: `Not found (or no access)`,
                422: `Malformed id`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Update a playlist
     * Patches title/description/visibility. Allowed for the OWNER or holders of an accepted EDITOR grant. Viewer-grant / public readers get 403; no read access at all is a BOLA-safe 404.
     * @returns PlaylistOut OK
     * @throws ApiError
     */
    public static updatePlaylist({
        playlistId,
        requestBody,
    }: {
        /**
         * Playlist ID (pl_<uuid> or bare UUID)
         */
        playlistId: any,
        /**
         * Partial update
         */
        requestBody: PlaylistUpdateIn,
    }): CancelablePromise<PlaylistOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/playlists/{playlist_id}',
            path: {
                'playlist_id': playlistId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body`,
                401: `Authentication required`,
                403: `Read access but no write grant`,
                404: `Not found (or no access)`,
                422: `Validation failed`,
                500: `Internal error`,
            },
        });
    }
    /**
     * Replace or append a playlist's items
     * Ordered items write (≤1000 items per request) for the OWNER or accepted EDITOR grant holders. Each item links a canonical track (`canonical_track_id`), one of the CALLER's own library rows (`library_track_id` - foreign rows are rejected), or neither (free-text; `title` required). Title/artist are snapshotted at write time from the linked source so shared viewers render content without access to the owner's library. Positions are the array order. With `append:false` (default) this is a replace-all write, byte-compatible for existing clients. With `append:true` the items are added AFTER the current tail (positions continue from the current max) - the primitive for syncing a playlist larger than the per-request cap as a sequence of chunks: send the first ≤1000 items as a replace, then each further chunk as an append. Set `expect_count` on an append to the playlist's expected current item count; a mismatch (a torn/racing push) is rejected 409 with no rows written. A playlist may hold at most 25000 items total; an append past that is 422. An empty append is a no-op success returning the current playlist.
     * @returns PlaylistOut Playlist with the fresh items embedded
     * @throws ApiError
     */
    public static putPlaylistItems({
        playlistId,
        requestBody,
    }: {
        /**
         * Playlist ID (pl_<uuid> or bare UUID)
         */
        playlistId: any,
        /**
         * Ordered items (≤1000); optional append + expect_count
         */
        requestBody: PlaylistItemsPutIn,
    }): CancelablePromise<PlaylistOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/playlists/{playlist_id}/items',
            path: {
                'playlist_id': playlistId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON body or malformed item id`,
                401: `Authentication required`,
                403: `Read access but no write grant`,
                404: `Not found (or no access)`,
                409: `append expect_count did not match the current item count`,
                422: `Item validation failed (per-request cap, total cap, both ids, foreign library row, missing title)`,
                500: `Internal error`,
            },
        });
    }
}
